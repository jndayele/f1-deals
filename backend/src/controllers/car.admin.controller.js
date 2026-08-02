const prisma = require('../config/prisma');
const supabase = require('../config/supabase');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');
const { invalidateCache } = require('../middleware/cache.middleware');
const socket = require('../config/socket');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'car-media';

exports.listCars = async (req, res) => {
  try {
    const { page, pageSize, skip, take } = getPaginationParams(req);
    const { minPrice, maxPrice, make, year, bodyType, condition, status, search } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (make) where.make = { equals: make, mode: 'insensitive' };
    if (year) where.year = parseInt(year, 10);
    if (bodyType) where.bodyType = { equals: bodyType, mode: 'insensitive' };
    if (condition) where.condition = condition;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [totalCount, cars] = await Promise.all([
      prisma.car.count({ where }),
      prisma.car.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          media: {
            orderBy: { order: 'asc' },
            take: 1
          }
        }
      })
    ]);

    const formattedCars = cars.map(car => {
      const coverPhotoUrl = car.media.length > 0 ? car.media[0].url : null;
      return {
        ...car,
        isSold: car.status === 'Sold',
        coverPhotoUrl,
        media: undefined // exclude raw media array
      };
    });

    res.status(200).json({
      success: true,
      data: formatPaginatedResponse(formattedCars, totalCount, page, pageSize)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.createCar = async (req, res) => {
  try {
    const { title, make, model, year, price, mileage, transmission, fuelType, bodyType, condition, description } = req.body;
    
    const car = await prisma.car.create({
      data: {
        title, make, model, year: parseInt(year), price: parseFloat(price), 
        mileage: parseInt(mileage), transmission, fuelType, bodyType, condition, description
      },
      include: { media: true }
    });

    // Emit event for real-time client updates
    try {
      socket.getIO().emit('new_listing', car);
    } catch (e) {
      console.error('Socket error emitting new_listing:', e);
    }

    await invalidateCache('cache:cars');
    res.status(201).json({ success: true, data: car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);
    const data = { ...req.body };
    if (data.year) data.year = parseInt(data.year);
    if (data.price) data.price = parseFloat(data.price);
    if (data.mileage) data.mileage = parseInt(data.mileage);

    const car = await prisma.car.update({
      where: { id: carId },
      data,
      include: { media: { orderBy: { order: 'asc' } } }
    });

    await invalidateCache('cache:cars');
    try {
      socket.getIO().emit('car_updated', car);
    } catch (e) {
      console.error('Socket error emitting car_updated:', e);
    }
    res.status(200).json({ success: true, data: car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);
    const { status } = req.body; // 'Available', 'Sold', 'Archived'

    if (!['Available', 'Sold', 'Archived'].includes(status)) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid status' } });
    }

    const updateData = { status };
    if (status === 'Sold') {
      updateData.soldAt = new Date();
    } else if (status === 'Archived') {
      updateData.archivedAt = new Date();
    }

    const car = await prisma.car.update({
      where: { id: carId },
      data: updateData,
    });

    try {
      socket.getIO().emit('car_updated', car);
    } catch (e) {
      console.error('Socket error emitting car_updated:', e);
    }

    await invalidateCache('cache:cars');
    res.status(200).json({ success: true, data: car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);

    // Fetch all media so we can remove files from Supabase Storage
    const mediaItems = await prisma.carMedia.findMany({ where: { carId } });
    const paths = mediaItems.map(m => m.storagePath).filter(Boolean);
    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
      if (storageError) {
        console.error('Supabase Storage delete error (deleteCar):', storageError);
      }
    }

    // Cascade delete removes CarMedia rows automatically (onDelete: Cascade in schema)
    await prisma.car.delete({ where: { id: carId } });
    await invalidateCache('cache:cars');
    try {
      socket.getIO().emit('car_deleted', { id: carId });
    } catch (e) {
      console.error('Socket error emitting car_deleted:', e);
    }

    res.status(200).json({ success: true, data: { message: 'Car deleted successfully' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

/**
 * Upload a single file buffer to Supabase Storage.
 * Returns { publicUrl, storagePath }.
 */
const uploadToSupabase = async (file, carId) => {
  const ext = file.mimetype.split('/')[1] || 'bin';
  const storagePath = `cars/${carId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { publicUrl: data.publicUrl, storagePath };
};

exports.uploadMedia = async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'No files uploaded' } });
    }

    const existingMedia = await prisma.carMedia.findMany({ where: { carId } });
    let maxOrder = existingMedia.length > 0 ? Math.max(...existingMedia.map(m => m.order)) : -1;

    const uploadedMedia = [];
    for (const file of req.files) {
      const { publicUrl, storagePath } = await uploadToSupabase(file, carId);
      maxOrder += 1;
      const isPhoto = file.mimetype.startsWith('image/');

      const media = await prisma.carMedia.create({
        data: {
          carId,
          isPhoto,
          url: publicUrl,
          storagePath,
          order: maxOrder
        }
      });
      uploadedMedia.push(media);
    }

    await invalidateCache('cache:cars');
    res.status(201).json({ success: true, data: uploadedMedia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.reorderMedia = async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);
    const { orderedMediaIds } = req.body; // array of media ids in desired order

    if (!Array.isArray(orderedMediaIds)) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'orderedMediaIds must be an array' } });
    }

    // Execute within a transaction for safety
    await prisma.$transaction(
      orderedMediaIds.map((id, index) =>
        prisma.carMedia.update({
          where: { id: parseInt(id, 10) },
          data: { order: index },
        })
      )
    );

    const updatedMedia = await prisma.carMedia.findMany({
      where: { carId },
      orderBy: { order: 'asc' }
    });

    await invalidateCache('cache:cars');
    res.status(200).json({ success: true, data: updatedMedia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);
    const mediaId = parseInt(req.params.mediaId, 10);

    const media = await prisma.carMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.carId !== carId) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } });
    }

    // Remove from Supabase Storage
    if (media.storagePath) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([media.storagePath]);
      if (storageError) {
        console.error('Supabase Storage delete error:', storageError);
      }
    }

    await prisma.carMedia.delete({ where: { id: mediaId } });
    await invalidateCache('cache:cars');
    res.status(200).json({ success: true, data: { message: 'Media deleted successfully' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

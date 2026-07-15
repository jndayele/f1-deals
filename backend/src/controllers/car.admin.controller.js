const prisma = require('../config/prisma');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');
const { invalidateCache } = require('../middleware/cache.middleware');

exports.listCars = async (req, res) => {
  try {
    const { page, pageSize, skip, take } = getPaginationParams(req);
    const { minPrice, maxPrice, make, year, bodyType, condition, status } = req.query;

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
    await prisma.car.delete({ where: { id: carId } });
    await invalidateCache('cache:cars');
    res.status(200).json({ success: true, data: { message: 'Car deleted successfully' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'f1deals' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
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
      const result = await uploadToCloudinary(file);
      maxOrder += 1;
      const isPhoto = result.resource_type === 'image';

      const media = await prisma.carMedia.create({
        data: {
          carId,
          isPhoto,
          url: result.secure_url,
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

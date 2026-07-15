const prisma = require('../config/prisma');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

exports.listCars = async (req, res) => {
  try {
    const { page, pageSize, skip, take } = getPaginationParams(req);
    const { minPrice, maxPrice, make, year, bodyType, condition } = req.query;

    const where = {
      status: { in: ['Available', 'Sold'] },
    };

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
        id: car.id,
        title: car.title,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        transmission: car.transmission,
        fuelType: car.fuelType,
        bodyType: car.bodyType,
        condition: car.condition,
        status: car.status,
        isSold: car.status === 'Sold',
        coverPhotoUrl
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

exports.getCarDetail = async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);
    if (isNaN(carId)) return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid ID' } });

    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        media: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!car) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Car not found' } });
    }

    const coverPhotoUrl = car.media.length > 0 ? car.media[0].url : null;
    
    const carDetail = {
      id: car.id,
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      transmission: car.transmission,
      fuelType: car.fuelType,
      bodyType: car.bodyType,
      condition: car.condition,
      description: car.description,
      status: car.status,
      isSold: car.status === 'Sold',
      soldAt: car.soldAt,
      coverPhotoUrl,
      media: car.media.map(m => ({
        id: m.id,
        isPhoto: m.isPhoto,
        url: m.url,
        order: m.order
      }))
    };

    res.status(200).json({ success: true, data: carDetail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
  }
};

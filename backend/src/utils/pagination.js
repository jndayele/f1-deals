exports.getPaginationParams = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.page_size, 10) || 20;
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
};

exports.formatPaginatedResponse = (data, totalCount, page, pageSize) => {
  return {
    items: data,
    currentPage: page,
    pageSize: pageSize,
    totalCount: totalCount
  };
};

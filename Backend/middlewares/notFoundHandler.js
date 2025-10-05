const notFoundHandler = (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`);
  error.statusCode = 404;
  next(error);
};

export { notFoundHandler };

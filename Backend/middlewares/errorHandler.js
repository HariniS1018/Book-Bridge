const errorHandler = (err, req, res, next) => {
  console.error("[Global Error Handler] Caught an error:", err);

  const statusCode = err.statusCode || 500;   // sets statuscode from the error object or defaults to 500
  let errorMessage = "Internal Server Error";
  let errorStack = null;

  if (process.env.NODE_ENV === "development") {
    errorMessage = err.message;
    errorStack = err.stack; // holds stack trace in development mode
  } else {
    errorMessage =
      statusCode === 500
        ? "Internal Server Error"
        : err.message || "Something went wrong";
  }

  res.status(statusCode).json({
    error: errorMessage,
    ...(process.env.NODE_ENV === "development" && {
      details: err.message,
      stack: errorStack,
    }),
  });
};

export { errorHandler };

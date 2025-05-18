const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((error) => {
      res.status(error.code || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    });
  };
};

export default asyncHandler;

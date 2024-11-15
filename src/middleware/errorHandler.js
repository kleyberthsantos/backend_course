const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        error: 'Validation Error',
        details: err.message
      });
    }
  
    if (err.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid ID format'
      });
    }
  
    res.status(500).json({
      status: 'error',
      error: 'Internal Server Error'
    });
  };
  
  module.exports = errorHandler;
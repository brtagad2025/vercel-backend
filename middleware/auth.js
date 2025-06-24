// Simple authentication middleware (for development)
export const authenticateToken = (req, res, next) => {
  // Skip authentication for development
  console.log('⚠️  Authentication skipped for development');
  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Skip role authorization for development
    console.log('⚠️  Role authorization skipped for development');
    next();
  };
};

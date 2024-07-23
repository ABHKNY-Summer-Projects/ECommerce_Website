const { StatusCodes } = require("http-status-codes");

module.exports = {
  UnauthenticatedError: class UnauthenticatedError extends Error {
    constructor(message) {
      super(message);
      this.name = "UnauthenticatedError";
      this.statusCode = StatusCodes.UNAUTHORIZED;
    }
  },
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor(message) {
      super(message);
      this.name = "UnauthorizedError";
      this.statusCode = StatusCodes.FORBIDDEN;
    }
  },
  // Add other classes following the same pattern when sending errors
};

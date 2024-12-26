class ErrorHandler extends Error {
  constructor(message, statusCode = 500) {
    super(message); // Pass the message to the parent Error class
    this.statusCode = statusCode; // Add the statusCode property
    console.log(message);

    this.name = this.constructor.name; // Set the error name to "ErrorHandler"
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

module.exports = ErrorHandler;

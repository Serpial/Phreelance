class ErrorWithCode extends Error {
  constructor(errorMessage, responseCode) {
    super(errorMessage)
    this.responseCode = responseCode;
  }
}

module.exports = ErrorWithCode;
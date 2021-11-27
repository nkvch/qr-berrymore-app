class GeneralError extends Error {
  constructor(message = 'Error', data = null) {
    super();
    this.message = message;
    this.data = data;
  }
}

export default GeneralError;

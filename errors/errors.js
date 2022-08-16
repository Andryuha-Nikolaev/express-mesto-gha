class NotFound extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

module.exports = NotFound;

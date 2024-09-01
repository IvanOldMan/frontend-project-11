export default class CustomError extends Error {
  constructor(name) {
    super(name);
    this.name = name;
  }
}

import { CustomError } from "./custom-error.model";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super(`No records found with provided params`);
  }
}
import { CustomError } from "./custom-error.model";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor() {
    super("DB connection Failed. Sorry :(");
  }
}
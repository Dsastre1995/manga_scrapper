import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../types";

function handleError (
  error: TypeError | CustomError,
  _request: Request,
  response: Response,
  _next: NextFunction
): void {
  if (error instanceof CustomError) {
    const { statusCode, message } = error;
    response.status(error.statusCode).send({ statusCode, message });
    return;
  }

  response.status(400).send("Something went wrong with what you are requesting...");
}

export default handleError;
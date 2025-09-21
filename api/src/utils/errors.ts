import type { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status';

abstract class HttpException extends Error {
  constructor(readonly code: number, readonly message: string, readonly error?: object[] | object) {
    super(message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(errorCode?: string) {
    super(HttpStatus.UNAUTHORIZED, 'Unauthorized. You must login to access this content.', { error_code: errorCode });
  }
}

export class ValidationException extends HttpException {
  constructor(errors: object[]) {
    super(HttpStatus.BAD_REQUEST, 'Validation Error', errors);
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super(HttpStatus.FORBIDDEN, 'Forbidden. You are not allowed to perform this action');
  }
}

export class NotFoundException extends HttpException {
  constructor(model?: string) {
    super(HttpStatus.NOT_FOUND, `Not found.${model ? " Couldn't find " + model : ''}`);
  }
}

export class ConflictException extends HttpException {
  constructor(errorCode?: string) {
    super(HttpStatus.CONFLICT, 'Conflict', { error_code: errorCode });
  }
}

export function ErrorHandling(error: Error, _req: Request, res: Response, _next: NextFunction): Response {
  if (error instanceof HttpException) {
    return res.status(error.code).json({ message: error.message, code: error.code, errors: error.error });
  }
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message, code: 500 });
}

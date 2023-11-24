import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ExceptionResponse } from '../types/http.types';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = this.getStatusCode<T>(exception);
    const message = this.getErrorMessage<T>(exception);

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorMessage<T>(exception: T) {
    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      const errorMessage =
        (errorResponse as ExceptionResponse).message || exception.message;

      return errorMessage;
    }

    return 'Internal Server Error';
  }

  private getStatusCode<T>(exception: T) {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

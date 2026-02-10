import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getStatus(exception);

    this.logger.error(`Error: ${exception.message}`, exception.stack);

    // Extract detailed error information
    let errorResponse: any = {
      statusCode: status,
      message: exception.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    };

    // If this is a validation error, include the detailed errors
    if (exception.response && typeof exception.response === 'object') {
      if (exception.response.message) {
        errorResponse.message = exception.response.message;
      }
      if (exception.response.error) {
        errorResponse.error = exception.response.error;
      }
      // For NestJS BadRequestException with validation errors
      if (Array.isArray(exception.response.message)) {
        errorResponse.errors = exception.response.message;
      }
    }

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: any): number {
    if (exception.getStatus && typeof exception.getStatus === 'function') {
      return exception.getStatus();
    }

    // Handle QueryFailedError from TypeORM
    if (exception.code === '23503') {
      return HttpStatus.BAD_REQUEST; // Foreign key constraint
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

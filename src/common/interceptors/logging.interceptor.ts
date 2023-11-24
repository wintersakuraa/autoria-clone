import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('Start Request');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`Request Finished: ${Date.now() - now}ms`)),
      );
  }
}

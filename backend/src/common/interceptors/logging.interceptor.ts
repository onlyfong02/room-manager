import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const userAgent = request.get('user-agent') || '';
        const now = Date.now();

        console.log(`[${method}] ${url} - Request Body:`, JSON.stringify(body));

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const response = context.switchToHttp().getResponse();
                    const { statusCode } = response;
                    console.log(
                        `[${method}] ${url} - ${statusCode} - ${Date.now() - now}ms`,
                    );
                },
                error: (error) => {
                    const errorResponse = error.response || {};
                    console.log(
                        `[${method}] ${url} - ERROR: ${error.message} - ${Date.now() - now}ms`,
                    );
                    console.log(`Error Details:`, JSON.stringify(errorResponse, null, 2));
                },
            }),
        );
    }
}


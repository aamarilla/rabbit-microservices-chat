import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { log } from 'console';

@Injectable()
export class MicroserviceCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Get the RPC context for microservices
    const rpcContext = context.switchToRpc();
    const pattern = rpcContext.getContext().getPattern();
    const data = rpcContext.getData();

    // Create a cache key from the message pattern and data
    const cacheKey = this.generateCacheKey(pattern, data);

    // Check if cached value exists
    const cachedValue = await this.cacheManager.get(cacheKey);
    if (cachedValue !== undefined && cachedValue !== null) {
      console.log('Returning cached value for key:', cacheKey);
      return of(cachedValue);
    }

    // If not cached, execute handler and cache the result
    return next.handle().pipe(
      tap(async (response) => {
        console.log('Caching response with key:', cacheKey);
        await this.cacheManager.set(cacheKey, response,5000);
      }),
    );
  }

  private generateCacheKey(pattern: any, data: any): string {
    const patternStr =
      typeof pattern === 'string' ? pattern : JSON.stringify(pattern);
    const dataStr = data ? JSON.stringify(data) : '';
    return `rpc:${patternStr}:${dataStr}`;
  }
}

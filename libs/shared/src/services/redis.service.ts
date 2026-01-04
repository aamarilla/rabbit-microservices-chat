import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async get(key: string) {
        console.log('Getting from Redis:', key);
        return await this.cache.get(key);
    }

    async set(key: string, value: any, ) {
        console.log('Setting in Redis:', key, value);
        await this.cache.set(key, value);
    }

    async del(key: string) {
        console.log('Deleting from Redis:', key);
        await this.cache.del(key);
    }
}
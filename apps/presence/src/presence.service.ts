import { Injectable } from '@nestjs/common';

import { RedisService } from '@app/shared';
import { ActiveUser } from './interface/ActiveUser.interface';

@Injectable()
export class PresenceService {
  constructor(private readonly cache: RedisService) {}

  getFoo() {
    console.log('NOT CACHED!');
    return {foo:'bar'}
  }

  async getActiveUser(id: number){
    const user = await this.cache.get(`user ${id}`);
    return user as ActiveUser | undefined;
  }
  getHello(): string {
    return 'Hello World!';
  }
}

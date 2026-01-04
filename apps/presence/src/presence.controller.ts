import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

import { MicroserviceCacheInterceptor, RedisService, SharedService } from '@app/shared';

import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly redisService: RedisService,
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  
  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(MicroserviceCacheInterceptor)
  async getFoo(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    const f = await this.presenceService.getFoo();
    this.redisService.set('foo', f);

    return f;
  }
}

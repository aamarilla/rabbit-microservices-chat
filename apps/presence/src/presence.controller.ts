import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

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

  @MessagePattern({ cmd: 'get-active-user' })
  async getActiveUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { id: number }
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.presenceService.getActiveUser(payload.id);
  }
}

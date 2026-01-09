import { FriendRequestEntity, PostgresDBModule, RedisModule, SharedModule, UserEntity } from "@app/shared";
import { ConversationEntity } from "@app/shared/entities/conversation.entity";
import { MessageEntity } from "@app/shared/entities/message.entity";
import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { ConversationsRepository } from "@app/shared/repositories/conversations.repository";
import { MessagesRepository } from "@app/shared/repositories/messages.repository";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports: [
        PostgresDBModule,
        RedisModule,
        TypeOrmModule.forFeature([
            UserEntity,
            FriendRequestEntity,
            ConversationEntity,
            MessageEntity
        ]),
        SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE!),
        SharedModule.registerRmq(
            'PRESENCE_SERVICE',
            process.env.RABBITMQ_PRESENCE_QUEUE!,
        ),
    ],
    controllers: [ChatController],
    providers: [
        ChatService,
        ChatGateway,
        {
            provide: 'ConversationsRepositoryInterface',
            useClass: ConversationsRepository
        },
        {
            provide: 'MessagesRepositoryInterface',
            useClass: MessagesRepository
        }
    ]
})
export class ChatModule {}
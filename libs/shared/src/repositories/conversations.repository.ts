import { find } from "rxjs"
import { ConversationEntity } from "../entities/conversation.entity"
import { Injectable } from "@nestjs/common"
import { BaseAbstractRepository } from "./base/base.abstract.repository";
import { ConversationsRepositoryInterface } from "../interfaces/conversations.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ConversationsRepository
    extends BaseAbstractRepository<ConversationEntity> 
    implements ConversationsRepositoryInterface
    {

    constructor(
        @InjectRepository(ConversationEntity)
        private readonly conversationEntity: 
        Repository<ConversationEntity>,
    ){
        super(conversationEntity);
    }

    public async findConversation(
        userId: number,
        friendId: number,
    ): Promise<ConversationEntity | undefined>{
        const result = await this.conversationEntity
            .createQueryBuilder('conversation')
            .leftJoin('conversation.users', 'user')
            .where('user.id = :userId', { userId })
            .orWhere('user.id = :friendId', {friendId})
            .groupBy('conversation.id')
            .having('COUNT(*)>1')
            .getOne();
        return result ?? undefined;
    }
}
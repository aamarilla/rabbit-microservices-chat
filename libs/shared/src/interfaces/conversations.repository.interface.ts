import { ConversationEntity } from "../entities/conversation.entity";
import { BaseInterfaceRepository } from "../repositories/base/base.interface.repository";

export interface ConversationsRepositoryInterface 
    extends BaseInterfaceRepository<ConversationEntity> {
        findConversation(
            userId: number,
            friendId: number,
        ): Promise<ConversationEntity | undefined>;
    }  
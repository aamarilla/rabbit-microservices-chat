import { MessageEntity } from "../entities/message.entity";
import { BaseInterfaceRepository } from "../repositories/base/base.interface.repository";

export interface MessagesRepositoryInterface
    extends BaseInterfaceRepository<MessageEntity> {

    }
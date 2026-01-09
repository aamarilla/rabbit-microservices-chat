import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "./base/base.abstract.repository";
import { MessageEntity } from "../entities/message.entity";
import { MessagesRepositoryInterface } from "../interfaces/messages.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class MessagesRepository
    extends BaseAbstractRepository<MessageEntity>
    implements MessagesRepositoryInterface
{
    constructor(
        @InjectRepository(MessageEntity)
        private readonly MessageEntity: Repository<MessageEntity>,
    ) {
        super(MessageEntity);
    }
}
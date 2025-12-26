import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "./base/base.abstract.repository";
import { FriendRequestEntity } from "../entities/friend-request.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequestsRepositoryInterface } from "../interfaces/friend-request.repository.interface";
import { Repository } from "typeorm";


@Injectable()
export class FriendRequestsRepository 
    extends BaseAbstractRepository<FriendRequestEntity> 
    implements FriendRequestsRepositoryInterface 
{
        constructor( 
            @InjectRepository(FriendRequestEntity)
            private readonly friendRequestEntity:
            Repository<FriendRequestEntity>,
        ){
            super(friendRequestEntity);
    }
}

        
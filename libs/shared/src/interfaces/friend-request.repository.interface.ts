import { FriendRequestEntity } from "../entities/friend-request.entity";
import { BaseAbstractRepository } from "../repositories/base/base.abstract.repository";

export interface FriendRequestsRepositoryInterface 
  extends BaseAbstractRepository<FriendRequestEntity> {

}
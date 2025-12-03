import { BaseInterfaceRepository } from "../repositories/base/base.interface.repository";
import { UserEntity } from "../entities/user.entity";


export interface UsersRepositoryInterface extends BaseInterfaceRepository<UserEntity> {
}
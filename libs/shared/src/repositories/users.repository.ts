import { Injectable } from "@nestjs/common";
import { BaseAbstractRepository } from "./base/base.abstract.repository";
import { UserEntity } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersRepositoryInterface } from "../interfaces/users.repository.interface";


@Injectable()
export class UsersRepository 
    extends BaseAbstractRepository<UserEntity> 
    implements UsersRepositoryInterface
{
    constructor(
        @InjectRepository(UserEntity)
        private readonly UserRepository: Repository<UserEntity>
    ) {
        super(UserRepository);
    }

}
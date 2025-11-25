import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)private readonly userRepository: Repository<UserEntity>)
  {}

  async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async postUser(): Promise<UserEntity> {
    const user = this.userRepository.create({lastName:'Barry'});
    return this.userRepository.save(user);
  }
}

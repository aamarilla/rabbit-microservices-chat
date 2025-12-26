import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '@app/shared';
import { NewUserDTO } from './dto/new-user.dto';
import { ExistingUserDTO } from './dto/existing-user.dto';
import { JwtService } from '@nestjs/jwt';
import type { FriendRequestEntity, UserJwt, UsersRepositoryInterface } from '@app/shared';
import { FriendRequestsRepository } from '@app/shared/repositories/friend-request.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject('FriendRequestsRepositoryInterface')
    private readonly friendRequestsRepository: FriendRequestsRepository,
    private readonly jwtService: JwtService
  )
  {}

  async getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }

  async findByEmail(email:string): Promise<UserEntity|null> {
    return this.usersRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDTO>): Promise<Omit<UserEntity, 'password'>> {
    const { firstName, lastName, email, password } = newUser;

    const hashedPassword = await this.hashPassword(password);

    try {
      const savedUser = await this.usersRepository.save({
        firstName, 
        lastName, 
        email, 
        password: hashedPassword
      });

      const { password: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      // Handle duplicate email constraint violation
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }

      throw error;
    }
  }

  async doesPasswordMatch(
    enteredPassword: string,
    storedHashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedHashedPassword);
  }

  async validateUser(
    enteredPassword: string,
    enteredEmail: string,
  ): Promise<UserEntity|null> {
    const user = await this.findByEmail(enteredEmail);

    const doesUserExist = !!user;

    if(!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      enteredPassword,
      user.password
    );

    if(!doesPasswordMatch) return null;

    return user
  }

  async login(existingUser: Readonly<ExistingUserDTO>)
  :Promise<{token: string, user: Omit<UserEntity, 'password'>}> {
    const { email, password } = existingUser;
    const user = await this.validateUser(password, email);

    if(!user) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync(
      {user}
    );

    return {
      token: jwt,
      user
    }
  }

  async verifyJwt(jwt: string): Promise<{exp: number}>{
    if(!jwt){
      throw new UnauthorizedException();
    }
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async findById(id: number): Promise<UserEntity|null> {
    return this.usersRepository.findOneById(id);
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if(!jwt){
      throw new UnauthorizedException();
    }

    try{
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (e){
      throw new BadRequestException();
    }
  }

  async addFriend(
    userId: number,
    friendId: number,
  ): Promise<FriendRequestEntity>{
    const creator = await this.findById(userId) as UserEntity;
    const receiver = await this.findById(friendId) as UserEntity;

    return await this.friendRequestsRepository.save({
      creator,
      receiver
    })
  }

  async getFriends(userId: number)
  :Promise<FriendRequestEntity[]>{
    const creator = await this.findById(userId) as UserEntity;

    return await this.friendRequestsRepository.findWithRelations
    ({
      where: [{creator},{receiver: creator}],
      relations: ['creator', 'receiver']
    })
  }

  
}
 
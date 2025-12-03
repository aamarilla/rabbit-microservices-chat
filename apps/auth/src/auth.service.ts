import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { NewUserDTO } from './dto/new-user.dto';
import { ExistingUserDTO } from './dto/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService)
  {}

  async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findByEmail(email:string): Promise<UserEntity|null> {
    return this.userRepository.findOne(
      {
        where: {email}, 
        select: ['id', 'firstName', 'lastName', 'email', 'password']
      });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDTO>): Promise<Omit<UserEntity, 'password'>> {
    const { firstName, lastName, email, password } = newUser;

    const hashedPassword = await this.hashPassword(password);

    try {
      const savedUser = await this.userRepository.save({
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
  :Promise<{token: string}> {
    const { email, password } = existingUser;
    const user = await this.validateUser(password, email);

    if(!user) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync(
      {user}
    );

    return {
      token: jwt
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

  
}
 
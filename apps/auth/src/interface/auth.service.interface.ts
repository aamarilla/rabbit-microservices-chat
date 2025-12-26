import { FriendRequestEntity, UserEntity } from "@app/shared";

import { NewUserDTO } from "../dto/new-user.dto";
import { ExistingUserDTO } from "../dto/existing-user.dto";

export interface AuthServiceInterface {
    getUsers(): Promise<UserEntity[]>;
    findByEmail(email:string): Promise<UserEntity|null>;
    hashPassword(password: string): Promise<string>;
    register(newUser: Readonly<NewUserDTO>): Promise<Omit<UserEntity, 'password'>>;
    doesPasswordMatch(enteredPassword: string,storedHashedPassword: string): Promise<boolean>
    validateUser(enteredPassword: string,enteredEmail: string): Promise<UserEntity|null>
    login(existingUser: Readonly<ExistingUserDTO>):Promise<{token: string}>;
    verifyJwt(jwt:string): Promise<{user: UserEntity; exp: number}>;
    getUserFromHeader(jwt:string): Promise<UserEntity|null>;
    addFriend(userId: number, friendId: number): Promise<FriendRequestEntity>;
    getFriends(userId: number): Promise<FriendRequestEntity[]>;
    
}
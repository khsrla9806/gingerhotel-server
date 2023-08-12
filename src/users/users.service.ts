/* eslint-disable */
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from "./dtos/create-account-dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async createAccount({ email, password, role } : CreateAccountInput) : Promise<{ok: boolean; error?: string}>
    {
        try {
            const exists = await this.userRepository.findOneBy({ email });
            if (exists) {
                return {ok: false, error: 'There is a user with that email already'};
            }
            await this.userRepository.save(this.userRepository.create({email, password, role}));
        } catch (error) {
            return {ok: false, error: "Couldn't create account"};
        }
    }
}
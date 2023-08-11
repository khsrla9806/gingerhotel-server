/* eslint-disable */
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from "./dtos/create-account-dto";

@Injectable()
export class usersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>
    ) {}

    async createAccount({ email, password, role } : CreateAccountInput) : Promise<{ok: boolean; error?: string}>
    {
        try {
            const exists = await this.users.findOneBy({ email });
            if (exists) {
                return {ok: false, error: 'There is a user with that email already'};
            }
            await this.users.save(this.users.create({email, password, role}));
        } catch (error) {
            return {ok: false, error: "Couldn't create account"};
        }
    }
}
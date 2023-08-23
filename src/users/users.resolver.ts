/* eslint-disable */
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account-dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";

@Resolver(of => User)
export class UserResolver {
    constructor(
      private readonly usersService: UserService
    ) {}

    }

    }

    }
}
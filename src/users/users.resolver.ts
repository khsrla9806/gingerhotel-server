/* eslint-disable */
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { usersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account-dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";

@Resolver(of => User)
export class UsersResolver {
    constructor(
      private readonly usersService: usersService
    ) {}

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput:CreateAccountInput): Promise<CreateAccountOutput> {
      try {
        
        const {ok , error} = await this.usersService.createAccount(createAccountInput);
        if (error) {
          return {
            ok,
            error,
          };
        }
        return {
          ok: true,
        }
      } catch (error) {
        return {
          ok: false,
          error
        };
      }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
      return;
    }
}
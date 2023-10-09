/* eslint-disable */
import { Resolver } from "@nestjs/graphql";
import { Letter } from "../entities/letter.entity";
import { LetterService } from "./letters.service";

@Resolver(of => Letter)
export class LetterResolver {
    constructor(private readonly letterService: LetterService) {}
    
}
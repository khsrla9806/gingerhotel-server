/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { Repository } from 'typeorm';
import { CreateLetterInput } from './dtos/create-letter.dto';

@Injectable()
export class LetterService {
    constructor(
        @InjectRepository(Letter)
        private readonly letters: Repository<Letter>
    ) {}
    async createLetter (createLetterInput:CreateLetterInput): Promise<Letter> {
        const newLetter = this.letters.create(createLetterInput);
        return this.letters.save(newLetter)
    }
} 
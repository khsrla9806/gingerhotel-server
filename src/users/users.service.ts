/* eslint-disable */
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { BadRequestException, Injectable } from '@nestjs/common';
import { Vendor } from "./entities/vendor.type";
import { Gender } from "./entities/gender.type";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    /**
     * 소셜 로그인 / 회원가입 로직을 처리하는 메서드
     * @param email : 소셜 로그인 사용자의 이메일 
     * @param socialId : 소셜 로그인 사용자의 식별값 (kakao, naver는 id, google, apple은 sub)
     * @param vendor : 소셜 로그인 제공 회사 정보 (kakao, naver, google, apple)
     */
    async loginSocial(email: string, socialId: string, vendor: Vendor) {
        
        try {
            const existingUser = await this.userRepository.findOneBy({ socialId });

            if (existingUser) {
                this.checkVendor(existingUser, vendor);

                return {
                    ok: true,
                    accessToken: "TODO: JWT 토큰 정보"
                };
            }

            const user = await this.userRepository.save(this.userRepository.create({ 
                email: email,
                socialId: socialId,
                vendor: vendor,
                age: 20, // TODO: 나이도 입력 받아서 넣어야 함
                gender: Gender.MAN // TODO: 성별도 입력 받아서 넣어야 함
            }));

            return {
                ok: true,
                accessToken: "TODO: JWT 토큰 정보"
            };

        } catch (error) {
            return {
                ok: false,
                error: error.message
            }
        }
    }

    checkVendor(user: User, vendor: Vendor): void {
        if (user.vendor != vendor) {
            throw new BadRequestException("해당 유저는 " + vendor + "의 사용자가 아닙니다."); 
        }
    }
}
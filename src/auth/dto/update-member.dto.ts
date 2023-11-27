import { LocalDate } from "@js-joda/core";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from "src/entities/domain/gender.type";
import { Member } from "src/entities/member.entity";

export class UpdateMemberRequest {
  @ApiPropertyOptional({ description: '사용자의 성별입니다. 남자는 MAN, 여자는 WOMAN', example: 'MAN' })
  private gender?: Gender;

  @ApiPropertyOptional({ description: '사용자의 생년월일입니다.', example: '1998-06-13' })
  private birthDate?: LocalDate;

  constructor(gender?: Gender, birthDate?: LocalDate) {
    this.gender = gender;
    this.birthDate = birthDate;
  }

  getGender(): Gender {
    return this.gender;
  }

  getBirthDate(): LocalDate {
    return this.birthDate;
  }

  getUpdatedMember(member: Member): Member {
    if (this.gender) {
      member.gender = this.gender;
    }
    if (this.birthDate) {
      member.birthDate = this.birthDate;
    }

    return member;
  }
}
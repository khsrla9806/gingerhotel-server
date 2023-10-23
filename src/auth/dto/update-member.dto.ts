import { LocalDate } from "@js-joda/core";
import { Gender } from "src/entities/domain/gender.type";
import { Member } from "src/entities/member.entity";

export class UpdateMemberRequest {
  private gender?: Gender;
  private birthDate?: LocalDate;

  constructor(gender?: Gender, birthDate?: LocalDate) {
    this.gender = gender;
    this.birthDate = birthDate;
  }

  getGener(): Gender {
    return this.gender;
  }

  getBirthDaate(): LocalDate {
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
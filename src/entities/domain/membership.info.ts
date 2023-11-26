import { BadRequestException } from "@nestjs/common";
import { MembershipType } from "./membership.type";
import { ErrorCode } from "src/common/filter/code/error-code.enum";

/*
  hasLetterLimite: 편지 제한
  isPossibleAttachImage: 이미지 첨부 가능 여부
  isPossibleReply: 답장 사용 가능 여부
  isPossiblePeek: 엿보기 사용 가능 여부
  isPossibleSearchExposure: 검색 노출 여부
*/
export type MembershipInfo = {
  hasLetterLimit: boolean;
  isPossibleAttachImage: boolean;
  isPossibleReply: boolean;
  isPossiblePeek: boolean;
  isPossibleSearchExposure: boolean;
}

export class Membership {
  public static readonly FREE: MembershipInfo = {
    hasLetterLimit: true,
    isPossibleAttachImage: false,
    isPossibleReply: false,
    isPossiblePeek: false,
    isPossibleSearchExposure: false
  }

  public static readonly STANDARD: MembershipInfo = {
    hasLetterLimit: false,
    isPossibleAttachImage: false,
    isPossibleReply: false,
    isPossiblePeek: true,
    isPossibleSearchExposure: false
  }

  public static readonly DELUXE: MembershipInfo = {
    hasLetterLimit: false,
    isPossibleAttachImage: true,
    isPossibleReply: true,
    isPossiblePeek: true,
    isPossibleSearchExposure: false
  }

  public static readonly SUITE: MembershipInfo = {
    hasLetterLimit: false,
    isPossibleAttachImage: true,
    isPossibleReply: true,
    isPossiblePeek: true,
    isPossibleSearchExposure: true
  }

  /**
   * 회원의 MembershipType 정보를 받아서 해당하는 MembershipInfo를 반환하는 method
   * @param membershipType: 회원의 MembershipType
   * @returns 입력받은 타입에 해당하는 멤버쉽 정보를 반환
   */
  public static getInfoByMembershipType(membershipType: MembershipType): MembershipInfo {

    if (membershipType === MembershipType.FREE) {
      return this.FREE;
    } else if (membershipType === MembershipType.STANDARD) {
      return this.STANDARD;
    } else if (membershipType === MembershipType.DELUXE) {
      return this.DELUXE;
    } else if (membershipType === MembershipType.SUITE) {
      return this.SUITE
    }

    throw new BadRequestException('잘못된 멤버쉽 정보입니다.', ErrorCode.NotFoundResource);
  }
}
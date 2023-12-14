import { LocalDate, LocalDateTime } from "@js-joda/core";
import { LocalDateTimeConverter } from "src/common/utils/local-date-time.converter";
import { LocalDateTimeUtils } from "src/common/utils/local-date-time.utils";
import { FeekStatus } from "src/entities/domain/feek-status.type";
import { Feek } from "src/entities/feek.entity";
import { Letter } from "src/entities/letter.entity";
import { Member } from "src/entities/member.entity";
import { Reply } from "src/entities/reply.entity";

export class GetRepliesResponse {
  private success: boolean;
  private letter: LetterDTO;
  private replies: ReplyDTO[];

  constructor(letter: Letter, feek: Feek, replies: Reply[], loginMember: Member) {
    this.success = true;
    this.letter = LetterDTO.from(letter, feek, loginMember);
    this.replies = replies.map((reply: Reply): ReplyDTO => ReplyDTO.from(reply, letter, loginMember));;
  }
}

export class LetterDTO {
  private constructor(
    private id: number,
    private senderNickname: string,
    private content: string,
    private date: LocalDate,
    private isOpen: boolean,
    private isBlocked: boolean,
    private isMe: boolean,
    private createdAt: LocalDateTime,
    private feekStatus: FeekStatus,
    private feekComment: string
  ) {}

  public static from(letter: Letter, feek: Feek, loginMember: Member): LetterDTO {
    let isMe: boolean = false;

    // 편지를 보낸 사람과 로그인한 사람이 같은 경우
    if (letter.sender.id === loginMember.id) {
      letter.hotelWindow.isOpen = true; // 내가 보낸 편지는 창문 개폐와 상관없음
      letter.isBlocked = false; // 내가 보낸 편지는 차단과 상관없음
      isMe = true;
    }

    return new LetterDTO(
      letter.id,
      letter.senderNickname,
      letter.content,
      letter.hotelWindow.date,
      LocalDateTimeUtils.isTargetDate() ? true : letter.hotelWindow.isOpen, // 크리스마스 이후면 무조건 true
      letter.isBlocked,
      isMe,
      LocalDateTimeConverter.convertDateToLocalDateTime(letter.createdAt),
      feek ? feek.feekStatus : null,
      feek ? feek.comment : null
    );
  }
}

export class ReplyDTO {
  constructor(
    private id: number,
    private senderNickname: string,
    private content: string,
    private date: LocalDate,
    private isOpen: boolean,
    private isBlocked: boolean,
    private isMe: boolean,
    private createdAt: LocalDateTime
  ) {}

  public static from(reply: Reply, letter: Letter, loginMember: Member): ReplyDTO {
    let isMe: boolean = false;
    let nickname: string = letter.hotelWindow.hotel.nickname;

    // 답장에는 닉네임이 따로 없어서 만약 편지 보낸 사람과 답장 보낸 사람이 같으면 닉네임은 편지를 보낸 사람의 익명 닉네임 사용
    if (letter.sender.id === reply.sender.id) {
      nickname = letter.senderNickname;
    }

    // 답장을 보낸 사람과 로그인한 사람이 같은 경우
    if (reply.sender.id === loginMember.id) {
      reply.hotelWindow.isOpen = true; // 내가 보낸 편지는 창문 개폐와 상관없음
      reply.isBlocked = false; // 내가 보낸 편지는 차단과 상관없음
      isMe = true;
    }

    return new ReplyDTO(
      reply.id,
      nickname,
      reply.content,
      reply.hotelWindow.date,
      LocalDateTimeUtils.isTargetDate() ? true : reply.hotelWindow.isOpen, // 크리스마스 이후면 무조건 true
      reply.isBlocked,
      isMe,
      LocalDateTimeConverter.convertDateToLocalDateTime(reply.createdAt)
    );
  }
}

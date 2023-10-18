import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeekStatus } from 'src/entities/domain/feek-status.type';
import { Feek } from 'src/entities/feek.entity';
import { Letter } from 'src/entities/letter.entity';
import { Member } from 'src/entities/member.entity';
import { DataSource, Repository } from 'typeorm';
import { AcceptFeekRequest } from './dto/accept-feek.dto';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';

@Injectable()
export class FeekService {
  constructor(
    @InjectRepository(Feek)
    private readonly feekRepository: Repository<Feek>,
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    @InjectRepository(MemberBlockHistory)
    private readonly memberBlockHistoryRepository: Repository<MemberBlockHistory>,
    private readonly dataSource: DataSource
  ) {}

  /**
   * 엿보기 요청
   */
  async requestFeek(letterId: number, loginMember: Member) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!loginMember.getMembershipInfo().isPossiblePeek) {
        throw new BadRequestException(`엿보기를 사용할 수 없는 멤버쉽 사용자입니다. : ${loginMember.membership}`);
      }

      if (loginMember.feekCount <= 0) {
        throw new BadRequestException(`사용할 수 있는 엿보기 개수가 없습니다. : ${loginMember.feekCount}개`)
      }

      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .innerJoinAndSelect('letter.hotelWindow', 'hotelWindow')
        .innerJoinAndSelect('hotelWindow.hotel', 'hotel')
        .innerJoinAndSelect('hotel.member', 'member')
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.');
      }

      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('자신이 받은 편지만 엿보기 요청이 가능합니다.')
      }

      // 엿보기 요청을 보내려는 사용자가 나를 차단한 경우
      const memberBlock = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: letter.sender.id, toMemberId: loginMember.id }
        )
        .getOne();
      
      if (memberBlock) {
        throw new BadRequestException('호텔 주인에 의해 차단된 사용자입니다.');
      }

      await queryRunner.manager.save(this.feekRepository.create({
        requestor: loginMember,
        letter: letter,
        requestorName: letter.hotelWindow.hotel.nickname,
        feekStatus: FeekStatus.REQUEST,
        comment: null
      }));

      loginMember.feekCount--;
      await queryRunner.manager.save(loginMember);

      await queryRunner.commitTransaction();

      return {
        success: true
      }

    } catch (e) {
      await queryRunner.rollbackTransaction();

      return {
        success: false,
        error: e.message
      }
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 엿보기 요청 상세 조회
   */
  async getFeekDetail(feekId: number, loginMember: Member) {
    try {
      const feek = await this.feekRepository
        .createQueryBuilder('feek')
        .innerJoinAndSelect('feek.requestor', 'requestor')
        .innerJoinAndSelect('feek.letter', 'letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .where('feek.id = :feekId', { feekId: feekId })
        .getOne();
        
      if (!feek) {
        throw new BadRequestException('존재하지 않는 엿보기 요청 정보입니다.');
      }

      if (feek.feekStatus !== FeekStatus.REQUEST) {
        throw new BadRequestException('이미 수락/거절이 끝난 엿보기 요청 정보입니다.')
      }
      
      if (feek.letter.sender.id !== loginMember.id) {
        throw new BadRequestException('내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.');
      }
      

      return {
        success: true,
        feekId: feek.id,
        requestorName: feek.requestorName,
        letterSenderNickname: feek.letter.senderNickname,
        letterContent: feek.letter.content
      }

    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }

  /**
   * 엿보기 응답 (수락)
   */
  async acceptFeek(feekId: number, loginMember: Member, dto: AcceptFeekRequest) {
    try {
      const feek = await this.feekRepository
        .createQueryBuilder('feek')
        .innerJoinAndSelect('feek.requestor', 'requestor')
        .innerJoinAndSelect('feek.letter', 'letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .where('feek.id = :feekId', { feekId: feekId })
        .getOne();

      if (!feek) {
        throw new BadRequestException('존재하지 않는 엿보기 요청 정보입니다.');
      }

      if (feek.feekStatus !== FeekStatus.REQUEST) {
        throw new BadRequestException('이미 수락/거절이 끝난 엿보기 요청 정보입니다.')
      }
      
      if (feek.letter.sender.id !== loginMember.id) {
        throw new BadRequestException('내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.');
      }

      if (!dto.comment) {
        throw new BadRequestException('엿보기 답장내용이 존재하지 않습니다.');
      }

      feek.comment = dto.comment;
      feek.feekStatus = FeekStatus.ACCEPT;
      const updatedFeek = await this.feekRepository.save(feek);

      return {
        success: true,
        requestorName: updatedFeek.requestorName,
        comment: updatedFeek.comment
      }

    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }

  /**
   * 엿보기 응답 (거절)
   */
  async rejectFeek(feekId: number, loginMember: Member) {
    try {
      const feek = await this.feekRepository
        .createQueryBuilder('feek')
        .innerJoinAndSelect('feek.requestor', 'requestor')
        .innerJoinAndSelect('feek.letter', 'letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .where('feek.id = :feekId', { feekId: feekId })
        .getOne();

      if (!feek) {
        throw new BadRequestException('존재하지 않는 엿보기 요청 정보입니다.');
      }

      if (feek.feekStatus !== FeekStatus.REQUEST) {
        throw new BadRequestException('이미 수락/거절이 끝난 엿보기 요청 정보입니다.')
      }
      
      if (feek.letter.sender.id !== loginMember.id) {
        throw new BadRequestException('내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.');
      }

      feek.feekStatus = FeekStatus.REJECT;
      await this.feekRepository.save(feek);

      return {
        success: true,
        requestorName: feek.requestorName
      }

    } catch (e) {
      return {
        success: false,
        error: e.message
      }
    }
  }
}

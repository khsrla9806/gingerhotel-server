import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeekStatus } from 'src/entities/domain/feek-status.type';
import { Feek } from 'src/entities/feek.entity';
import { Letter } from 'src/entities/letter.entity';
import { Member } from 'src/entities/member.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AcceptFeekRequest } from '../dto/accept-feek.dto';
import { MemberBlockHistory } from 'src/entities/member-block-history.entity';
import { NotificationHistory } from 'src/entities/notification-history.entity';
import { NotificationType } from 'src/entities/domain/notification.type';
import { Device } from 'src/entities/device.entity';
import { DeviceStatus } from 'src/entities/domain/device-status.type';
import fetch from 'node-fetch';
import { ErrorCode } from 'src/common/filter/code/error-code.enum';

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
      if (loginMember.feekCount <= 0) {
        throw new BadRequestException(`사용할 수 있는 엿보기 개수가 없습니다. : ${loginMember.feekCount}개`, ErrorCode.InsufficientFeekCount)
      }

      const letter: Letter = await this.letterRepository
        .createQueryBuilder('letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .innerJoin('hotel.member', 'member')
        .select([
          'letter', 'sender.id', 'hotelWindow.id', 'hotel.id', 'hotel.nickname', 'member.id'
        ])
        .where('letter.id = :letterId and letter.isDeleted = false', { letterId: letterId })
        .getOne();

      if (!letter) {
        throw new BadRequestException('존재하지 않는 편지 정보입니다.', ErrorCode.NotFoundResource);
      }

      if (letter.hotelWindow.hotel.member.id !== loginMember.id) {
        throw new BadRequestException('자신이 받은 편지만 엿보기 요청이 가능합니다.', ErrorCode.AccessDenied);
      }

      // 엿보기를 이미 사용한 편지인지 확인
      const feekCount: number = await this.feekRepository
        .createQueryBuilder('feek')
        .where('feek.letter.id = :letterId', { letterId: letter.id })
        .getCount();
      
      if (feekCount > 0) {
        throw new BadRequestException('이미 엿보기 요청을 한 편지입니다. 엿보기는 하나의 편지에 한번만 가능합니다.', ErrorCode.AlreadyRequestFeek);
      }

      // 엿보기 요청을 보내려는 사용자가 나를 차단한 경우
      const memberBlock: MemberBlockHistory = await this.memberBlockHistoryRepository
        .createQueryBuilder('memberBlock')
        .where(
          'memberBlock.fromMember.id = :fromMemberId and memberBlock.toMember.id = :toMemberId',
          { fromMemberId: letter.sender.id, toMemberId: loginMember.id }
        )
        .getOne();
      
      if (memberBlock) {
        throw new BadRequestException('호텔 주인에 의해 차단된 사용자입니다.', ErrorCode.BlockedMemberFromHotelOwner);
      }

      const feek: Feek = await queryRunner.manager.save(this.feekRepository.create({
        requestor: loginMember,
        letter: letter,
        requestorName: letter.hotelWindow.hotel.nickname,
        feekStatus: FeekStatus.REQUEST,
        comment: null
      }));

      loginMember.feekCount--;
      await queryRunner.manager.save(loginMember);

      // 엿보기 수신자의 알림을 추가
      const feekTypeDataObject = {
        feekId: feek.id
      };
      let notificationMessage: string = `${letter.hotelWindow.hotel.nickname}님께서 엿보기를 요청했어요!`;
      const notification: NotificationHistory = queryRunner.manager
        .getRepository(NotificationHistory)
        .create({
          member: letter.sender,
          type: NotificationType.FEEK_REQUEST,
          typeData: JSON.stringify(feekTypeDataObject),
          message: notificationMessage,
          isChecked: false
        });
      await queryRunner.manager.save(notification);

      await this.pushNotification(queryRunner, letter.sender.id, notificationMessage, feekTypeDataObject);

      await queryRunner.commitTransaction();

      return {
        success: true
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 엿보기 요청 상세 조회
   */
  async getFeekDetail(feekId: number, loginMember: Member) {
    try {
      const feek: Feek = await this.feekRepository
        .createQueryBuilder('feek')
        .innerJoinAndSelect('feek.requestor', 'requestor')
        .innerJoinAndSelect('feek.letter', 'letter')
        .innerJoinAndSelect('letter.sender', 'sender')
        .where('feek.id = :feekId', { feekId: feekId })
        .getOne();
        
      if (!feek) {
        throw new BadRequestException('존재하지 않는 엿보기 요청 정보입니다.', ErrorCode.NotFoundResource);
      }

      if (feek.feekStatus !== FeekStatus.REQUEST) {
        throw new BadRequestException('이미 수락/거절이 끝난 엿보기 요청 정보입니다.', ErrorCode.NotFoundResource)
      }
      
      if (feek.letter.sender.id !== loginMember.id) {
        throw new BadRequestException('내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.', ErrorCode.AccessDenied);
      }
      

      return {
        success: true,
        feekId: feek.id,
        requestorName: feek.requestorName,
        letterSenderNickname: feek.letter.senderNickname,
        letterContent: feek.letter.content
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * 엿보기 응답 (수락)
   */
  async acceptFeek(feekId: number, loginMember: Member, dto: AcceptFeekRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const feek: Feek = await this.feekRepository
        .createQueryBuilder('feek')
        .innerJoin('feek.requestor', 'requestor')
        .innerJoin('feek.letter', 'letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .select([
          'feek', 'requestor.id', 'letter.id', 'letter.isDeleted', 'letter.senderNickname', 'sender.id', 
          'hotelWindow.id', 'hotelWindow.date', 'hotel.id'
        ])
        .where('feek.id = :feekId', { feekId: feekId })
        .getOne();

      if (!feek) {
        throw new BadRequestException('존재하지 않는 엿보기 요청 정보입니다.', ErrorCode.NotFoundResource);
      }

      if (feek.feekStatus !== FeekStatus.REQUEST) {
        throw new BadRequestException('이미 수락/거절이 끝난 엿보기 요청 정보입니다.', ErrorCode.AlreadyRequestFeek)
      }
      
      if (feek.letter.sender.id !== loginMember.id) {
        throw new BadRequestException('내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.', ErrorCode.AccessDenied);
      }

      feek.comment = dto.comment;
      feek.feekStatus = FeekStatus.ACCEPT;
      const updatedFeek: Feek = await this.feekRepository.save(feek);

      // 해당 편지가 삭제되지 않았다면, 엿보기를 요청했던 사람에게 수락한 알림을 추가
      if (!feek.letter.isDeleted) {
        const feekAcceptTypeDataObject = {
          hotelId: feek.letter.hotelWindow.hotel.id,
          date: feek.letter.hotelWindow.date.toString()
        };
        let notificationMessage: string = `${feek.letter.senderNickname}님께서 엿보기를 수락했어요!`;

        const notification: NotificationHistory = queryRunner.manager
          .getRepository(NotificationHistory)
          .create({
            member: feek.requestor,
            type: NotificationType.FEEK_ACCEPT,
            typeData: JSON.stringify(feekAcceptTypeDataObject),
            message: notificationMessage,
            isChecked: false
          });
        await queryRunner.manager.save(notification);

        await this.pushNotification(queryRunner, feek.requestor.id, notificationMessage, feekAcceptTypeDataObject);
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        requestorName: updatedFeek.requestorName,
        comment: updatedFeek.comment
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 엿보기 응답 (거절)
   */
  async rejectFeek(feekId: number, loginMember: Member) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const feek: Feek = await this.feekRepository
        .createQueryBuilder('feek')
        .innerJoin('feek.requestor', 'requestor')
        .innerJoin('feek.letter', 'letter')
        .innerJoin('letter.sender', 'sender')
        .innerJoin('letter.hotelWindow', 'hotelWindow')
        .innerJoin('hotelWindow.hotel', 'hotel')
        .select([
          'feek', 'requestor.id', 'letter.id', 'letter.isDeleted', 'letter.senderNickname', 'sender.id', 
          'hotelWindow.id', 'hotelWindow.date', 'hotel.id'
        ])
        .where('feek.id = :feekId', { feekId: feekId })
        .getOne();

      if (!feek) {
        throw new BadRequestException('존재하지 않는 엿보기 요청 정보입니다.', ErrorCode.NotFoundResource);
      }

      if (feek.feekStatus !== FeekStatus.REQUEST) {
        throw new BadRequestException('이미 수락/거절이 끝난 엿보기 요청 정보입니다.', ErrorCode.NotFoundResource)
      }
      
      if (feek.letter.sender.id !== loginMember.id) {
        throw new BadRequestException('내가 보냈던 편지에 대한 엿보기만 조회가 가능합니다.', ErrorCode.AccessDenied);
      }

      feek.feekStatus = FeekStatus.REJECT;
      await this.feekRepository.save(feek);

      // 해당 편지가 삭제되지 않았다면, 엿보기를 요청했던 사람에게 거절한 알림을 추가
      if (!feek.letter.isDeleted) {
        const feekRejectTypeDataObject = {
          hotelId: feek.letter.hotelWindow.hotel.id,
          date: feek.letter.hotelWindow.date.toString()
        };

        let notificationMessage: string = `${feek.letter.senderNickname}님께서 엿보기를 거절했어요 :(`;
        const notification: NotificationHistory = queryRunner.manager
          .getRepository(NotificationHistory)
          .create({
            member: feek.requestor,
            type: NotificationType.FEEK_REJECT,
            typeData: JSON.stringify(feekRejectTypeDataObject),
            message: notificationMessage,
            isChecked: false
          });
        await queryRunner.manager.save(notification);

        await this.pushNotification(queryRunner, feek.requestor.id, notificationMessage, feekRejectTypeDataObject);
      }
      await queryRunner.commitTransaction();

      return {
        success: true,
        requestorName: feek.requestorName
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async pushNotification(
    queryRunner: QueryRunner, 
    memberId: number, 
    notificationMessage: string, 
    typeDataObject: any
  ) {
    // 디바이스가 존재한다면 푸시 알림을 보냄
    const devices: Device[] = await queryRunner.manager.getRepository(Device)
    .createQueryBuilder('device')
    .where('device.member.id = :memberId', { memberId: memberId })
    .getMany();

    // 푸시 알림을 못 보내면 그만이기 때문에 try-catch로 잡아서 예외를 그냥 버림 (푸시 알림 때문에 편지가 안 보내지면 안 되기 때문에)
    try {
      if (devices && devices.length > 0) {
        // device를 순회하면서 push 알림을 보냄
        for (let i = 0; i < devices.length; i++) {
          const device: Device = devices[i];
          if (device.status === DeviceStatus.granted) {
            const message = {
              to: device.token,
              sound: 'default',
              title: notificationMessage,
              body: '',
              data: typeDataObject
            }
            await fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(message),
            });
          }
        }
      }
    } catch (error) {}
  }
}

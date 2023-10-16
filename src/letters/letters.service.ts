import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateLetterRequest } from './dto/create-letter.dto';
import { DataSource, Repository } from 'typeorm';
import { CommonResponse } from 'src/common/dto/output.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { LocalDate } from '@js-joda/core';
import { HotelWindow } from 'src/entities/hotel-window.entity';
import { Letter } from 'src/entities/letter.entity';

@Injectable()
export class LettersService {

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(HotelWindow)
    private readonly hotelWindowRepository: Repository<HotelWindow>,
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    private readonly dataSource: DataSource
  ) {}

  async createLetter(
    hotelId: number, loginUser: User, image: Express.Multer.File, dto: CreateLetterRequest): Promise<CommonResponse> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 존재하는 호텔인지 확인
      const hotel: Hotel = await this.hotelRepository.findOne({
        where: {
          id: hotelId
        },
        relations: {
          user: true
        }
      });

      // 2. 자신의 호텔인지 확인 (자기 호텔에는 편지를 쓰지 못함)
      if (hotel.user.id === loginUser.id) {
        throw new BadRequestException("자신의 호텔에는 편지를 쓸 수 없습니다.");
      }

      // 3. 이미지 파일 존재 여부 확인 (user의 멤버쉽 체크)
      if (image && !loginUser.getMembershipInfo().isPossibleAttachImage) {
        throw new BadRequestException("이미지 첨부를 할 수 없는 멤버쉽 정보입니다.");
      }

      // 4. 오늘 날짜 확인 (yyyy-MM-dd) 후 오늘 날짜에 해당하는 호텔 창문이 존재하는지 쿼리
      const today: LocalDate = LocalDate.now();
      let hotelWindow: HotelWindow = await this.hotelWindowRepository
        .createQueryBuilder('hotelWindow')
        .where('hotelWindow.date = :today and hotelWindow.hotel.id = :hotelId', { today: today, hotelId: hotel.id })
        .getOne();

      // 5. 창문이 존재하지 않는다면 창문을 생성
      if (!hotelWindow) {
        hotelWindow = await queryRunner.manager.save(this.hotelWindowRepository.create({
          hotel: hotel,
          date: today,
          isOpen: false,
          hasCookie: false
        }));
      }

      // 6. 받는 사람이 수신 편지 개수 제한이 있는지 확인
      const recievedLetterCount = await this.letterRepository
          .createQueryBuilder('letter')
          .where('letter.hotelWindow.id = :hotelWindowId', { hotelWindowId: hotelWindow.id })
          .getCount();

      if (hotel.user.getMembershipInfo().hasLetterLimit) {
        this.checkMaximumReceivedLetterCount(recievedLetterCount);
      }

      // 7. 이미지와 편지 저장
      const imageURL: string = await this.saveImage(image);

      await queryRunner.manager.save(this.letterRepository.create({
        hotelWindow: hotelWindow,
        sender: loginUser,
        senderNickname: dto.senderNickname,
        content: dto.content,
        imageUrl: imageURL,
        isDeleted: false
      }));

      // 8. 편지를 받는 사람이 받아야 하는 편지수를 채운 경우 창문 OPEN
      if (this.checkHotelWindowOpenCondition(recievedLetterCount + 1, hotelWindow)) {
        await queryRunner.manager.save(hotelWindow); // Update 반영
      }
      
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
   * FREE 멤버쉽의 사용자의 경우 최대 수신 가능한 편지수를 넘은 경우를 확인하는 메서드
   * @param recievedLetterCount: 현재까지 받은 편지수
   */
  checkMaximumReceivedLetterCount(recievedLetterCount: number) {
    const maximumReceivedLetterCount = 20; // 편지 수신 제한 개수 20개로 고정

    if (recievedLetterCount >= maximumReceivedLetterCount) {
      throw new BadRequestException(`수신자가 하루에 받을 수 있는 개수를 넘어섰습니다. : ${recievedLetterCount}`);
    }
  }

  /**
   * 편지 수신자의 창문의 개폐 여부를 판단하는 메서드
   * @param recievedLetterCount: 받은 편지수
   * @param hotelWindow: 호텔 창문 객체
   * @returns: 창문이 열리는 조건에 만족한 경우 true / 아닌 경우 false 반환
   */
  checkHotelWindowOpenCondition(recievedLetterCount: number, hotelWindow: HotelWindow): boolean {
    const hotelWindowOpenConditionCount = 5; // 창문이 열리는 COUNT 5로 고정

    if (!hotelWindow.isOpen && recievedLetterCount >= hotelWindowOpenConditionCount) {
      hotelWindow.isOpen = true;
      hotelWindow.hasCookie = true;

      return true;
    }

    return false;
  }

  // TODO: 이미지 저장 메서드 (Storage 연결되면 이 부분에 이미지를 저장하는 로직 추가)
  async saveImage(image: Express.Multer.File): Promise<string> {

    return '저장된 image URL';
  }
}

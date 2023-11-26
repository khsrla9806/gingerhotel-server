import { CommonResponse } from "src/common/dto/output.dto";
import { Background, BuildingDecorator, GardenDecorator, WindowDecorator } from "src/entities/domain/hotel-decorator.type";

export class HotelDetailResponse extends CommonResponse {
  canReceiveLetterToday?: boolean;
  todayReceivedLetterCount?: number;
  feekCount?: number;
  keyCount?: number;
  hotel?: HotelInfo;
  hotelWindows?: object;
  isLoginMember?: boolean;
  isOwner?: boolean;
  isFriend?: boolean;
  isBlocked?: boolean;
}

export type HotelInfo = {
  nickname: string;
  description: string;
  structColor: string;
  bodyColor: string;
  buildingDecorator: BuildingDecorator;
  gardenDecorator: GardenDecorator;
  windowDecorator: WindowDecorator;
  background: Background;
}

export type HotelWindowInfo = {
  id: number;
  isOpen: boolean;
  hasCookie: boolean;
}
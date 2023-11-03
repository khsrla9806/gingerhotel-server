import { CommonResponse } from "src/common/dto/output.dto";

export class HotelDetailResponse extends CommonResponse {
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
  headColor: string;
  bodyColor: string;
}

export type HotelWindowInfo = {
  id: number;
  isOpen: boolean;
  hasCookie: boolean;
}
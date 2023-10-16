import { CommonResponse } from "src/common/dto/output.dto";

export class HotelDetailResponse extends CommonResponse {
  todayReceivedLetterCount?: number;
  hotel?: HotelInfo;
  isLoginUser?: boolean;
  isOwner?: boolean;
  isFriend?: boolean;
}

export type HotelInfo = {
  headColor: string;
  bodyColor: string;
}
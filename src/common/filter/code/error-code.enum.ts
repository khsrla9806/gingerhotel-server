export enum ErrorCode {
    // Common Error(1XXX)
    AccessDenied = '1001', // 요청하신 정보에 접근 권한이 없습니다.
    NotAuthenticated = '1002', // 인증되지 않은 사용자입니다.
    NotFoundResource = '1003', // 요청하신 정보를 찾을 수 없습니다.
    AlreadyRegisterDevice = '1004', // 이미 등록된 디바이스 정보입니다.
    InternalServerError = '1005', // 서버 에러가 발생했습니다.
    NotRequestOnesOwnSelf = '1006', // 자기자신에게는 요청을 할 수 없습니다.
    ValidationFailed = '1007', // 유효성 검사에 실패했습니다.
    
    // Hotel Error (2XXX)
    WindowClosed = '2001', // 해당 날짜의 창문이 닫혀있습니다.
    AlreadyWindowOpened = '2002', // 이미 해당 날짜의 창문이 열려있습니다.
    EmptyWindow = "2003", // 해당 날짜에 받은 편지가 존재하지 않습니다.
    IsNotMyWindow = '2004', // 자기자신의 창문만 열 수 있습니다.
    InsufficientKeyCount = '2005', // 창문을 열 수 있는 열쇠가 부족합니다.
    AlreadyUnlimitLetterCount = '2006', // 이미 오늘의 편지 제한을 해제했습니다.
    GenderChangedOnce = '2007', // 성별 정보는 단 한번만 설정이 가능합니다.
    BirthDateChangedOnce = '2008', // 생년월일 정보는 단 한번만 설정이 가능합니다.
    AlreadyHasHotel = '2009', // 이미 호텔을 가지고 있는 사용자입니다.
    InvalidFriendCode = '2010', // 잘못된 친구 코드입니다.
    BlockedMemberFromHotelOwner = '2011', // 호텔 주인에게 차단당한 사용자입니다.

    // Letter Error (3XXX)
    LetterReceivedLimitExceed = '3001', // 수신자가 오늘받을 수 있는 편지 한도를 넘어섰습니다.
    NoBlockedLetter = '3002', // 차단되어 있지 않은 편지입니다. 차단을 해제할 수 없습니다.
    AlreadyBlockedLetter = '3003', // 이미 차단된 편지입니다.
    InvalidImageExtension = '3004', // 잘못된 이미지 확장자입니다. 이미지는 jpg, jpeg, png만 올릴 수 있습니다.
    ImageSizeLimitExceed = '3005', // 이미지는 최대 3MB까지만 업로드가 가능합니다.
    NotUseUploadImage = '3006', // 이미지 업로드 기능을 사용할 수 없습니다.
    NotUseReply = '3007', // 답장 기능을 사용할 수 없습니다.

    // Village Error (4XXX)
    IsNotMyFriend = '4001', // 내 빌리지에 존재하지 않는 사용자입니다. 빌리지에서 해제할 수 없습니다.
    AlreadyMyFriend = '4002', // 이미 내 빌리지에 추가된 사용자입니다. 빌리지에 등록할 수 없습니다.
    VillageLimitExceed = '4003', // 빌리지는 10명까지 등록이 가능합니다.

    // Feek Error (5XXX)
    InsufficientFeekCount = '5001', // 엿보기 개수가 부족합니다.
    AlreadyRequestFeek = '5002', // 이미 엿보기를 신청한 편지입니다. 편지 하나 당 한번의 엿보기만 신청이 가능합니다.
}
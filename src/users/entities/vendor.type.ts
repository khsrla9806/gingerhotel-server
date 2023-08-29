import { registerEnumType } from "@nestjs/graphql";

export enum Vendor {
    KAKAO = "kakao",
    NAVER = "naver",
    GOOGLE = "google",
    APPLE = "apple"
}

registerEnumType(Vendor, {
    name: "Vendor"
});
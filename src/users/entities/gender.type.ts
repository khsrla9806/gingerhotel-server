import { registerEnumType } from "@nestjs/graphql";

export enum Gender {
    MAN = "남자",
    WOMAN = "여자"
}

registerEnumType(Gender, {
    name: "Gender"
});
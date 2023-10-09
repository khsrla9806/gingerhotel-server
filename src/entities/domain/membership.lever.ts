import { registerEnumType } from "@nestjs/graphql";

export enum MembershipLever {
  FREE,
  STANDARD,
  DELUXE,
  SUITE
}

registerEnumType(MembershipLever, {
    name: "MembershipLevel"
});
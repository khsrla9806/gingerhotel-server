
export class CreateLetterRequest {
  senderNickname: string;
  content: string;
  image: Express.Multer.File;
}
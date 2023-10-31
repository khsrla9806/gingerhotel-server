import { BadRequestException, Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { PromiseResult } from 'aws-sdk/lib/request';
import * as path from "path";

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly MAXIMUM_IMAGE_SIZE: number;
  private readonly ACCEPTABLE_MIME_TYPES: string[];
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION
    })
    this.MAXIMUM_IMAGE_SIZE = 3000000; // 3MB
    this.ACCEPTABLE_MIME_TYPES = ['image/jpg', 'image/png', 'image/jpeg'];
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME
  }

  async uploadToS3(file: Express.Multer.File): Promise<S3UploadResponse> {
    try {
      if (!this.ACCEPTABLE_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException('이미지 파일 확장자는 jpg, png, jpeg만 가능합니다.');
      }
      if (file.size > this.MAXIMUM_IMAGE_SIZE) {
        throw new BadRequestException('업로드 가능한 이미지 최대 용량은 3MB입니다.');
      }

      const key = `images/${Date.now()}_${path.basename(file.originalname,)}`.replace(/ /g, '');

      const s3Object = await this.s3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        })
        .promise();

      const imgUrl = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

      return {
        key: key,
        s3Object: s3Object,
        contentType: file.mimetype,
        url: imgUrl
      }
      
    } catch (error) {
      throw error;
    }
  }
}

export type S3UploadResponse = {
  key: string;
  s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
  contentType: string;
  url: string;
}
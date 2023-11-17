import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class MemberCodeValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            if (!value) {
                throw new BadRequestException('코드는 필수 값입니다.');
            }

            const pattern = /^[0-9a-zA-Z]{7}$/;
            
            if (!pattern.test(value)) {
                throw new BadRequestException('잘못된 코드 형식입니다. (7자리 영문 또는 숫자 형태)');
            }

            return value;
        } catch (error) {
            throw error;
        }
    }
}
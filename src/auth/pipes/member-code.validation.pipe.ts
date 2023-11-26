import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ErrorCode } from "src/common/filter/code/error-code.enum";

export class MemberCodeValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            if (!value) {
                throw new Error('코드는 필수 값입니다.');
            }

            const pattern = /^[0-9a-zA-Z]{7}$/;
            
            if (!pattern.test(value)) {
                throw new Error('잘못된 코드 형식입니다. (7자리 영문 또는 숫자 형태)');
            }

            return value;
        } catch (error) {
            throw new BadRequestException(error.message, ErrorCode.ValidationFailed);
        }
    }
}
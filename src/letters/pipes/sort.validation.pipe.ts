import { ArgumentMetadata, BadRequestException, InternalServerErrorException, PipeTransform } from "@nestjs/common";
import { ErrorCode } from "src/common/filter/code/error-code.enum";

const sortTypes: string[] = ['ASC', 'DESC'];
export const defaultSortType: string = 'DESC';

export class SortValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
      try {
        if (value) {
          value = value.toUpperCase();
          if (!sortTypes.includes(value)) {
            throw new Error('정렬 조건은 ASC와 DESC 중에서만 선택이 가능합니다.');
          }
          return value;
        }

        return defaultSortType; // 정렬 조건 미선택 시 (default 값으로 설정)
      } catch (error) {
        throw new BadRequestException(error.message, ErrorCode.ValidationFailed);
      }
  }
}
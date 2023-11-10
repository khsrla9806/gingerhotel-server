
export class CursorPageMetaDTO {
    readonly total: number;
    readonly size: number;
    readonly hasNextData: boolean;
    readonly cursor: number;

    constructor(
        total: number,
        size: number,
        hasNextData: boolean,
        cursor: number
    ) {
        this.total = total;
        this.size = size;
        this.hasNextData = hasNextData;
        this.cursor = cursor;
    }
}
import { CursorPageMetaDTO } from "./cursor-page-meta.dto";

export class CursorPageDTO<T> {
    readonly data: T[];
    readonly meta: CursorPageMetaDTO;

    constructor(data: T[], meta: CursorPageMetaDTO) {
        this.data = data;
        this.meta = meta;
    }
}
/**
 * @module RSBlock
 * @author nuintun
 * @author Kazuhiko Arase
 */
import { ErrorCorrectionLevel } from '../../qrcode/common/ErrorCorrectionLevel';
export declare class RSBlock {
    private static RS_BLOCK_TABLE;
    private dataCount;
    private totalCount;
    constructor(totalCount: number, dataCount: number);
    getDataCount(): number;
    getTotalCount(): number;
    static getRSBlocks(version: number, errorCorrectionLevel: ErrorCorrectionLevel): RSBlock[];
    private static getRSBlockTable;
}

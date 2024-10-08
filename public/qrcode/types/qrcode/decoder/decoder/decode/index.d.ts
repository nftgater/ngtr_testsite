/**
 * @module index
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { Mode } from '../../../../qrcode/common/Mode';
import { ErrorCorrectionLevel } from '../../../../qrcode/common/ErrorCorrectionLevel';
interface ByteChunk {
    mode: Mode.Numeric | Mode.Alphanumeric | Mode.Byte | Mode.Kanji;
    data: string;
    bytes: number[];
    encoding?: number;
}
interface StructuredAppend {
    symbols: number[];
    parity: number;
}
interface StructuredAppendChunk extends StructuredAppend {
    mode: Mode.StructuredAppend;
}
interface DecodeData {
    data: string;
    bytes: number[];
}
type Chunks = Array<ByteChunk | StructuredAppendChunk>;
export interface DecodeResult extends DecodeData {
    chunks: Chunks;
    version: number;
    errorCorrectionLevel: ErrorCorrectionLevel;
}
export declare function bytesDecode(data: Uint8ClampedArray, version: number, errorCorrectionLevel: ErrorCorrectionLevel): DecodeResult | null;
export {};

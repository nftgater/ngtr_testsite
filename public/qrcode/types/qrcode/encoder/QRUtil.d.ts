/**
 * @module QRUtil
 * @author nuintun
 * @author Kazuhiko Arase
 */
import { Encoder } from './Writer';
import { Polynomial } from './Polynomial';
export declare function getAlignmentPattern(version: number): number[];
export declare function getErrorCorrectionPolynomial(errorCorrectionLength: number): Polynomial;
export declare function getBCHVersion(data: number): number;
export declare function getBCHVersionInfo(data: number): number;
/**
 * @function calculateMaskPenalty
 * @param {Encoder} qrcode
 * @see https://www.thonky.com/qr-code-tutorial/data-masking
 * @see https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/qrcode/encoder/MaskUtil.java
 */
export declare function calculateMaskPenalty(qrcode: Encoder): number;

/**
 * @module QRCode
 * @author nuintun
 * @author Kazuhiko Arase
 */
import { QRData } from './QRData';
import { Colors } from '../../image/GIFImage';
import { ErrorCorrectionLevel } from '../../qrcode/common/ErrorCorrectionLevel';
export interface Options {
    version?: number;
    encodingHint?: boolean;
    errorCorrectionLevel?: ErrorCorrectionLevel;
}
export declare class Encoder {
    private matrixSize;
    private auto;
    private version;
    private chunks;
    private encodingHint;
    private matrix;
    private errorCorrectionLevel;
    constructor(options?: Options);
    /**
     * @public
     * @method getMatrix
     * @returns {boolean[][]}
     */
    getMatrix(): boolean[][];
    /**
     * @public
     * @method getMatrixSize
     * @returns {number}
     */
    getMatrixSize(): number;
    /**
     * @public
     * @method getVersion
     * @returns {number}
     */
    getVersion(): number;
    /**
     * @public
     * @method setVersion
     * @param {number} version
     * @returns {Encoder}
     */
    setVersion(version: number): Encoder;
    /**
     * @public
     * @method getErrorCorrectionLevel
     * @returns {ErrorCorrectionLevel}
     */
    getErrorCorrectionLevel(): ErrorCorrectionLevel;
    /**
     * @public
     * @method setErrorCorrectionLevel
     * @param {ErrorCorrectionLevel} errorCorrectionLevel
     */
    setErrorCorrectionLevel(errorCorrectionLevel: ErrorCorrectionLevel): Encoder;
    /**
     * @public
     * @method getEncodingHint
     * @returns {boolean}
     */
    getEncodingHint(): boolean;
    /**
     * @public
     * @method setEncodingHint
     * @param {boolean} encodingHint
     * @returns {Encoder}
     */
    setEncodingHint(encodingHint: boolean): Encoder;
    /**
     * @public
     * @method write
     * @param {QRData} data
     * @returns {Encoder}
     */
    write(data: QRData | string): Encoder;
    /**
     * @public
     * @method isDark
     * @param {number} row
     * @param {number} col
     * @returns {boolean}
     */
    isDark(row: number, col: number): boolean;
    private setupFinderPattern;
    private setupAlignmentPattern;
    private setupTimingPattern;
    private setupFormatInfo;
    private setupVersionInfo;
    private setupCodewords;
    private buildMatrix;
    /**
     * @public
     * @method make
     * @returns {Encoder}
     */
    make(): Encoder;
    /**
     * @public
     * @method toDataURL
     * @param {number} moduleSize
     * @param {number} margin
     * @returns {string}
     */
    toDataURL(moduleSize?: number, margin?: number, colors?: Colors): string;
    /**
     * @public
     * @method clear
     */
    clear(): void;
}

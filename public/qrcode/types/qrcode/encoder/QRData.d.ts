/**
 * @module QRData
 * @author nuintun
 * @author Kazuhiko Arase
 */
import { BitBuffer } from './BitBuffer';
import { Mode } from '../../qrcode/common/Mode';
export declare abstract class QRData {
    readonly mode: Mode;
    protected bytes: number[];
    protected readonly data: string;
    constructor(mode: Mode, data: string);
    getLength(): number;
    abstract writeTo(buffer: BitBuffer): void;
    getLengthInBits(version: number): number;
}

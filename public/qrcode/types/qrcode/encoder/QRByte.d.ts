/**
 * @module QR8BitByte
 * @author nuintun
 * @author Kazuhiko Arase
 */
import { QRData } from './QRData';
import { BitBuffer } from './BitBuffer';
interface EncodeResult {
    bytes: number[];
    encoding: number;
}
type encode = (data: string) => EncodeResult;
export declare class QRByte extends QRData {
    readonly encoding: number;
    /**
     * @constructor
     * @param {string} data
     */
    constructor(data: string, encode?: encode);
    /**
     * @public
     * @method writeTo
     * @param {BitBuffer} buffer
     */
    writeTo(buffer: BitBuffer): void;
}
export {};

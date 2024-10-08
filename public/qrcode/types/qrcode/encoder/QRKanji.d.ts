/**
 * @module QRKanji
 * @author nuintun
 * @author Kazuhiko Arase
 * @description SJIS only
 */
import { QRData } from './QRData';
import { BitBuffer } from './BitBuffer';
export declare class QRKanji extends QRData {
    /**
     * @constructor
     * @param {string} data
     */
    constructor(data: string);
    /**
     * @public
     * @method writeTo
     * @param {BitBuffer} buffer
     */
    writeTo(buffer: BitBuffer): void;
    /**
     * @public
     * @method getLength
     * @returns {number}
     */
    getLength(): number;
}

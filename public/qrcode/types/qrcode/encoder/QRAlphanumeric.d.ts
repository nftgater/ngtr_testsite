/**
 * @module QRAlphanumeric
 * @author nuintun
 * @author Kazuhiko Arase
 */
import { QRData } from './QRData';
import { BitBuffer } from './BitBuffer';
export declare class QRAlphanumeric extends QRData {
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
}

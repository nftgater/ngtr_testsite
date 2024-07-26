/**
 * @module QRCode
 * @package @nuintun/qrcode
 * @license MIT
 * @version 3.4.0
 * @author nuintun <nuintun@qq.com>
 * @description A pure JavaScript QRCode encode and decode library.
 * @see https://github.com/nuintun/qrcode#readme
 */

import { QRData } from './QRData.js';
import { encode } from '../../encoding/SJIS.js';
import { Mode } from '../common/Mode.js';

/**
 * @module QRKanji
 * @author nuintun
 * @author Kazuhiko Arase
 * @description SJIS only
 */
class QRKanji extends QRData {
    /**
     * @constructor
     * @param {string} data
     */
    constructor(data) {
        super(Mode.Kanji, data);
        this.bytes = encode(data);
    }
    /**
     * @public
     * @method writeTo
     * @param {BitBuffer} buffer
     */
    writeTo(buffer) {
        let index = 0;
        const { bytes } = this;
        const { length } = bytes;
        while (index + 1 < length) {
            let code = ((0xff & bytes[index]) << 8) | (0xff & bytes[index + 1]);
            if (0x8140 <= code && code <= 0x9ffc) {
                code -= 0x8140;
            }
            else if (0xe040 <= code && code <= 0xebbf) {
                code -= 0xc140;
            }
            code = ((code >> 8) & 0xff) * 0xc0 + (code & 0xff);
            buffer.put(code, 13);
            index += 2;
        }
    }
    /**
     * @public
     * @method getLength
     * @returns {number}
     */
    getLength() {
        return Math.floor(this.bytes.length / 2);
    }
}

export { QRKanji };

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
import { Mode } from '../common/Mode.js';
import { encode } from '../../encoding/UTF8.js';

/**
 * @module QR8BitByte
 * @author nuintun
 * @author Kazuhiko Arase
 */
class QRByte extends QRData {
    /**
     * @constructor
     * @param {string} data
     */
    constructor(data, encode$1) {
        super(Mode.Byte, data);
        this.encoding = -1;
        if (typeof encode$1 === 'function') {
            const { encoding, bytes } = encode$1(data);
            this.bytes = bytes;
            this.encoding = encoding;
        }
        else {
            this.bytes = encode(data);
            this.encoding = 26 /* EncodingHint.UTF8 */;
        }
    }
    /**
     * @public
     * @method writeTo
     * @param {BitBuffer} buffer
     */
    writeTo(buffer) {
        const { bytes } = this;
        for (const byte of bytes) {
            buffer.put(byte, 8);
        }
    }
}

export { QRByte };

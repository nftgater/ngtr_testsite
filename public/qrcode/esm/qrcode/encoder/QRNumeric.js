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
import { encode } from '../../encoding/UTF16.js';
import { Mode } from '../common/Mode.js';

/**
 * @module QRNumeric
 * @author nuintun
 * @author Kazuhiko Arase
 */
function getByte(byte) {
    // 0 - 9
    if (0x30 <= byte && byte <= 0x39) {
        return byte - 0x30;
    }
    throw new Error(`illegal char: ${String.fromCharCode(byte)}`);
}
function getBytes(bytes) {
    let num = 0;
    for (const byte of bytes) {
        num = num * 10 + getByte(byte);
    }
    return num;
}
class QRNumeric extends QRData {
    /**
     * @constructor
     * @param {string} data
     */
    constructor(data) {
        super(Mode.Numeric, data);
        this.bytes = encode(data);
    }
    /**
     * @public
     * @method writeTo
     * @param {BitBuffer} buffer
     */
    writeTo(buffer) {
        let i = 0;
        const { bytes } = this;
        const { length } = bytes;
        while (i + 2 < length) {
            buffer.put(getBytes([bytes[i], bytes[i + 1], bytes[i + 2]]), 10);
            i += 3;
        }
        if (i < length) {
            if (length - i === 1) {
                buffer.put(getBytes([bytes[i]]), 4);
            }
            else if (length - i === 2) {
                buffer.put(getBytes([bytes[i], bytes[i + 1]]), 7);
            }
        }
    }
}

export { QRNumeric };

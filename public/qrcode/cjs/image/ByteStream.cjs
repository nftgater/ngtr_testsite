/**
 * @module QRCode
 * @package @nuintun/qrcode
 * @license MIT
 * @version 3.4.0
 * @author nuintun <nuintun@qq.com>
 * @description A pure JavaScript QRCode encode and decode library.
 * @see https://github.com/nuintun/qrcode#readme
 */

'use strict';

/**
 * @module ByteStream
 */
class ByteStream {
    constructor() {
        this.bytes = [];
    }
    writeByte(value) {
        this.bytes.push(value & 0xff);
    }
    writeInt16(value) {
        this.bytes.push(value & 0xff, (value >> 8) & 0xff);
    }
    writeBytes(bytes, offset = 0, length = bytes.length) {
        const buffer = this.bytes;
        for (let i = 0; i < length; i++) {
            buffer.push(bytes[offset + i] & 0xff);
        }
    }
}

exports.ByteStream = ByteStream;

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
 * @module BookStream
 * @see https://github.com/google/dart-gif-encoder
 */
class DictStream {
    constructor(dict) {
        this.bits = 0;
        this.buffer = 0;
        this.bytes = [];
        this.dict = dict;
    }
    write(code) {
        let { bits } = this;
        let buffer = this.buffer | (code << bits);
        bits += this.dict.bits;
        const { bytes } = this;
        while (bits >= 8) {
            bytes.push(buffer & 0xff);
            buffer >>= 8;
            bits -= 8;
        }
        this.bits = bits;
        this.buffer = buffer;
    }
    pipe(stream) {
        const { bytes } = this;
        // Add the remaining bits. (Unused bits are set to zero.)
        if (this.bits > 0) {
            bytes.push(this.buffer);
        }
        stream.writeByte(this.dict.depth);
        // Divide it up into blocks with a size in front of each block.
        const { length } = bytes;
        for (let i = 0; i < length;) {
            const remain = length - i;
            if (remain >= 255) {
                stream.writeByte(0xff);
                stream.writeBytes(bytes, i, 255);
                i += 255;
            }
            else {
                stream.writeByte(remain);
                stream.writeBytes(bytes, i, remain);
                i = length;
            }
        }
        stream.writeByte(0);
    }
}

exports.DictStream = DictStream;

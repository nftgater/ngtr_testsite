/**
 * @module QRCode
 * @package @nuintun/qrcode
 * @license MIT
 * @version 3.4.0
 * @author nuintun <nuintun@qq.com>
 * @description A pure JavaScript QRCode encode and decode library.
 * @see https://github.com/nuintun/qrcode#readme
 */

import { ByteStream } from './ByteStream.js';

/**
 * @module Base64Stream
 */
const { fromCharCode } = String;
function encode(byte) {
    byte &= 0x3f;
    if (byte >= 0) {
        if (byte < 26) {
            // A
            return 0x41 + byte;
        }
        else if (byte < 52) {
            // a
            return 0x61 + (byte - 26);
        }
        else if (byte < 62) {
            // 0
            return 0x30 + (byte - 52);
        }
        else if (byte === 62) {
            // +
            return 0x2b;
        }
        else if (byte === 63) {
            // /
            return 0x2f;
        }
    }
    throw new Error(`illegal char: ${fromCharCode(byte)}`);
}
class Base64Stream {
    constructor() {
        this.bits = 0;
        this.buffer = 0;
        this.length = 0;
        this.stream = new ByteStream();
    }
    get bytes() {
        return this.stream.bytes;
    }
    write(byte) {
        let bits = this.bits + 8;
        const { stream } = this;
        const buffer = (this.buffer << 8) | (byte & 0xff);
        while (bits >= 6) {
            stream.writeByte(encode(buffer >>> (bits - 6)));
            bits -= 6;
        }
        this.length++;
        this.bits = bits;
        this.buffer = buffer;
    }
    close() {
        const { bits, stream, length } = this;
        if (bits > 0) {
            stream.writeByte(encode(this.buffer << (6 - bits)));
            this.bits = 0;
            this.buffer = 0;
        }
        if (length % 3 != 0) {
            // Padding
            const pad = 3 - (length % 3);
            for (let i = 0; i < pad; i++) {
                // =
                stream.writeByte(0x3d);
            }
        }
    }
}

export { Base64Stream, fromCharCode };

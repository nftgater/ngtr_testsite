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
 * @module BitBuffer
 * @author nuintun
 * @author Kazuhiko Arase
 */
class BitBuffer {
    constructor() {
        this.length = 0;
        this.buffer = [];
    }
    getBuffer() {
        return this.buffer;
    }
    getLengthInBits() {
        return this.length;
    }
    getBit(index) {
        return ((this.buffer[(index / 8) >> 0] >>> (7 - (index % 8))) & 1) === 1;
    }
    put(num, length) {
        for (let i = 0; i < length; i++) {
            this.putBit(((num >>> (length - i - 1)) & 1) === 1);
        }
    }
    putBit(bit) {
        const { buffer } = this;
        if (this.length === buffer.length * 8) {
            buffer.push(0);
        }
        if (bit) {
            buffer[(this.length / 8) >> 0] |= 0x80 >>> this.length % 8;
        }
        this.length++;
    }
}

exports.BitBuffer = BitBuffer;

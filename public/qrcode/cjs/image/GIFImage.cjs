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

var index = require('./lzw/index.cjs');
var ByteStream = require('./ByteStream.cjs');
var Base64Stream = require('./Base64Stream.cjs');

/**
 * @module index
 */
class GIFImage {
    constructor(width, height, { foreground = [0x00, 0x00, 0x00], background = [0xff, 0xff, 0xff] } = {}) {
        this.pixels = [];
        this.width = width;
        this.height = height;
        this.foreground = foreground;
        this.background = background;
    }
    encodeImpl() {
        const stream = new ByteStream.ByteStream();
        const { width, height, background, foreground } = this;
        // GIF signature: GIF89a
        stream.writeBytes([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
        // Logical screen descriptor
        stream.writeInt16(width);
        stream.writeInt16(height);
        stream.writeBytes([0x80, 0, 0]);
        // Global background color palette
        stream.writeBytes([background[0], background[1], background[2]]);
        // Global background color palette
        stream.writeBytes([foreground[0], foreground[1], foreground[2]]);
        // Image descriptor
        stream.writeByte(0x2c);
        stream.writeInt16(0);
        stream.writeInt16(0);
        stream.writeInt16(width);
        stream.writeInt16(height);
        stream.writeByte(0);
        index.compress(this.pixels, 2, stream);
        // GIF terminator
        stream.writeByte(0x3b);
        return stream.bytes;
    }
    set(x, y, color) {
        this.pixels[y * this.width + x] = color;
    }
    toDataURL() {
        const bytes = this.encodeImpl();
        const stream = new Base64Stream.Base64Stream();
        for (const byte of bytes) {
            stream.write(byte);
        }
        stream.close();
        const base64 = stream.bytes;
        let url = 'data:image/gif;base64,';
        for (const byte of base64) {
            url += Base64Stream.fromCharCode(byte);
        }
        return url;
    }
}

exports.GIFImage = GIFImage;

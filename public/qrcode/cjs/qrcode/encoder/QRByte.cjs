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

var QRData = require('./QRData.cjs');
var Mode = require('../common/Mode.cjs');
var UTF8 = require('../../encoding/UTF8.cjs');

/**
 * @module QR8BitByte
 * @author nuintun
 * @author Kazuhiko Arase
 */
class QRByte extends QRData.QRData {
    /**
     * @constructor
     * @param {string} data
     */
    constructor(data, encode) {
        super(Mode.Mode.Byte, data);
        this.encoding = -1;
        if (typeof encode === 'function') {
            const { encoding, bytes } = encode(data);
            this.bytes = bytes;
            this.encoding = encoding;
        }
        else {
            this.bytes = UTF8.encode(data);
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

exports.QRByte = QRByte;

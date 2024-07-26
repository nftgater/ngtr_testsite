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

var Mode = require('../common/Mode.cjs');

/**
 * @module QRData
 * @author nuintun
 * @author Kazuhiko Arase
 */
class QRData {
    constructor(mode, data) {
        this.bytes = [];
        this.mode = mode;
        this.data = data;
    }
    getLength() {
        return this.bytes.length;
    }
    getLengthInBits(version) {
        const mode = this.mode;
        const error = new Error(`illegal mode: ${mode}`);
        if (1 <= version && version < 10) {
            // 1 - 9
            switch (mode) {
                case Mode.Mode.Numeric:
                    return 10;
                case Mode.Mode.Alphanumeric:
                    return 9;
                case Mode.Mode.Byte:
                    return 8;
                case Mode.Mode.Kanji:
                    return 8;
                default:
                    throw error;
            }
        }
        else if (version < 27) {
            // 10 - 26
            switch (mode) {
                case Mode.Mode.Numeric:
                    return 12;
                case Mode.Mode.Alphanumeric:
                    return 11;
                case Mode.Mode.Byte:
                    return 16;
                case Mode.Mode.Kanji:
                    return 10;
                default:
                    throw error;
            }
        }
        else if (version < 41) {
            // 27 - 40
            switch (mode) {
                case Mode.Mode.Numeric:
                    return 14;
                case Mode.Mode.Alphanumeric:
                    return 13;
                case Mode.Mode.Byte:
                    return 16;
                case Mode.Mode.Kanji:
                    return 12;
                default:
                    throw error;
            }
        }
        else {
            throw new Error(`illegal version: ${version}`);
        }
    }
}

exports.QRData = QRData;

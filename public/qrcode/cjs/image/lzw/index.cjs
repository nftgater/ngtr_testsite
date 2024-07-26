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

var Dict = require('./Dict.cjs');
var DictStream = require('./DictStream.cjs');

/**
 * @module index
 * @see https://github.com/google/dart-gif-encoder
 */
function compress(pixels, depth, stream) {
    const dict = new Dict.Dict(depth);
    const buffer = new DictStream.DictStream(dict);
    buffer.write(dict.bof);
    if (pixels.length > 0) {
        let code = pixels[0];
        const { length } = pixels;
        for (let i = 1; i < length; i++) {
            const pixelIndex = pixels[i];
            const nextCode = dict.get(code, pixelIndex);
            if (nextCode != null) {
                code = nextCode;
            }
            else {
                buffer.write(code);
                // Reset dict when full
                if (!dict.add(code, pixelIndex)) {
                    buffer.write(dict.bof);
                    dict.reset();
                }
                code = pixelIndex;
            }
        }
        buffer.write(code);
    }
    buffer.write(dict.eof);
    buffer.pipe(stream);
}

exports.compress = compress;

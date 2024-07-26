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
 * @module Dict
 * @see https://github.com/google/dart-gif-encoder
 */
// The highest code that can be defined in the CodeBook.
const MAX_CODE = (1 << 12) - 1;
/**
 * A dict contains codes defined during LZW compression. It's a mapping from a string
 * of pixels to the code that represents it. The codes are stored in a trie which is
 * represented as a map. Codes may be up to 12 bits. The size of the codebook is always
 * the minimum power of 2 needed to represent all the codes and automatically increases
 * as new codes are defined.
 */
class Dict {
    constructor(depth) {
        const bof = 1 << depth;
        const eof = bof + 1;
        this.bof = bof;
        this.eof = eof;
        this.depth = depth;
        this.reset();
    }
    reset() {
        const bits = this.depth + 1;
        this.bits = bits;
        this.size = 1 << bits;
        this.codes = new Map();
        this.unused = this.eof + 1;
    }
    add(code, index) {
        let { unused } = this;
        if (unused > MAX_CODE) {
            return false;
        }
        this.codes.set((code << 8) | index, unused++);
        let { bits, size } = this;
        if (unused > size) {
            size = 1 << ++bits;
        }
        this.bits = bits;
        this.size = size;
        this.unused = unused;
        return true;
    }
    get(code, index) {
        return this.codes.get((code << 8) | index);
    }
}

exports.Dict = Dict;

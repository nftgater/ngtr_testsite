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
 * @module MaskPattern
 * @author nuintun
 * @author Cosmo Wolfe
 * @author Kazuhiko Arase
 */
function getMaskFunc(maskPattern) {
    switch (maskPattern) {
        case 0 /* MaskPattern.PATTERN000 */:
            return (x, y) => ((x + y) & 0x1) === 0;
        case 1 /* MaskPattern.PATTERN001 */:
            return (_x, y) => (y & 0x1) === 0;
        case 2 /* MaskPattern.PATTERN010 */:
            return (x, _y) => x % 3 === 0;
        case 3 /* MaskPattern.PATTERN011 */:
            return (x, y) => (x + y) % 3 === 0;
        case 4 /* MaskPattern.PATTERN100 */:
            return (x, y) => ((((x / 3) >> 0) + ((y / 2) >> 0)) & 0x1) === 0;
        case 5 /* MaskPattern.PATTERN101 */:
            return (x, y) => ((x * y) & 0x1) + ((x * y) % 3) === 0;
        case 6 /* MaskPattern.PATTERN110 */:
            return (x, y) => ((((x * y) & 0x1) + ((x * y) % 3)) & 0x1) === 0;
        case 7 /* MaskPattern.PATTERN111 */:
            return (x, y) => ((((x * y) % 3) + ((x + y) & 0x1)) & 0x1) === 0;
        default:
            throw new Error(`illegal mask: ${maskPattern}`);
    }
}

exports.getMaskFunc = getMaskFunc;

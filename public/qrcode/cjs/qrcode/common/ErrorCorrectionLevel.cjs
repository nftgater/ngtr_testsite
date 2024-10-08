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
 * @module ErrorCorrectionLevel
 * @author nuintun
 * @author Cosmo Wolfe
 * @author Kazuhiko Arase
 */
/**
 * @readonly
 */
exports.ErrorCorrectionLevel = void 0;
(function (ErrorCorrectionLevel) {
    // 7%
    ErrorCorrectionLevel[ErrorCorrectionLevel["L"] = 1] = "L";
    // 15%
    ErrorCorrectionLevel[ErrorCorrectionLevel["M"] = 0] = "M";
    // 25%
    ErrorCorrectionLevel[ErrorCorrectionLevel["Q"] = 3] = "Q";
    // 30%
    ErrorCorrectionLevel[ErrorCorrectionLevel["H"] = 2] = "H";
})(exports.ErrorCorrectionLevel || (exports.ErrorCorrectionLevel = {}));

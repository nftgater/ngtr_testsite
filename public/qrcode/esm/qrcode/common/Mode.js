/**
 * @module QRCode
 * @package @nuintun/qrcode
 * @license MIT
 * @version 3.4.0
 * @author nuintun <nuintun@qq.com>
 * @description A pure JavaScript QRCode encode and decode library.
 * @see https://github.com/nuintun/qrcode#readme
 */

/**
 * @module Mode
 * @author nuintun
 * @author Cosmo Wolfe
 * @author Kazuhiko Arase
 */
/**
 * @readonly
 */
var Mode;
(function (Mode) {
    Mode[Mode["Terminator"] = 0] = "Terminator";
    Mode[Mode["Numeric"] = 1] = "Numeric";
    Mode[Mode["Alphanumeric"] = 2] = "Alphanumeric";
    Mode[Mode["StructuredAppend"] = 3] = "StructuredAppend";
    Mode[Mode["Byte"] = 4] = "Byte";
    Mode[Mode["Kanji"] = 8] = "Kanji";
    Mode[Mode["ECI"] = 7] = "ECI";
    // FNC1FirstPosition = 0x05,
    // FNC1SecondPosition = 0x09
})(Mode || (Mode = {}));

export { Mode };

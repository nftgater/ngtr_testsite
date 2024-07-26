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
 * @module UTF16
 * @author nuintun
 */
/**
 * @function encode
 * @param {string} text
 * @returns {number[]}
 */
function encode(text) {
    const { length } = text;
    const bytes = [];
    for (let i = 0; i < length; i++) {
        bytes.push(text.charCodeAt(i));
    }
    return bytes;
}

export { encode };

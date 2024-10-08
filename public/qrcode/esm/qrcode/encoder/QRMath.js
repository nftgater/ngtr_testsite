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
 * @module QRMath
 * @author nuintun
 * @author Kazuhiko Arase
 */
const EXP_TABLE = [];
const LOG_TABLE = [];
for (let i = 0; i < 256; i++) {
    LOG_TABLE[i] = 0;
    EXP_TABLE[i] = i < 8 ? 1 << i : EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
}
for (let i = 0; i < 255; i++) {
    LOG_TABLE[EXP_TABLE[i]] = i;
}
function glog(n) {
    if (n < 1) {
        throw new Error(`illegal log: ${n}`);
    }
    return LOG_TABLE[n];
}
function gexp(n) {
    while (n < 0) {
        n += 255;
    }
    while (n >= 256) {
        n -= 255;
    }
    return EXP_TABLE[n];
}

export { gexp, glog };

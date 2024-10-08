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

var Mode = require('./qrcode/common/Mode.cjs');
var QRByte = require('./qrcode/encoder/QRByte.cjs');
var Writer = require('./qrcode/encoder/Writer.cjs');
var Reader = require('./qrcode/decoder/Reader.cjs');
var QRKanji = require('./qrcode/encoder/QRKanji.cjs');
var QRNumeric = require('./qrcode/encoder/QRNumeric.cjs');
var QRAlphanumeric = require('./qrcode/encoder/QRAlphanumeric.cjs');
var ErrorCorrectionLevel = require('./qrcode/common/ErrorCorrectionLevel.cjs');



Object.defineProperty(exports, 'Mode', {
	enumerable: true,
	get: function () { return Mode.Mode; }
});
exports.QRByte = QRByte.QRByte;
exports.Encoder = Writer.Encoder;
exports.Decoder = Reader.Decoder;
exports.QRKanji = QRKanji.QRKanji;
exports.QRNumeric = QRNumeric.QRNumeric;
exports.QRAlphanumeric = QRAlphanumeric.QRAlphanumeric;
Object.defineProperty(exports, 'ErrorCorrectionLevel', {
	enumerable: true,
	get: function () { return ErrorCorrectionLevel.ErrorCorrectionLevel; }
});

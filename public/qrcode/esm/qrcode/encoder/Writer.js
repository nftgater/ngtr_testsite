/**
 * @module QRCode
 * @package @nuintun/qrcode
 * @license MIT
 * @version 3.4.0
 * @author nuintun <nuintun@qq.com>
 * @description A pure JavaScript QRCode encode and decode library.
 * @see https://github.com/nuintun/qrcode#readme
 */

import { QRByte } from './QRByte.js';
import { QRData } from './QRData.js';
import { getAlignmentPattern, getBCHVersion, calculateMaskPenalty, getErrorCorrectionPolynomial, getBCHVersionInfo } from './QRUtil.js';
import { RSBlock } from './RSBlock.js';
import { BitBuffer } from './BitBuffer.js';
import { Polynomial } from './Polynomial.js';
import { Mode } from '../common/Mode.js';
import { GIFImage } from '../../image/GIFImage.js';
import { getMaskFunc } from '../common/MaskPattern.js';
import { ErrorCorrectionLevel } from '../common/ErrorCorrectionLevel.js';

/**
 * @module QRCode
 * @author nuintun
 * @author Kazuhiko Arase
 */
const PAD0 = 0xec;
const PAD1 = 0x11;
const { toString } = Object.prototype;
/**
 * @function appendECI
 * @param {number} encoding
 * @param {BitBuffer} buffer
 * @see https://github.com/nayuki/QR-Code-generator/blob/master/typescript-javascript/qrcodegen.ts
 * @see https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/qrcode/encoder/Encoder.java
 */
function appendECI(encoding, buffer) {
    if (encoding < 0 || encoding >= 1000000) {
        throw new Error('byte mode encoding hint out of range');
    }
    buffer.put(Mode.ECI, 4);
    if (encoding < 1 << 7) {
        buffer.put(encoding, 8);
    }
    else if (encoding < 1 << 14) {
        buffer.put(2, 2);
        buffer.put(encoding, 14);
    }
    else {
        buffer.put(6, 3);
        buffer.put(encoding, 21);
    }
}
function prepareData(version, errorCorrectionLevel, encodingHint, chunks) {
    const buffer = new BitBuffer();
    const rsBlocks = RSBlock.getRSBlocks(version, errorCorrectionLevel);
    for (const data of chunks) {
        const mode = data.mode;
        // Default set encoding UTF-8 when has encoding hint
        if (encodingHint && mode === Mode.Byte) {
            appendECI(data.encoding, buffer);
        }
        buffer.put(mode, 4);
        buffer.put(data.getLength(), data.getLengthInBits(version));
        data.writeTo(buffer);
    }
    // Calc max data count
    let maxDataCount = 0;
    for (const rsBlock of rsBlocks) {
        maxDataCount += rsBlock.getDataCount();
    }
    maxDataCount *= 8;
    return [buffer, rsBlocks, maxDataCount];
}
function createBytes(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcData = [];
    const ecData = [];
    const rsLength = rsBlocks.length;
    const bufferData = buffer.getBuffer();
    for (let r = 0; r < rsLength; r++) {
        const rsBlock = rsBlocks[r];
        const dcCount = rsBlock.getDataCount();
        const ecCount = rsBlock.getTotalCount() - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcData[r] = [];
        for (let i = 0; i < dcCount; i++) {
            dcData[r][i] = 0xff & bufferData[i + offset];
        }
        offset += dcCount;
        const rsPoly = getErrorCorrectionPolynomial(ecCount);
        const ecLength = rsPoly.getLength() - 1;
        const rawPoly = new Polynomial(dcData[r], ecLength);
        const modPoly = rawPoly.mod(rsPoly);
        const mpLength = modPoly.getLength();
        ecData[r] = [];
        for (let i = 0; i < ecLength; i++) {
            const modIndex = i + mpLength - ecLength;
            ecData[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
        }
    }
    buffer = new BitBuffer();
    for (let i = 0; i < maxDcCount; i++) {
        for (let r = 0; r < rsLength; r++) {
            if (i < dcData[r].length) {
                buffer.put(dcData[r][i], 8);
            }
        }
    }
    for (let i = 0; i < maxEcCount; i++) {
        for (let r = 0; r < rsLength; r++) {
            if (i < ecData[r].length) {
                buffer.put(ecData[r][i], 8);
            }
        }
    }
    return buffer;
}
function createData(buffer, rsBlocks, maxDataCount) {
    // End
    if (buffer.getLengthInBits() + 4 <= maxDataCount) {
        buffer.put(0, 4);
    }
    // Padding
    while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(false);
    }
    // Padding
    while (true) {
        if (buffer.getLengthInBits() >= maxDataCount) {
            break;
        }
        buffer.put(PAD0, 8);
        if (buffer.getLengthInBits() >= maxDataCount) {
            break;
        }
        buffer.put(PAD1, 8);
    }
    return createBytes(buffer, rsBlocks);
}
class Encoder {
    constructor(options = {}) {
        this.matrixSize = 0;
        this.chunks = [];
        this.matrix = [];
        const { version = 0, encodingHint = false, errorCorrectionLevel = ErrorCorrectionLevel.L } = options;
        this.setVersion(version);
        this.setEncodingHint(encodingHint);
        this.setErrorCorrectionLevel(errorCorrectionLevel);
    }
    /**
     * @public
     * @method getMatrix
     * @returns {boolean[][]}
     */
    getMatrix() {
        return this.matrix;
    }
    /**
     * @public
     * @method getMatrixSize
     * @returns {number}
     */
    getMatrixSize() {
        return this.matrixSize;
    }
    /**
     * @public
     * @method getVersion
     * @returns {number}
     */
    getVersion() {
        return this.version;
    }
    /**
     * @public
     * @method setVersion
     * @param {number} version
     * @returns {Encoder}
     */
    setVersion(version) {
        this.version = Math.min(40, Math.max(0, version >> 0));
        this.auto = this.version === 0;
        return this;
    }
    /**
     * @public
     * @method getErrorCorrectionLevel
     * @returns {ErrorCorrectionLevel}
     */
    getErrorCorrectionLevel() {
        return this.errorCorrectionLevel;
    }
    /**
     * @public
     * @method setErrorCorrectionLevel
     * @param {ErrorCorrectionLevel} errorCorrectionLevel
     */
    setErrorCorrectionLevel(errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
            case ErrorCorrectionLevel.L:
            case ErrorCorrectionLevel.M:
            case ErrorCorrectionLevel.Q:
            case ErrorCorrectionLevel.H:
                this.errorCorrectionLevel = errorCorrectionLevel;
        }
        return this;
    }
    /**
     * @public
     * @method getEncodingHint
     * @returns {boolean}
     */
    getEncodingHint() {
        return this.encodingHint;
    }
    /**
     * @public
     * @method setEncodingHint
     * @param {boolean} encodingHint
     * @returns {Encoder}
     */
    setEncodingHint(encodingHint) {
        this.encodingHint = encodingHint;
        return this;
    }
    /**
     * @public
     * @method write
     * @param {QRData} data
     * @returns {Encoder}
     */
    write(data) {
        const { chunks } = this;
        if (data instanceof QRData) {
            chunks.push(data);
        }
        else {
            const type = toString.call(data);
            if (type === '[object String]') {
                chunks.push(new QRByte(data));
            }
            else {
                throw new Error(`illegal data: ${data}`);
            }
        }
        return this;
    }
    /**
     * @public
     * @method isDark
     * @param {number} row
     * @param {number} col
     * @returns {boolean}
     */
    isDark(row, col) {
        return this.matrix[row][col] === true;
    }
    setupFinderPattern(row, col) {
        const { matrix } = this;
        const matrixSize = this.matrixSize;
        for (let r = -1; r <= 7; r++) {
            for (let c = -1; c <= 7; c++) {
                if (row + r <= -1 || matrixSize <= row + r || col + c <= -1 || matrixSize <= col + c) {
                    continue;
                }
                if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
                    (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
                    (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                    matrix[row + r][col + c] = true;
                }
                else {
                    matrix[row + r][col + c] = false;
                }
            }
        }
    }
    setupAlignmentPattern() {
        const { matrix } = this;
        const pos = getAlignmentPattern(this.version);
        const { length } = pos;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                const row = pos[i];
                const col = pos[j];
                if (matrix[row][col] !== null) {
                    continue;
                }
                for (let r = -2; r <= 2; r++) {
                    for (let c = -2; c <= 2; c++) {
                        if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                            matrix[row + r][col + c] = true;
                        }
                        else {
                            matrix[row + r][col + c] = false;
                        }
                    }
                }
            }
        }
    }
    setupTimingPattern() {
        const { matrix } = this;
        const count = this.matrixSize - 8;
        for (let i = 8; i < count; i++) {
            const bit = i % 2 === 0;
            // vertical
            if (matrix[i][6] === null) {
                matrix[i][6] = bit;
            }
            // horizontal
            if (matrix[6][i] === null) {
                matrix[6][i] = bit;
            }
        }
    }
    setupFormatInfo(maskPattern) {
        const { matrix } = this;
        const data = (this.errorCorrectionLevel << 3) | maskPattern;
        const bits = getBCHVersionInfo(data);
        const matrixSize = this.matrixSize;
        for (let i = 0; i < 15; i++) {
            const bit = ((bits >> i) & 1) === 1;
            // Vertical
            if (i < 6) {
                matrix[i][8] = bit;
            }
            else if (i < 8) {
                matrix[i + 1][8] = bit;
            }
            else {
                matrix[matrixSize - 15 + i][8] = bit;
            }
            // Horizontal
            if (i < 8) {
                matrix[8][matrixSize - i - 1] = bit;
            }
            else if (i < 9) {
                matrix[8][15 - i - 1 + 1] = bit;
            }
            else {
                matrix[8][15 - i - 1] = bit;
            }
        }
        // Fixed point
        matrix[matrixSize - 8][8] = true;
    }
    setupVersionInfo() {
        if (this.version >= 7) {
            const { matrix } = this;
            const matrixSize = this.matrixSize;
            const bits = getBCHVersion(this.version);
            for (let i = 0; i < 18; i++) {
                const bit = ((bits >> i) & 1) === 1;
                matrix[(i / 3) >> 0][(i % 3) + matrixSize - 8 - 3] = bit;
                matrix[(i % 3) + matrixSize - 8 - 3][(i / 3) >> 0] = bit;
            }
        }
    }
    setupCodewords(data, maskPattern) {
        const { matrix } = this;
        const matrixSize = this.matrixSize;
        const bitLength = data.getLengthInBits();
        const maskFunc = getMaskFunc(maskPattern);
        // Bit index into the data
        let bitIndex = 0;
        // Do the funny zigzag scan
        for (let right = matrixSize - 1; right >= 1; right -= 2) {
            // Index of right column in each column pair
            if (right === 6) {
                right = 5;
            }
            for (let vert = 0; vert < matrixSize; vert++) {
                // Vertical counter
                for (let j = 0; j < 2; j++) {
                    // Actual x coordinate
                    const x = right - j;
                    const upward = ((right + 1) & 2) === 0;
                    // Actual y coordinate
                    const y = upward ? matrixSize - 1 - vert : vert;
                    if (matrix[y][x] !== null) {
                        continue;
                    }
                    let bit = false;
                    if (bitIndex < bitLength) {
                        bit = data.getBit(bitIndex++);
                    }
                    const invert = maskFunc(x, y);
                    if (invert) {
                        bit = !bit;
                    }
                    matrix[y][x] = bit;
                }
            }
        }
    }
    buildMatrix(data, maskPattern) {
        // Initialize matrix
        const matrix = [];
        const matrixSize = this.matrixSize;
        for (let row = 0; row < matrixSize; row++) {
            matrix[row] = [];
            for (let col = 0; col < matrixSize; col++) {
                matrix[row][col] = null;
            }
        }
        this.matrix = matrix;
        // Setup finder pattern
        this.setupFinderPattern(0, 0);
        this.setupFinderPattern(matrixSize - 7, 0);
        this.setupFinderPattern(0, matrixSize - 7);
        // Setup alignment pattern
        this.setupAlignmentPattern();
        // Setup timing pattern
        this.setupTimingPattern();
        // Setup format info
        this.setupFormatInfo(maskPattern);
        // Setup version info
        this.setupVersionInfo();
        // Setup codewords
        this.setupCodewords(data, maskPattern);
    }
    /**
     * @public
     * @method make
     * @returns {Encoder}
     */
    make() {
        let buffer;
        let rsBlocks;
        let maxDataCount;
        const { chunks, errorCorrectionLevel } = this;
        if (this.auto) {
            let version = 1;
            for (; version <= 40; version++) {
                [buffer, rsBlocks, maxDataCount] = prepareData(version, errorCorrectionLevel, this.encodingHint, chunks);
                if (buffer.getLengthInBits() <= maxDataCount)
                    break;
            }
            const dataLengthInBits = buffer.getLengthInBits();
            if (dataLengthInBits > maxDataCount) {
                throw new Error(`data overflow: ${dataLengthInBits} > ${maxDataCount}`);
            }
            this.version = version;
        }
        else {
            [buffer, rsBlocks, maxDataCount] = prepareData(this.version, errorCorrectionLevel, this.encodingHint, chunks);
        }
        // Calc module count
        this.matrixSize = this.version * 4 + 17;
        const matrices = [];
        const data = createData(buffer, rsBlocks, maxDataCount);
        let bestMaskPattern = -1;
        let minPenalty = Number.MAX_VALUE;
        // Choose best mask pattern
        for (let maskPattern = 0; maskPattern < 8; maskPattern++) {
            this.buildMatrix(data, maskPattern);
            matrices.push(this.matrix);
            const penalty = calculateMaskPenalty(this);
            if (penalty < minPenalty) {
                minPenalty = penalty;
                bestMaskPattern = maskPattern;
            }
        }
        this.matrix = matrices[bestMaskPattern];
        return this;
    }
    /**
     * @public
     * @method toDataURL
     * @param {number} moduleSize
     * @param {number} margin
     * @returns {string}
     */
    toDataURL(moduleSize = 2, margin = moduleSize * 4, colors) {
        moduleSize = Math.max(1, moduleSize >> 0);
        margin = Math.max(0, margin >> 0);
        const matrixSize = this.matrixSize;
        const size = moduleSize * matrixSize + margin * 2;
        const min = margin;
        const max = size - margin;
        const gif = new GIFImage(size, size, colors);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (min <= x && x < max && min <= y && y < max) {
                    const row = ((y - min) / moduleSize) >> 0;
                    const col = ((x - min) / moduleSize) >> 0;
                    gif.set(x, y, this.isDark(row, col) ? 1 : 0);
                }
                else {
                    gif.set(x, y, 0);
                }
            }
        }
        return gif.toDataURL();
    }
    /**
     * @public
     * @method clear
     */
    clear() {
        this.chunks = [];
    }
}

export { Encoder };

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

var locator = require('./locator.cjs');
var extractor = require('./extractor.cjs');
var index = require('./decoder/index.cjs');
var binarizer = require('./binarizer.cjs');

/**
 * @module QRCode
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
function scan(matrix) {
    const locations = locator.locate(matrix);
    if (locations === null) {
        return null;
    }
    for (const location of locations) {
        const extracted = extractor.extract(matrix, location);
        const decoded = index.decode(extracted.matrix);
        if (decoded !== null) {
            const dimension = location.dimension;
            return Object.assign(Object.assign({}, decoded), { location: {
                    topLeft: extracted.mappingFunction(0, 0),
                    topRight: extracted.mappingFunction(dimension, 0),
                    bottomLeft: extracted.mappingFunction(0, dimension),
                    bottomRight: extracted.mappingFunction(dimension, dimension),
                    topLeftFinder: location.topLeft,
                    topRightFinder: location.topRight,
                    bottomLeftFinder: location.bottomLeft,
                    bottomRightAlignment: decoded.version > 1 ? location.alignmentPattern : null
                } });
        }
    }
    return null;
}
function disposeImageEvents(image) {
    image.onload = null;
    image.onerror = null;
}
class Decoder {
    constructor(options = {}) {
        this.options = options;
    }
    /**
     * @public
     * @method setOptions
     * @param {object} options
     */
    setOptions(options) {
        this.options = Object.assign(Object.assign({}, this.options), options);
        return this;
    }
    /**
     * @public
     * @method decode
     * @param {Uint8ClampedArray} data
     * @param {number} width
     * @param {number} height
     * @returns {DecoderResult}
     */
    decode(data, width, height) {
        const { options } = this;
        const { canOverwriteImage, greyScaleWeights, inversionAttempts = 'attemptBoth' } = options;
        const tryInvertedFirst = inversionAttempts === 'onlyInvert' || inversionAttempts === 'invertFirst';
        const invert = tryInvertedFirst || inversionAttempts === 'attemptBoth';
        const { binarized, inverted } = binarizer.binarize(data, width, height, invert, greyScaleWeights, canOverwriteImage);
        let result = scan(tryInvertedFirst ? inverted : binarized);
        if (result !== null && (options.inversionAttempts === 'attemptBoth' || options.inversionAttempts === 'invertFirst')) {
            result = scan(tryInvertedFirst ? binarized : inverted);
        }
        return result;
    }
    /**
     * @public
     * @method scan
     * @param {string} src
     * @returns {Promise}
     */
    scan(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            // Image cross origin
            image.crossOrigin = 'anonymous';
            image.onload = () => {
                disposeImageEvents(image);
                const width = image.width;
                const height = image.height;
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (context === null) {
                    return reject(new Error(`browser does not support canvas.getContext('2d')`));
                }
                canvas.width = width;
                canvas.height = height;
                context.drawImage(image, 0, 0);
                const { data } = context.getImageData(0, 0, width, height);
                const result = this.decode(data, width, height);
                if (result !== null) {
                    return resolve(result);
                }
                return reject(new Error('failed to decode image'));
            };
            image.onerror = () => {
                disposeImageEvents(image);
                reject(new Error(`failed to load image: ${src}`));
            };
            image.src = src;
        });
    }
}

exports.Decoder = Decoder;

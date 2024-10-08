/**
 * @module QRCode
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { Point } from './Point';
import { DecodeResult } from './decoder';
import { GreyscaleWeights } from './binarizer';
export interface DecoderResult extends DecodeResult {
    location: {
        topLeft: Point;
        topRight: Point;
        bottomLeft: Point;
        bottomRight: Point;
        topLeftFinder: Point;
        topRightFinder: Point;
        bottomLeftFinder: Point;
        bottomRightAlignment: Point | null;
    };
}
export interface Options {
    canOverwriteImage?: boolean;
    greyScaleWeights?: GreyscaleWeights;
    inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst';
}
export declare class Decoder {
    private options;
    constructor(options?: Options);
    /**
     * @public
     * @method setOptions
     * @param {object} options
     */
    setOptions(options: Options): Decoder;
    /**
     * @public
     * @method decode
     * @param {Uint8ClampedArray} data
     * @param {number} width
     * @param {number} height
     * @returns {DecoderResult}
     */
    decode(data: Uint8ClampedArray, width: number, height: number): DecoderResult | null;
    /**
     * @public
     * @method scan
     * @param {string} src
     * @returns {Promise}
     */
    scan(src: string): Promise<DecoderResult>;
}

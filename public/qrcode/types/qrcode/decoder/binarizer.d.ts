/**
 * @module binarizer
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { BitMatrix } from './BitMatrix';
export interface GreyscaleWeights {
    red: number;
    green: number;
    blue: number;
    useIntegerApproximation?: boolean;
}
export interface BinarizeResult {
    inverted?: BitMatrix;
    binarized: BitMatrix;
}
export declare function binarize(data: Uint8ClampedArray, width: number, height: number, returnInverted: boolean, greyscaleWeights?: GreyscaleWeights, canOverwriteImage?: boolean): BinarizeResult;

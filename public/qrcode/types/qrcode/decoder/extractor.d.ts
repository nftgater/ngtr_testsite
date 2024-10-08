/**
 * @module extractor
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { Point } from './Point';
import { QRLocation } from './locator';
import { BitMatrix } from './BitMatrix';
type mappingFunction = (x: number, y: number) => Point;
export interface ExtractResult {
    matrix: BitMatrix;
    mappingFunction: mappingFunction;
}
export declare function extract(image: BitMatrix, location: QRLocation): ExtractResult;
export {};

/**
 * @module locator
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { Point } from './Point';
import { BitMatrix } from './BitMatrix';
export interface QRLocation {
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    dimension: number;
    alignmentPattern: Point;
}
export declare function locate(matrix: BitMatrix): QRLocation[] | null;

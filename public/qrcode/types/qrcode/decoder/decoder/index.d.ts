/**
 * @module index
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { DecodeResult } from './decode';
import { BitMatrix } from '../../../qrcode/decoder/BitMatrix';
export { DecodeResult };
export declare function decode(matrix: BitMatrix): DecodeResult | null;

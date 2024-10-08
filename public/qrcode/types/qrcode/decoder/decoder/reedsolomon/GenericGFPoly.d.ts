/**
 * @module GenericGFPoly
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { GenericGF } from './GenericGF';
export declare class GenericGFPoly {
    private field;
    private coefficients;
    constructor(field: GenericGF, coefficients: Uint8ClampedArray);
    degree(): number;
    isZero(): boolean;
    getCoefficient(degree: number): number;
    addOrSubtract(other: GenericGFPoly): GenericGFPoly;
    multiply(scalar: number): GenericGFPoly;
    multiplyPoly(other: GenericGFPoly): GenericGFPoly;
    multiplyByMonomial(degree: number, coefficient: number): GenericGFPoly;
    evaluateAt(a: number): number;
}

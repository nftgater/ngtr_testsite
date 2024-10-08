/**
 * @module GenericGF
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
import { GenericGFPoly } from './GenericGFPoly';
export declare function addOrSubtractGF(a: number, b: number): number;
export declare class GenericGF {
    primitive: number;
    size: number;
    generatorBase: number;
    zero: GenericGFPoly;
    one: GenericGFPoly;
    private expTable;
    private logTable;
    constructor(primitive: number, size: number, generatorBase: number);
    multiply(a: number, b: number): number;
    inverse(a: number): number;
    buildMonomial(degree: number, coefficient: number): GenericGFPoly;
    log(a: number): number;
    exp(a: number): number;
}

/**
 * @module Polynomial
 * @author nuintun
 * @author Kazuhiko Arase
 */
export declare class Polynomial {
    private num;
    constructor(num: number[], shift?: number);
    getAt(index: number): number;
    getLength(): number;
    multiply(e: Polynomial): Polynomial;
    mod(e: Polynomial): Polynomial;
}

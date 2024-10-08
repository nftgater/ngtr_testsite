/**
 * @module BitMatrix
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
export declare class BitMatrix {
    width: number;
    height: number;
    private data;
    constructor(data: Uint8ClampedArray, width: number);
    static createEmpty(width: number, height: number): BitMatrix;
    get(x: number, y: number): boolean;
    set(x: number, y: number, v: boolean): void;
    setRegion(left: number, top: number, width: number, height: number, v: boolean): void;
}

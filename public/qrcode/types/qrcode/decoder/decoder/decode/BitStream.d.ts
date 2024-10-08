/**
 * @module BitStream
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
export declare class BitStream {
    private bytes;
    private byteOffset;
    private bitOffset;
    constructor(bytes: Uint8ClampedArray);
    readBits(numBits: number): number;
    available(): number;
}

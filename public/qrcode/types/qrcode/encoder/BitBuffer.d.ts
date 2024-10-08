/**
 * @module BitBuffer
 * @author nuintun
 * @author Kazuhiko Arase
 */
export declare class BitBuffer {
    private length;
    private buffer;
    getBuffer(): number[];
    getLengthInBits(): number;
    getBit(index: number): boolean;
    put(num: number, length: number): void;
    putBit(bit: boolean): void;
}

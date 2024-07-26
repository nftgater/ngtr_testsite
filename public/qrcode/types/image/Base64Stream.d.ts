/**
 * @module Base64Stream
 */
export declare const fromCharCode: (...codes: number[]) => string;
export declare class Base64Stream {
    private bits;
    private buffer;
    private length;
    private stream;
    get bytes(): number[];
    write(byte: number): void;
    close(): void;
}

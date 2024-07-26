/**
 * @module index
 */
export type RGB = [
    R: number,
    G: number,
    B: number
];
export interface Colors {
    foreground?: RGB;
    background?: RGB;
}
export declare class GIFImage {
    private width;
    private height;
    private foreground;
    private background;
    private pixels;
    constructor(width: number, height: number, { foreground, background }?: Colors);
    private encodeImpl;
    set(x: number, y: number, color: number): void;
    toDataURL(): string;
}

/**
 * @module MaskPattern
 * @author nuintun
 * @author Cosmo Wolfe
 * @author Kazuhiko Arase
 */
export type MaskFunc = (x: number, y: number) => boolean;
export declare function getMaskFunc(maskPattern: number): MaskFunc;

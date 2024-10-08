/**
 * @module SJIS
 * @author nuintun
 * @author soldair
 * @author Kazuhiko Arase
 * @see https://github.com/soldair/node-qrcode/blob/master/helper/to-sjis.js
 */
type SJISTable = {
    [byte: number]: number;
};
export interface SJISTables {
    UTF8_TO_SJIS: SJISTable;
    SJIS_TO_UTF8: SJISTable;
}
/**
 * @function getTables
 * @returns {SJISTables}
 */
export declare function getTables(): SJISTables;
/**
 * @function encode
 * @param {string} text
 * @returns {number[]}
 */
export declare function encode(text: string): number[];
/**
 * @function decode
 * @param {number[]} bytes
 * @returns {string}
 * @see https://github.com/narirou/jconv/blob/master/jconv.js
 */
export declare function decode(bytes: number[]): string;
export {};

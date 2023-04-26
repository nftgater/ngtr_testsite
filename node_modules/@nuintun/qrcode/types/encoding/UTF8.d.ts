/**
 * @module UTF8
 * @author nuintun
 */
/**
 * @function encode
 * @param {string} text
 * @returns {number[]}
 * @see https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 */
export declare function encode(text: string): number[];
/**
 * @function decode
 * @param {number[]} bytes
 * @returns {string}
 * @see https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 */
export declare function decode(bytes: number[]): string;

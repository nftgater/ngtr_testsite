/**
 * @module QRCode
 * @package @nuintun/qrcode
 * @license MIT
 * @version 3.4.0
 * @author nuintun <nuintun@qq.com>
 * @description A pure JavaScript QRCode encode and decode library.
 * @see https://github.com/nuintun/qrcode#readme
 */

import { gexp, glog } from './QRMath.js';

/**
 * @module Polynomial
 * @author nuintun
 * @author Kazuhiko Arase
 */
class Polynomial {
    constructor(num, shift = 0) {
        let offset = 0;
        let { length } = num;
        while (offset < length && num[offset] === 0) {
            offset++;
        }
        length -= offset;
        const numbers = [];
        for (let i = 0; i < length; i++) {
            numbers.push(num[offset + i]);
        }
        for (let i = 0; i < shift; i++) {
            numbers.push(0);
        }
        this.num = numbers;
    }
    getAt(index) {
        return this.num[index];
    }
    getLength() {
        return this.num.length;
    }
    multiply(e) {
        const num = [];
        const eLength = e.getLength();
        const tLength = this.getLength();
        const dLength = tLength + eLength - 1;
        for (let i = 0; i < dLength; i++) {
            num.push(0);
        }
        for (let i = 0; i < tLength; i++) {
            for (let j = 0; j < eLength; j++) {
                num[i + j] ^= gexp(glog(this.getAt(i)) + glog(e.getAt(j)));
            }
        }
        return new Polynomial(num);
    }
    mod(e) {
        const eLength = e.getLength();
        const tLength = this.getLength();
        if (tLength - eLength < 0) {
            return this;
        }
        const ratio = glog(this.getAt(0)) - glog(e.getAt(0));
        // Create copy
        const num = [];
        for (let i = 0; i < tLength; i++) {
            num.push(this.getAt(i));
        }
        // Subtract and calc rest.
        for (let i = 0; i < eLength; i++) {
            num[i] ^= gexp(glog(e.getAt(i)) + ratio);
        }
        // Call recursively
        return new Polynomial(num).mod(e);
    }
}

export { Polynomial };

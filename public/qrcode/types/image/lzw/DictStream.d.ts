/**
 * @module BookStream
 * @see https://github.com/google/dart-gif-encoder
 */
import { Dict } from './Dict';
import { ByteStream } from '../../image/ByteStream';
export declare class DictStream {
    private bits;
    private dict;
    private buffer;
    private bytes;
    constructor(dict: Dict);
    write(code: number): void;
    pipe(stream: ByteStream): void;
}

/**
 * @module Version
 * @author nuintun
 * @author Cosmo Wolfe
 * @license https://raw.githubusercontent.com/cozmo/jsQR/master/LICENSE
 */
interface ECBlock {
    numBlocks: number;
    dataCodewordsPerBlock: number;
}
export interface ECLevel {
    ecBlocks: ECBlock[];
    ecCodewordsPerBlock: number;
}
export interface Version {
    infoBits: number;
    versionNumber: number;
    errorCorrectionLevels: ECLevel[];
    alignmentPatternCenters: number[];
}
export declare const VERSIONS: Version[];
export {};

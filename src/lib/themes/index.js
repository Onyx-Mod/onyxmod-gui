import defaultsDeep from 'lodash.defaultsdeep';

import * as blocksThree from './blocks/three';
import * as blocksHighContrast from './blocks/high-contrast';
import * as blocksDark from './blocks/dark';


const BLOCKS_THREE = 'three';
const BLOCKS_DARK = 'dark';
const BLOCKS_HIGH_CONTRAST = 'high-contrast';
const BLOCKS_CUSTOM = 'custom';
const BLOCKS_DEFAULT = BLOCKS_THREE;
const defaultBlockColors = blocksThree.blockColors;
const BLOCKS_MAP = {
    [BLOCKS_THREE]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksThree.blockColors,
        extensions: blocksThree.extensions,
        customExtensionColors: {},
        useForStage: true
    },
    [BLOCKS_HIGH_CONTRAST]: {
        blocksMediaFolder: 'blocks-media/high-contrast',
        colors: defaultsDeep({}, blocksHighContrast.blockColors, defaultBlockColors),
        extensions: blocksHighContrast.extensions,
        customExtensionColors: blocksHighContrast.customExtensionColors,
        useForStage: true
    },
    [BLOCKS_DARK]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: defaultsDeep({}, blocksDark.blockColors, defaultBlockColors),
        extensions: blocksDark.extensions,
        customExtensionColors: blocksDark.customExtensionColors,
        useForStage: false
    },
    [BLOCKS_CUSTOM]: {
        // to be filled by editor-theme3 addon
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksThree.blockColors,
        extensions: {},
        customExtensionColors: {},
        useForStage: false
    }
};

let themeObjectsCreated = 0;

class Theme {
    constructor (accent, gui, blocks) {
        // do not modify these directly
        /** @readonly */
        this.id = ++themeObjectsCreated;
        /** @readonly */
        this.blocks = Object.prototype.hasOwnProperty.call(BLOCKS_MAP, blocks) ? blocks : BLOCKS_DEFAULT;
    }

    static light = new Theme(BLOCKS_DEFAULT);
    static dark = new Theme(BLOCKS_DEFAULT);
    static highContrast = new Theme(BLOCKS_HIGH_CONTRAST);

    set (what, to) {
        if (what === 'blocks') {
            return new Theme(this.accent, this.gui, to);
        }
        throw new Error(`Unknown theme property: ${what}`);
    }

    getBlocksMediaFolder () {
        return BLOCKS_MAP[this.blocks].blocksMediaFolder;
    }


    getBlockColors () {
        return defaultsDeep(
            {},
            BLOCKS_MAP[this.blocks].colors
        );
    }

    getExtensions () {
        return BLOCKS_MAP[this.blocks].extensions;
    }

    isDark () {
        return this.getGuiColors()['color-scheme'] === 'dark';
    }

    getStageBlockColors () {
        if (BLOCKS_MAP[this.blocks].useForStage) {
            return this.getBlockColors();
        }
        return Theme.light.getBlockColors();
    }

    getCustomExtensionColors () {
        return BLOCKS_MAP[this.blocks].customExtensionColors;
    }
}

export {
    Theme,
    defaultBlockColors,

    BLOCKS_THREE,
    BLOCKS_DARK,
    BLOCKS_HIGH_CONTRAST,
    BLOCKS_CUSTOM,
    BLOCKS_MAP
};

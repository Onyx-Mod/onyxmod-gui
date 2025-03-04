const blockColors = {
    motion: {
        primary: '#4C97FF',
        secondary: '#4280D7',
        tertiary: '#3373CC',
        quaternary: '#3373CC'
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB',
        quaternary: '#774DCB'
    },
    sounds: {
        primary: '#CF63CF',
        secondary: '#C94FC9',
        tertiary: '#BD42BD',
        quaternary: '#BD42BD'
    },
    control: {
        primary: '#FFAB19',
        secondary: '#EC9C13',
        tertiary: '#CF8B17',
        quaternary: '#CF8B17'
    },
    event: {
        primary: '#FFBF00',
        secondary: '#E6AC00',
        tertiary: '#CC9900',
        quaternary: '#CC9900'
    },
    sensing: {
        primary: '#5CB1D6',
        secondary: '#47A8D1',
        tertiary: '#2E8EB8',
        quaternary: '#2E8EB8'
    },
    pen: {
        primary: '#0fBD8C',
        secondary: '#0DA57A',
        tertiary: '#0B8E69',
        quaternary: '#0B8E69'
    },
    operators: {
        primary: '#59C059',
        secondary: '#46B946',
        tertiary: '#389438',
        quaternary: '#389438'
    },
    data: {
        primary: '#FF8C1A',
        secondary: '#FF8000',
        tertiary: '#DB6E00',
        quaternary: '#DB6E00'
    },
    // This is not a new category, but rather for differentiation
    // between lists and scalar variables.
    data_lists: {
        primary: '#FF661A',
        secondary: '#FF5500',
        tertiary: '#E64D00',
        quaternary: '#E64D00'
    },
    more: {
        primary: '#FF6680',
        secondary: '#FF4D6A',
        tertiary: '#FF3355',
        quaternary: '#FF3355'
    },
    comments: {
        primary: '#E4DB8C',
        secondary: '#C6BE79',
        tertiary: '#A8A167',
        quaternary: '#A8A167'
    },
    addons: {
        primary: '#29beb8',
        secondary: '#3aa8a4',
        tertiary: '#3aa8a4',
        quaternary: '#3aa8a4'
    },
    text: '#FFFFFF',
    workspace: '#F9F9F9',
    toolboxHover: '#4C97FF',
    toolboxSelected: '#E9EEF2',
    toolboxText: '#575E75',
    toolbox: '#FFFFFF',
    blackText: '#575E75',
    flyout: '#F9F9F9',
    scrollbar: '#CECDCE',
    scrollbarHover: '#CECDCE',
    textField: '#FFFFFF',
    textFieldText: '#575E75',
    insertionMarker: '#000000',
    insertionMarkerOpacity: 0.2,
    dragShadowOpacity: 0.6,
    stackGlow: '#FFF200',
    stackGlowSize: 4,
    stackGlowOpacity: 1,
    replacementGlow: '#FFFFFF',
    replacementGlowSize: 2,
    replacementGlowOpacity: 1,
    colourPickerStroke: '#FFFFFF',
    // CSS colours: support RGBA
    fieldShadow: 'rgba(255, 255, 255, 0.3)',
    dropDownShadow: 'rgba(0, 0, 0, .3)',
    numPadBackground: '#547AB2',
    numPadBorder: '#435F91',
    numPadActiveBackground: '#435F91',
    numPadText: 'white', // Do not use hex here, it cannot be inlined with data-uri SVG
    valueReportBackground: '#FFFFFF',
    valueReportBorder: '#AAAAAA',
    valueReportForeground: '#000000',
    menuHover: 'rgba(0, 0, 0, 0.2)',
    contextMenuBackground: '#ffffff',
    contextMenuBorder: '#cccccc',
    contextMenuForeground: '#000000',
    contextMenuActiveBackground: '#d6e9f8',
    contextMenuDisabledForeground: '#cccccc',
    flyoutLabelColor: '#575E75',
    checkboxInactiveBackground: '#ffffff',
    checkboxInactiveBorder: '#c8c8c8',
    checkboxActiveBackground: '#4C97FF',
    checkboxActiveBorder: '#3373CC',
    checkboxCheck: '#ffffff',
    buttonBorder: '#c6c6c6',
    buttonActiveBackground: '#ffffff',
    buttonForeground: '#575E75',
    zoomIconFilter: 'none',
    gridColor: '#dddddd'
};

const extensions = {};

export {
    blockColors,
    extensions
};

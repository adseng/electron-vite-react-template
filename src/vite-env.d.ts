/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />
/// <reference types="vite-plugin-svgr/client" />
declare global {
    interface Window {
        electronAPI: {
            requestFullscreen: Function
            exitFullscreen: Function
            toggleFullscreen: Function
            toggleDevTools: Function
            isFullScreen: Function
        }
    }
}

export {}

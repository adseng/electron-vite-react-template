import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import terser from '@rollup/plugin-terser'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import svgr from 'vite-plugin-svgr'
import fs from 'fs'
import electron from 'vite-plugin-electron'

const version = fs.readFileSync(resolve(__dirname, 'doc/version')).toString().trim()
process.env['VITE_BS_VERSION'] = version
console.log('hello, 前端版本号:', process.env['VITE_NL_VERSION'])

// https://vitejs.dev/config/
export default defineConfig((env) => {

    return {
        plugins: [
            svgr(),
            react({
                jsxImportSource: '@emotion/react',
                babel: {
                    plugins: ['@emotion/babel-plugin']
                }
            }),
            env.mode === 'pc' ? electron({
                entry: ['electron/main.ts', 'electron/preload.ts']
            }) : null
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src')
            }
        },
        base: '',
        build: {
            chunkSizeWarningLimit: 500,
            rollupOptions: {
                plugins: [
                    terser({
                        format: {
                            comments: false
                        }
                    })
                ],
                output: {
                    manualChunks: id => {
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                    }
                }
            }
        },
        css: {
            preprocessorOptions: {
                postcss: {
                    plugins: [
                        tailwindcss('./tailwind.config.js'),
                        autoprefixer()
                    ]
                }
            }
        }
    }
})

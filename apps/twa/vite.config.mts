import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true
            }
        })
    ],
    server: {
        host: '0.0.0.0',
        port: 3000,
        allowedHosts: true
    },
    resolve: {
        alias: {
            '@tonkeeper/core/dist': path.resolve(__dirname, '../../packages/core/src'),
            '@tonkeeper/core': path.resolve(__dirname, '../../packages/core/src'),
            '@tonkeeper/uikit/dist': path.resolve(__dirname, '../../packages/uikit/src'),
            '@tonkeeper/uikit': path.resolve(__dirname, '../../packages/uikit/src'),
            '@tonkeeper/locales': path.resolve(__dirname, '../../packages/locales'),
            react: path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
            '@ton/core': path.resolve(__dirname, '../../packages/core/node_modules/@ton/core'),
            '@ton/crypto': path.resolve(__dirname, '../../packages/core/node_modules/@ton/crypto'),
            '@ton/ton': path.resolve(__dirname, '../../packages/core/node_modules/@ton/ton'),
            'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
            'styled-components': path.resolve(__dirname, './node_modules/styled-components'),
            'react-i18next': path.resolve(__dirname, './node_modules/react-i18next'),
            '@tanstack/react-query': path.resolve(__dirname, './node_modules/@tanstack/react-query')
        }
    }
});

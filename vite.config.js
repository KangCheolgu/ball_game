import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'

export default {
    root: 'src/',
    publicDir: '../public/',
    base: './',
    plugins:
    [
        // React support
        react(),

        // .js file support as if it was JSX
        {
            name: 'load+transform-js-files-as-jsx',
            async transform(code, id)
            {
                if (!id.match(/src\/.*\.js$/))
                    return null

                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
    ],
    server:
    {
        host: true, // Open to local network and display URL
        // open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env), // Open if it's not a CodeSandbox
        port: 3001,
        proxy: {
            // 웹소켓 또는 socket.io 프락시: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
            '/socket.io': {
              target: 'ws://localhost:5173',
              ws: true
            }
          }
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
}
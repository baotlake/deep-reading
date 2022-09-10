const esbuild = require('esbuild')
const { exec } = require('node:child_process')

esbuild.build({
    entryPoints: ['./src/website.tsx'],
    bundle: true,
    minify: true,
    outdir: 'dist',
    target: 'esnext',
    watch: true,
})

esbuild.build({
    entryPoints: ['./src/index.tsx'],
    bundle: true,
    outdir: 'es',
    format: 'esm',
    watch: {
        onRebuild(err, result) {
            if (!err) {
                console.log('watch build succeded: ', result)
                exec('npx tsc --emitDeclarationOnly')
            }
        }
    },
    external: [
        'react',
        'react-dom',
        '@mui/*',
        '@emotion/*',
        'classnames',
    ]
})

exec('npx tsc --emitDeclarationOnly')

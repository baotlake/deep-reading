const esbuild = require('esbuild')
const { exec } = require('node:child_process')

esbuild.build({
    entryPoints: ['./src/index.ts'],
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
    external: []
})

exec('npx tsc --emitDeclarationOnly')

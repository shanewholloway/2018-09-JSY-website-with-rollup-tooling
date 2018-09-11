import rpi_resolve from 'rollup-plugin-node-resolve'
//import rpi_hash_n_gzip from 'rollup-plugin-hash-n-gzip'
import rpi_sse_build_events from 'rollup-plugin-web-build-events/cjs/sse'
import rpi_jsy from 'rollup-plugin-jsy-lite'

const configs = []
export default configs

const sourcemap = true
const base_plugins = [
  rpi_resolve({modulesOnly:true}),
  rpi_sse_build_events(),
]
const external = []

const add_jsy = name => {
  const plugins = [rpi_jsy()].concat(base_plugins)
  configs.push({
    input: `code/${name}.jsy`,
    output: { file: `public/umd/${name}.js`, format: 'umd', name, exports:'named', sourcemap },
    plugins, external }) }

const add_vanilla = name => {
  const plugins = [].concat(base_plugins)
  configs.push({
    input: `code/${name}.js`,
    output: { file: `public/umd/${name}.js`, format: 'umd', name, exports:'named', sourcemap },
    plugins, external }) }


add_jsy('body')
add_jsy('head')
add_jsy('console_notes')
add_jsy('sse_reload')

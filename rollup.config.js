const fs = require('fs')
import rpi_resolve from 'rollup-plugin-node-resolve'
import rpi_hash_n_gzip from 'rollup-plugin-hash-n-gzip'
import rpi_sse_build_events from 'rollup-plugin-web-build-events'
import { datalive_renderHTMLTempalteFile } from 'rollup-plugin-web-build-events/cjs/server/dataLive'
import rpi_jsy from 'rollup-plugin-jsy-lite'

console.log()
console.log('ROLLUP.CONFIG', new Date)
console.log()

const configs = []
export default configs

const pi_events = rpi_sse_build_events({onBuildUpdate})

const sourcemap = true
const watch = {clearScreen: false}
const base_plugins = [
  rpi_resolve({modulesOnly:true}),
  rpi_hash_n_gzip({onBuildUpdate: pi_events}),
  pi_events,
]
const external = []

const add_jsy = name => {
  const plugins = [rpi_jsy()].concat(base_plugins)
  configs.push({
    input: `code/${name}.jsy`,
    output: { file: `public/umd/${name}.js`, format: 'umd', name, exports:'named', sourcemap },
    plugins, external, watch }) }

const add_vanilla = name => {
  const plugins = [].concat(base_plugins)
  configs.push({
    input: `code/${name}.js`,
    output: { file: `public/umd/${name}.js`, format: 'umd', name, exports:'named', sourcemap },
    plugins, external, watch }) }


add_jsy('body')
add_jsy('head')
add_jsy('console_notes')
add_jsy('sse_reload')

function onBuildUpdate({mapping}) {
  datalive_renderHTMLTempalteFile({mapping, input: './template/index.html', output: './public/index.html'})
}

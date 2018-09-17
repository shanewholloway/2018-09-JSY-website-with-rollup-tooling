const fs = require('fs')
import rpi_resolve from 'rollup-plugin-node-resolve'
import rpi_replace from 'rollup-plugin-replace'
import rpi_strip_code from 'rollup-plugin-strip-code'

import rpi_hash_n_gzip from 'rollup-plugin-hash-n-gzip'
import rpi_sse_build_events from 'rollup-plugin-web-build-events'
import { datalive_renderHTMLTempalteFile } from 'rollup-plugin-web-build-events/cjs/server/dataLive'
import rpi_jsy from 'rollup-plugin-jsy-lite'


const configs = []
export default configs

const pi_events = rpi_sse_build_events({onBuildUpdate})

const sourcemap = true
const watch = {clearScreen: false}

const is_watch = -1 !== process.argv.indexOf('-w') || -1 !== process.argv.indexOf('--watch')
const is_production = (/production/i).test(process.env.NODE_ENV)

const plugins = [
  rpi_replace({
    include: 'code/*',
    'process.env.NODE_ENV': JSON.stringify(is_production ? 'production' : 'development'),
  }),

  is_watch ? null : rpi_strip_code({
    include: 'code/*',
    start_comment: `BEGIN WATCH MODE`,
    end_comment: `END WATCH MODE`,
  }),

  rpi_strip_code({
    include: 'code/*',
    start_comment: `BEGIN ${is_production ? 'DEV' : 'PROD'} ONLY`,
    end_comment: `END ${is_production ? 'DEV' : 'PROD'} ONLY`,
  }),

  rpi_jsy(),
  rpi_resolve({modulesOnly:true}),
  rpi_hash_n_gzip({onBuildUpdate: pi_events}),
  pi_events,

].filter(Boolean)


add_jsy_script('head')
add_jsy_module('body')
add_jsy_module('console_notes')

function onBuildUpdate({mapping}) {
  datalive_renderHTMLTempalteFile(mapping, {input: './template/index.html', output: './public/index.html'})
  fs.writeFile('./public/dynamic.json', JSON.stringify(mapping, null, 2), err=>err && console.error(err))
}


function add_jsy_module(name) {
  configs.push({
    input: `code/${name}.jsy`,
    output: { dir: `public/esm/`, format: 'esm', sourcemap },
    plugins, watch, experimentalCodeSplitting: true }) }

function add_jsy_script(name) {
  configs.push({
    input: `code/${name}.jsy`,
    output: { file: `public/umd/${name}.js`, format: 'umd', name, exports:'named', sourcemap },
    plugins, watch }) }


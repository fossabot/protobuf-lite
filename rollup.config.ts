import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import * as path from "path";

import replace from "rollup-plugin-re"; // https://github.com/dcodeIO/protobuf.js/issues/593#issuecomment-327147178

const pkg = require("./package.json");

const libraryName = "protobuf-lite";

const onwarn = warning => {
  // Silence circular dependency warning for protobufjs package
  if (
    warning.code === "CIRCULAR_DEPENDENCY" &&
    !warning.importer.indexOf(path.normalize("node_modules/protobufjs"))
  ) {
    return;
  }

  console.warn(`(!) ${warning.message}`);
};

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: "umd", sourcemap: true },
    { file: pkg.module, format: "es", sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: "src/**"
  },
  plugins: [
    replace({
      patterns: [
        {
          test: /eval.*\(moduleName\);/g,
          replace: "undefined;"
        }
      ]
    }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      namedExports: {
        "node_modules/protobufjs/index.js": ["Field", "Type"]
      }
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ],
  onwarn
};

import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
// import { terser } from "rollup-plugin-terser";
import { RollupOptions } from "rollup";

/**
 * @type RollupOptions
 */
const config = {
	input: "src/index.ts",
	plugins: [
		commonjs(),
		nodeResolve({
			browser: true,
			preferBuiltins: false,
			dedupe: ["buffer"],
			extensions: [".js", ".ts"],
			mainFields: ["browser", "module", "main"],
		}),
		json({ compact: true }),
		typescript({
			tsconfig: "./tsconfig.esm.json",
			module: "ES2020",
    		target: "es2015",
			outputToFilesystem: false,
		}),
		replace({
			preventAssignment: true,
			values: {
				"process.env.NODE_ENV": JSON.stringify("production"),
				"process.env.NODE_DEBUG": JSON.stringify(""),
				"process.env": JSON.stringify({}),
			},
		}),
		// terser(),
	],
	output: {
		file: "dist/browser/index.js",
		format: "es",
		sourcemap: true,
	},
};

export default config;

import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
import css from "rollup-plugin-css-only"

const production = !process.env.ROLLUP_WATCH

export default {
	input: "src/svelte.js",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "dist/build/svelte.js"
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: !production
			}
		}),

		css({ output: "svelte.css" }),

		resolve({
			browser: true,
			dedupe: ["svelte"]
		}),
		commonjs(),

		!production && livereload("dist"),

		production && terser()
	],
	watch: {
		clearScreen: false
	}
}

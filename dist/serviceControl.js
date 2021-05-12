const Shell = require("node-powershell")
const { parse: toml } = require("toml")
const { readFileSync } = require("fs")
const { resolve } = require("path")
const { exec } = require("child_process")

let service = null
let config = toml(readFileSync(`${__dirname}/config.toml`))


switch (process.platform) {
	case "win32": {
		service = "windows"
		break
	}
	case "linux": {
		service = "linux"
		break
	}
	case "darwin": {
		service = "mac"
		break
	}
}

const { Service } = require(`node-${service}`)

module.exports = {
	check: () => new Promise(( resolve ) => { 
		exec("sc.exe query photonservice.exe", ( error, stdout, stderr ) => {
			if (error) return resolve("not installed")

			let res = stdout.replace(/ +/g, '').split("\n")
			if (/STATE/.test(res[3])) {
				let state = res[3].split(":")[1].slice(1).toLowerCase()
				resolve(state.trim())
			} else {
				resolve("error")
			}
		})
	}),
	install: function () { 
		var svc = new Service({
			name: "PhotonService",
			description: "Backgroundworker for Photon Application.",
			script: resolve(config.apiPath)
		})

		svc.install()

		svc.on("install", () => {
			svc.start()
		})
	},
	uninstall: function () {
		var svc = new Service({
			name: "PhotonService",
			description: "Backgroundworker for Photon Application.",
			script: resolve(config.apiPath)
		})

		svc.uninstall()
	},
	start: function () {
		return runAsAdmin("sc.exe", "start photonservice.exe")
	},
	stop: function () {
		return runAsAdmin("sc.exe", "stop photonservice.exe")
	}
}

async function runAsAdmin ( file, command ) {
	const shell = new Shell({})
	await shell.addCommand('Start-Process')
	await shell.addArgument(file)

	// Elevate the process
	await shell.addArgument('-Verb')
	await shell.addArgument('RunAs')

	// Hide the window for cleaner UX
	await shell.addArgument('-WindowStyle')
	await shell.addArgument('Hidden')

	// Propagate output from child process
	await shell.addArgument('-PassThru')

	// Wait for the child process to finish before exiting
	await shell.addArgument('-Wait')

	// Pass argument list to use in elevated PowerShell
	if (command) {
		await shell.addArgument('-ArgumentList')
		await shell.addArgument(`"${command}"`)
	}

	await shell.invoke()
	return await shell.dispose()
}

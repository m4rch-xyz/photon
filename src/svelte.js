import App from "./main.svelte"

function fetchAll () {
	return [
		fetch("http://localhost:1872/devices/", { method: "GET" }),
		fetch("http://localhost:1872/sync/modes/", { method: "GET" }),
		fetch("http://localhost:1872/profiles/", { method: "GET" }),
		fetch("http://localhost:1872/settings/", { method: "GET" }),
		fetch("http://localhost:1872/sync/zones/", { method: "GET" })
	]
}

const getAll = () => new Promise(async ( resolve ) => {
	let all = await Promise.all(fetchAll())

	let [ devices, modes, profiles, settings, zones ] = await Promise.all(all.map(( fetch ) => fetch.json()))

	resolve({
		devices,
		modes,
		profiles,
		settings,
		zones
	})
})

function checkState () {
	return fetch("http://localhost:1872/status/", { method: "GET" })
}

const app = new App({
	target: document.body,
	props: {
		getAll,
		checkState
	}
})

export default app

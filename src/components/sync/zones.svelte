<script>
	import { createEventDispatcher } from "svelte"
import { loop_guard } from "svelte/internal";
	const dispatch = createEventDispatcher()

	import Zone from "./zone.svelte"

	export let zones
	export let devices
	export let mode
	export let selected
	export let values

	let zoneNames = zones.map(([ name ]) => name)
	let edit = false

	let nActive = true
	let nName = null
	let nDevices = []
	let nNew = true
	let nOldName = ""

	let devices_extend = true
	$: zoneNames = zoneNames.filter(( name ) => name != null)
	$: zones = zones.filter(( zone ) => zoneNames.includes(zone[0]))

	if (!selected) {
		for (let [ i, zone ] of zones.entries()) {
			if (zone[1].active) {
				selected = { name: zone[0], mode: [ zone[1].modeName, zone[1].options ] }
				break
			} else if (zones.length - 1 == i) {
				selected = { name: zones[0][0], mode: [ zones[0][1].modeName, zones[0][1].options ] }
			}
		}
	}

	function initNew () {
		let name = "new"
		let num = 0

		while (zoneNames.includes(name)) {
			num++
			name = `new-${num}`
		}

		nOldName = ""
		nName = name
		nNew = true

		edit = true
	}

	function initEdit ({ detail }) {
		
		nName = detail.name

		nDevices = detail.devices
		nNew = false
		edit = true
		nOldName = detail.name
	}

	function exitEdit () {
		edit = false
		nActive = true
		nName = null
		nDevices = []
		nNew = true
		devices_extend = true
	}

	function selectDevice ( location ) {
		if (nDevices.includes(location)) {
			nDevices = nDevices.filter(( loc ) => location != loc)
		} else {
			nDevices = nDevices.concat(location)
		}
	}

	async function addZone () {
		let res = await fetch("http://localhost:1872/sync/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				active: nActive,
				deviceList: nDevices,
				zoneName: nName,
				modeName: mode[0],
				options: values
			})
		})
		res = await res.json()

		if (!res.ok) {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		} else {
			zones = zones.concat([[ nName, { active: nActive, deviceList: nDevices, mode: mode[0], options: mode[1] }]])
			zoneNames = zoneNames.concat(nName)
			selected = { name: nName, mode: [ mode[0], mode[1] ] }
			exitEdit()
		}
	}

	async function editZone () {
		let body = {
			deviceList: nDevices,
			zoneName: nOldName,
		}
		if (nOldName != nName) body.newZoneName
		let res = await fetch("http://localhost:1872/sync/set", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		})
		res = await res.json()

		if (!res.ok) {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		} else {
			let zoneIndex = zones.findIndex(zone => zone[0] == nOldName)
			zones[zoneIndex][0] = nName 
			zones[zoneIndex][1].deviceList = nDevices
			// zones[zoneIndex][1].active = nActive
			zones = zones.concat([[ nName, { active: nActive, deviceList: nDevices, mode: mode[0], options: mode[1] }]])
			zoneNames[zoneNames.indexOf(nOldName)] = nName
			exitEdit()
		}
	}
</script>


{#each zoneNames as _, index}
	<Zone on:message on:initEdit={initEdit} bind:selected bind:name={zoneNames[index]} {devices} bind:options={zones[index][1]} {zones}></Zone>
{/each}

<div class="addline">
	<div on:click={initNew} class="add">+</div>
</div>

{#if edit}
	<div class="layer">
		<div class="set">
			<input bind:value={nName} class="name">
			<div on:click={() => devices_extend = !devices_extend} class="{devices_extend} devices-extend">devices</div>
			{#if devices_extend}
				<div class="devices">
					{#each devices as device}
						{#if (nNew ? zones: zones.filter(zone => zone[0] != nOldName)).filter(zone => zone[1].active).map(zone => zone[1].deviceList).flat().includes(device.location) }
							<div on:click={() => dispatch("message", { type: "error", text: "device already used in an active zone" })} class="disabled device">{device.name}</div>
						{:else}
							<div on:click={() => selectDevice(device.location)} class="{nDevices.includes(device.location)} device">{device.name}</div>
						{/if}
					{/each}
				</div>
			{/if}
			<button on:click={() => nNew ? addZone() : editZone()}>save</button>
			<button on:click={exitEdit}>discard</button>
		</div>
	</div>
{/if}

<style>

	.addline {
		display: flex;
		justify-content: center;
		height: 40px;
		width: 100%;
	}

	.add {
		width: 40px;
		font-size: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 25px;
		transition: 0.4s background-color;
		background: #00808033;
		user-select: none;
		cursor: pointer;
	}

	.add:hover {
		background: #00808066;
	}

	.layer {
		position: fixed;
		z-index: 30;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;

		padding: 7.5%;

		background-color: #ffffff66;
	}

	.set {
		height: 100%;
		position: relative;
		background-color: #f8f8f8;
	}

	.name {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 5%;
		font-size: 21px;
		width: 60%;
		margin: 0 20% 10px;
		border: 0;
		border-bottom: 2px solid #000000;
		box-sizing: border-box;
		padding: 0 0 0 20px;
	}

	.devices-extend {
		display: flex;
		align-items: center;
		width: 100%;
		height: 35px;
		justify-content: center;
		font-size: 18px;
		background-color: #ddd;
		cursor: pointer;
	}

	.devices-extend.true {
		background-color: #bbb;
	}

	.devices {
		width: 90%;
		margin-left: 5%;
	}

	.device {
		font-size: 16px;
		height: 30px;
		cursor: pointer;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-left: 15px;
		background-color: #f2f2f2;
		transition: 0.4s background-color;
	}

	.device:hover {
		background-color: #ddd;
	}

	.device.true {
		color: teal;
	}

</style>

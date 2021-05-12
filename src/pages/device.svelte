<script>
	import Header from "../components/device/header.svelte"
	import Options from "../components/device/options.svelte"

	export let global
	export let devices
	export let zones

	let device
	let mode
	let args = {}
	let index = global.device.selected || 0

	$: global.device.selected = index
	$: {
		device = null
		setTimeout(() => device = devices[index], 0)
	}
	$: inZone = device && zones.filter(zone => zone[1].active).map(zone => zone[1].deviceList).flat().includes(device.location)
	$: global.sync.zones = zones

	function send () {
		fetch(`http://localhost:3000/device/${device.deviceId}/${mode.id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(args)
		})
	}

	async function removeDevice () {
		let zone = zones.find(zone => zone[1].deviceList.includes(device.location) && zone[1].active)

		let res = await fetch("http://localhost:3000/sync/set", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				zoneName: zone[0],
				deviceList: zone[1].deviceList.filter(loc => loc != device.location)
			})
		})
		res = await res.json()

		if (!res.ok) {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		} else {
			let i = zones.findIndex(zone => zone[1].deviceList.includes(device.location) && zone[1].active)
			zones[i][1].deviceList = zones[i][1].deviceList.filter(loc => loc != device.location)
		}
	}
	async function stopZone () {
		let zone =  zones.find(zone => zone[1].deviceList.includes(device.location) && zone[1].active) //unlink vars

		let res = await fetch("http://localhost:3000/sync/set/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				zoneName: zone[0],
				active: false
			})
		})
		res = await res.json()

		if (!res.ok) {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		} else {
			let i = zones.findIndex(zone => zone[1].deviceList.includes(device.location) && zone[1].active)
			zones[i][1].active = false
		}
	}

</script>


<Header bind:index {devices} ></Header>

<div class="options">
	{#if device}
		<Options bind:values={args} bind:current={mode} {device} ></Options>
	{/if}
</div>

{#if inZone}
	<div class="options layer">
		<div class="layer-container">
			<div class="layer-text">This device is already used in a sync Zone</div>
			<div class="layer-buttons">
				<div on:click={stopZone} class="layer-button">stop zone</div> 
				<div on:click={removeDevice} class="layer-button">remove device from zone</div>
			</div>
		</div>	
	</div>
{/if}

<div on:click={() => !inZone && send()} class="save {inZone}">save</div>


<style>

	.options {
		position: absolute;

		top: 100px;
		right: 5%;
		bottom: 90px;
		left: 5%;

		background: #00808020;
	}

	.layer {
		background-color: #ffffff99;
		display: flex;
		align-items: center;
	}

	.layer-text {
		width: 100%;
		text-align: center;
		font-size: 1.5rem;
	}

	.layer-buttons {
		margin-top:20px;
	}

	.layer-button {
		display: flex;
		width: 30%;
		float: left;
		text-align: center;
		background-color: #00808066;
		margin: 0 10%;
		cursor: pointer;
		height: 75px;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		transition: 0.4s background-color;
	}

	.layer-button:hover {
		background-color: #008080;
	}

	.layer-button:last-child {
		float: right;
	}

	.layer-container {
		display: grid;
		height: fit-content;
		width: 100%;
	}

	/* .layerbutton {
		
	} */

	.save {
		position: absolute;
		bottom: 20px;
		height: 50px;
		width: 80%;
		left: 10%;
		background: #00808033;
		text-align: center;
		transition: 0.4s background-color;
		cursor: pointer;
		font-size: 24px;
		box-sizing: border-box;
		padding: 10px 0;
	}

	.save:hover {
		background: #00808099;
	}

	.save.true {
		background-color: #ffffff99;
		cursor: default;
	}

</style>


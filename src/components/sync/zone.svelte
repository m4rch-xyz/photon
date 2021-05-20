<script>
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let name
	export let options
	export let devices
	export let selected
	export let zones

	let layer = false

	async function activate () {

		if (!options.active) {
			let zoneLocations = zones.filter(zone => zone[1].active).map(zone => zone[1].deviceList).flat()
			
			for (let device of options.deviceList) {
				if (zoneLocations.includes(device)) {
					dispatch("message", {
						type: "error",
						text: "a device in this zone is already used in an active zone"
					})
					return
				}
			}
		}

		let res = await fetch("http://localhost:1872/sync/set/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				zoneName: name,
				active: !options.active
			})
		})
		res = await res.json()

		if (res.ok) {
			options.active = !options.active
		} else {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		}
	}

	async function del () {
		let res = await fetch("http://localhost:1872/sync/delete/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				zoneName: name
			})
		})
		res = await res.json()

		if (res.ok) {
			if (selected.name == name) {
				let zoneIndex = zones.findIndex(zone => zone[0] == name)
				selected = zones[zoneIndex + 1] || zones[zoneIndex - 1] ? { name: zones[zoneIndex + 1]?.[0] || zones[zoneIndex - 1]?.[0], mode: [ options.modeName, options ] } : null
			}
			name = null
		} else {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		}
	}

</script>


<div class="main">
	<div class="zone">
		<div class="{selected?.name == name} header">
			<div on:click={() => selected = { name, mode: [ options.modeName, options ] }} class="name">{name}</div>
			<div class="img">
				<img class="active" on:click={activate} src="svg/{options.active ? "pause" : "play"}.svg" alt="edit">
				<img class="edit" on:click={() => dispatch("initEdit", { name, devices: options.deviceList })} src="svg/edit.svg" alt="edit">
				<img class="delete" on:click={del} src="svg/delete.svg" alt="delete">
			</div>
		</div>
		<div class="devices">
			{#each options.deviceList as device}
				<div class="device">{devices.find(({ location }) => location == device).name}</div>
			{/each}
		</div>
	</div>

	{#if layer}
		<div class="layer">
			<div class="edit"></div>
		</div>
	{/if}
</div>


<style>

	.main {
		height: 120px;
		margin-bottom: 20px;
		height: fit-content;
	}

	.name {
		font-size: 21px;
		cursor: pointer;
		text-align: left;
		float: left;

		width: calc(100% - 15px - 74px);
	}

	div.main:last-of-type {
		margin-bottom: 0;
	}

	.zone {
		height: inherit;
	}

	.header {
		background: #00808033;
		height: 35px;
		box-sizing: border-box;
		padding: 5px 5px 5px 10px;
	}

	.header.true {
		background: #00808066;
	}

	.img {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 7px;
		padding: 5px 0;
		float: right;
	}

	.img > img {
		height: 20px;
		width: 20px;
		cursor: pointer;
		transition: 0.4s background-color;
		cursor: pointer;
	}

	.devices {
		background: #00808033;
		padding: 5px 10px 10px 10px;
	}

	.device {
		margin-bottom: 8px;
	}

	.device:last-of-type {
		margin-bottom: 0;
	}

</style>

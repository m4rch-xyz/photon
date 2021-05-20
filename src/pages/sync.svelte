<script>
	import Options from "../components/sync/options.svelte"
	import Zones from "../components/sync/zones.svelte"

	export let modes
	export let devices
	export let zones
	export let global

	let selectedZone = null
	selectedZone = global.sync.selectedZone ?? selectedZone

	modes = Object.entries(modes)
	zones = global.sync.zones ?? zones

	let values = {}
	let index = global.sync.selected ?? (modes.map(( mode ) => mode[0]).includes("off.js") ? modes.map(( mode ) => mode[0]).indexOf("off.js") : 0)
	let current = []

	function send () {
		if (!selectedZone) return

		fetch(`http://localhost:1872/sync/set/`, {
			method: "POST",
			headers: {
      			"Content-Type": "application/json"
    		},
			body: JSON.stringify({
				zoneName: selectedZone.name,
				modeName: current[0],
				options: values
			})
		})

	}

	$: {
		current = []
		setTimeout(() => current = modes[index], 1)
	}
	$: global.sync.selected = index
	$: global.zones = zones
	$: global.sync.selectedZone = selectedZone

</script>


<div class="main">
	{#if current?.length}
		<select bind:value={index} class="select">
			{#each modes as [ name ], i}
				<option value={i}>{name.slice(0, -3).replace("_", " ")}</option>
			{/each}
		</select>

		<div class="options">
			{#if current[1]}
				<Options bind:values options={current[1]} ></Options>
			{/if}
		</div>
	{/if}

	<div on:click={send} class="save">save</div>
</div>

<div class="zones">
	<Zones {values} bind:selected={selectedZone} mode={current} on:message bind:zones {devices}></Zones>
</div>


<style>

	.zones {
		position: relative;
		float: right;
		padding: 0 0 0 10px;
		box-sizing: border-box;
		width: 35%;
		height: 100%;
	}

	.main {
		float: left;
		padding: 0 10px 0 0;
		width: 65%;
		position: relative;
		height: 100%;
		box-sizing: border-box;
	}

	.select {
		width: 100%;
		margin: 0 0 20px;
		padding: 2px 0 3px 10px;

		border-radius: 0;
		border: none;
		border-bottom: 4px solid teal;

		background: none;

		font-size: 19px;

		cursor: pointer;
	}

	.options {
		position: absolute;

		top: 75px;
		right: 10%;
		bottom: 90px;
		left: 10%;

		overflow-x: hidden;
		overflow-y: auto;
	}

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

</style>

<script>
	import Zone from "./options/zone.svelte"
	import Matrix from "./options/matrix.svelte"
	import Option from "../sync/option.svelte"

	export let device
	export let current
	export let values
	values = {}

	let index = 0
	let modes = device.modes
	$: current = modes[index]

	$: directions = modes[index].flagList.includes("direction") ? modes[index].flagList.find(( flag ) => /^direction(..)$/.test(flag))?.slice(-2) : null

	$: values = index ? {} : {}
	$: {
		if (current && current.flagList.includes("modeSpecificColor") && !values.colors) {
			values.colors = current.colors
			values.colorMin = current.colorMin
			values.colorMax = current.colorMax
		}
		if (current && current.flagList.includes("perLedColor") && !values.colors) {
			values.colors = device.colors.map(( color ) =>
				`#${color.red.toString(16).padStart(2, "0")}${color.green.toString(16).padStart(2, "0")}${color.blue.toString(16).padStart(2, "0")}`
			)
		}
		if (current && current.flagList.includes("speed") && isNaN(+values.speed)) values.speed = current.speed
		if (current && current.flagList.includes("direction") && !values.direction) values.direction = current.direction.toString()
		if (current && current.flagList.includes("randomColor") && !values.random) values.random = false
	}
	$: {
		if (current.flagList.includes("direction")) values.direction = typeof values.direction == "string" ? +values.direction : values.direction
	}

	function multipleColors ( add ) {
		if (add) {
			values.colors = values.colors.concat(values.colors[values.colors.length] || "#000000")
		} else {
			values.colors = values.colors.slice(0, -1)
		}
	}
</script>


<select class="select" bind:value={index}>
	{#each modes as mode}
		<option value={mode.id}>{mode.name}</option>
	{/each}
</select>

{#if current}
	<div class="options">
		{#if current.flagList.includes("perLedColor") && values.colors}
			{#each device.zones as zone, zoneIndex}
				<div class="option">
					<div class="name">{zone.name}</div>
					{#if !zone.matrix}
						<div class="zone">
							<Zone bind:values={values.colors} {device} {zone}></Zone>
						</div>
					{:else}
						<div style="grid-template-columns: repeat({zone.matrix.width}, 1fr)" class="matrix">
							{#each zone.matrix.keys.flat() as key, i}
								<div>
									{key ? device.leds[key].name : "nope"}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
		{#if current.flagList.includes("modeSpecificColor")}
			<div>
				<button disabled={values.colorMin >= values.colors.length ? "disabled" : ""} on:click={() => multipleColors(false)}>-</button>
				{#each Array(values.colors.length) as _, i}
					<input bind:value={values.colors[i]} type="color">
				{/each}
				<button disabled={values.colorMax <= values.colors.length ? "disabled" : ""} on:click={() => multipleColors(true)}>+</button>
			</div>
		{/if}
		{#if current.flagList.includes("speed")}
			<div class="range">
				<Option bind:value={values.speed} option={{ type: "number", default: current.speed, min: current.speedMin, max: current.speedMax, step: 1 }}></Option>
			</div>
		{/if}
		{#if current.flagList.includes("direction")}
			{#if directions == "LR"}
				<Option bind:value={values.direction} option={{ type: "multiple", default: values.direction, names: [ "left", "right" ], values: [ 0, 1 ] }}></Option>
			{:else if directions == "UD"}
				<Option bind:value={values.direction} option={{ type: "multiple", default: values.direction, names: [ "up", "down" ], values: [ 2, 3 ] }}></Option>
			{:else if directions == "VH"}
				<Option bind:value={values.direction} option={{ type: "multiple", default: values.direction, names: [ "vertical", "horizontal" ], values: [ 4, 5 ] }}></Option>
			{/if}
		{/if}
		{#if current.flagList.includes("randomColor")}
			<Option bind:value={values.random} option={{ type: "checkbox", default: false }} ></Option>
		{/if}
	</div>
{/if}


<style>

	.select {
		position: absolute;
		left: 5%;
		width: 90%;
		margin: 0 20px 0 0;
		padding: 5px 0 3px 10px;
		height: 40px;

		box-sizing: border-box;

		border-radius: 0;
		border: none;
		border-bottom: 4px solid teal;

		background: none;

		font-size: 19px;

		cursor: pointer;
	}

	.options {
		position: absolute;
		top: 50px;
		width: 100%;
		bottom: 0;
	}

	.matrix {
		display: grid;
	}

</style>

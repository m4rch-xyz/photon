<script>
	export let option
	export let value = option.default

	let self
	let amount
	let values


	if (option.type == "multiple-colors") {
		values = value
		amount = option.amount || value.length
	}

	$:  {
		if (option.type == "number") value = value < option.min ? option.min : value > option.max ? option.max : value
	}

	function multipleColors ( add ) {
		if (add) {
			value = value.concat(values[amount] || "#000000")
			amount++
		} else {
			value = value.slice(0, -1)
			amount--
		}
	}

</script>


<!-- checkbox -->
{#if option.type == "checkbox"}

	<div class="{value ? "checkbox-checked" : ""} checkbox" on:click={() => value = !value} >
		<div class="label">toggle</div>
		<input type="checkbox" checked={value ? "checked" : ""} >
	</div>

<!-- color -->
{:else if option.type == "color"}

	<div  class="color" bind:this={self} on:click={() => self.querySelector("input").click()} >
		<div class="color-btn"><div class="label">click to change color</div></div>
		<input bind:value type="color">
		<div class="color-patch" style="background: {value}"></div>
	</div>

<!-- multiple-colors -->
{:else if option.type == "multiple-colors"}

	<div>
		<button disabled={option.min >= amount ? "disabled" : ""} on:click={() => multipleColors(false)}>-</button>
		{#each Array(amount) as _, i}
			<input bind:value={value[i]} type="color">
		{/each}
		<button disabled={option.max <= amount ? "disabled" : ""} on:click={() => multipleColors(true)}>+</button>
	</div>

<!-- multiple -->
{:else if option.type == "multiple"}

	<select bind:value>
		{option.values}
		{option.names?.[0]}
		{#each option.values as v, i}
			<option value={v} >{ option.names?.[i] || v }</option>
		{/each}
	</select>

<!-- number -->
{:else if option.type == "number"}

	<div>
		<input type="number" bind:value min={option.min || 0} max={option.max || 0} step={typeof option.step != "number" ? 1 : option.step} >
		<input type="range"  bind:value min={option.min || 0} max={option.max || 0} step={typeof option.step != "number" ? 1 : option.step} >
	</div>

{/if}


<style>

	/* - general - */
	.label {
		height: fit-content;

		font-size: 16px;
	}

	/* checkbox */
	.checkbox {
		height: 50px;
		padding: 0 0 0 2%;

		display: flex;
		align-items: center;

		box-sizing: border-box;

		background: #f2f2f2;

		transition: background-color 0.4s;

		cursor: pointer;
	}

	.checkbox-checked {
		background: #008080;
	}

	.checkbox input {
		display: none;
	}

	.color {
		font-size: 0;
	}

	.color > div {
		display: inline-block;

		height: 60px;
	}

	.color-btn {
		float: left;

		width: 80%;
		padding: 17px 0 20px;

		background: #f2f2f2;

		box-sizing: border-box;

		text-align: center;
	}

	.color input {
		display: none;
	}

	.color-patch {
		width: 20%;
	}

</style>



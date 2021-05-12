<script>
	import { cubicInOut } from "svelte/easing"
	import { fade } from "svelte/transition"

	export let name
	export let toggle
	export let focus

	let hover = false
</script>


<div on:click class="{focus} item" on:mouseenter={() => hover = true} on:mouseleave={() => hover = false} >
	<div class="main">{name.slice(0, 1)}</div>
	{#if hover && !toggle}
		<div transition:fade={{ easing: cubicInOut, duration: 400 }} class="hidden">{name}</div>
	{:else if toggle}
		<div class="show">{name}</div>
	{/if}
</div>


<style>

	@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap');

	.item {
		position: relative;

		height: 80px;
		width: inherit;

		background: none;

		cursor: pointer;

		user-select: none;
	}

	.selected {
		background: #00000033;
	}

	.main {
		height: 80px;
		width: 80px;
		padding: 5px 0;

		box-sizing: border-box;

		font-family: sans-serif;
		font-size: 60px;
		text-align: center;

		user-select: none;
	}

	.hidden, .show {
		position: absolute;

		top: 0;
		left: 80px;
		z-index: 20;

		display: flex;
		align-items: center;

		height: 80px;
		padding-left: 10px;

		box-sizing: border-box;

		font-size: 21px;
	}

	.hidden {
		width: 120px;

		background: linear-gradient(to right, #00808033, #00808005);
	}

	.show {
		width: 160px;
	}

	.selected .show {
		background: #00000033;
	}

</style>

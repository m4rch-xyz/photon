<script>
	import { tabs } from "./tabs.svelte"

	export let selected
</script>


<div class="tabs">
	{#each tabs as tab, i}
		<div on:click={() => selected = i} class="{selected == i ? "selected" : ""} tab">{tab.name}</div>
	{/each}
</div>


<style>

	.tabs {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}

	.tab {
		font-size: 21px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
		background: #00808033;
		transition: 0.4s background-color;
		cursor: pointer;
	}

	.tab:hover {
		background: #0080c044;
	}

	.selected {
		background: #00808077 !important;
		cursor: default;
	}

</style>

<script>
	import Navitem from "./navitem.svelte"
	import { tabs } from "./tabs.svelte"

	let toggle = false

	export let selected = tabs[1]
</script>


<div class="{toggle ? "show": ""} nav">

	<div class="items">
		{#each tabs as page, index}
			<Navitem focus={index == selected.index ? "selected" : ""} on:click={() => selected = tabs[index]} name={page.name} {toggle} />
		{/each}
	</div>

	<div class="nav-bottom">
		<Navitem on:click={() => window.location.reload()} focus=false name=reload {toggle} />
		<div class="divider"></div>
		<div class="bottom">
			<div on:click={() => toggle = !toggle} class="bottom-item">
				<div class="triangle"></div>
				<div class="bottom-text">{toggle ? "collapse" : "extend"}</div>
			</div>
		</div>
	</div>

	{#if toggle}
		<div class="layer"></div>
	{/if}

</div>


<style>

	.nav {
		position: fixed;

		top: 0;
		bottom: 0;
		left: 0;
		z-index: 10;

		width: 80px;

		background: #cce6e6;
	}

	.items {
		position: absolute;

		top: 20px;
		bottom: 75px;
	}

	.nav-bottom {
		position: absolute;

		bottom: 0;
		z-index: 20;

		width: 80px;

		box-sizing: border-box;

		cursor: pointer;
	}

	.show .nav-bottom {
		width: 240px;
	}

	.divider {
		height: 3px;
		width: 100%;
		margin-bottom: 20px;

		background: #cccccc;
	}

	.triangle {
		display: inline-block;

		padding: 8px;

		border: solid black;
		border-width: 0 8px 8px 0;

		transform: rotate(-45deg);

		transition: 0.4s transform;
	}

	.bottom-item {
		height: inherit;

		padding-left: 15px;
		margin: 0 8px 15px;
	}

	.layer {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 80px;

		display: block;

		width: 160px;

		background: #cce6e6;
	}

	.bottom-text {
		position: absolute;

		bottom: 0;
		left: 80px;
		z-index: 20;

		display: none;
		align-items: center;

		height: 65px;
		width: 160px;
		padding-left: 10px;

		font-size: 21px;

		user-select: none;
	}

	.show .bottom-text {
		display: flex;
	}

	.show .triangle {
		transform: rotate(135deg);
	}

</style>

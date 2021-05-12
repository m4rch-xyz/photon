<script>
	export let devices

	export let index = 0
	let page = Math.floor(index / 5)

	$: current = devices.slice(page * 5, page * 5 + 5)
	$: last = devices.slice((page - 1) * 5, (page - 1) * 5 + 5)
	$: next = devices.slice((page + 1) * 5, (page + 1) * 5 + 5)
</script>


<div class="header">
	<div on:click={() => last.length && (page -= 1)} class="{last.length ? "active" : "disabled"} last">&lt;</div>
	<div class="devices">
		{#each current as device, i}
			{#if device?.name}
				<div on:click={() => index = i + page * 5} class="{index == i + page * 5 ? "selected" : ""} device">{device.name}</div>
			{:else}
				<div class="na device">n/a</div>
			{/if}
		{/each}
	</div>
	<div on:click={() => next.length && (page += 1)} class="{next.length ? "active" : "disabled"} next">&gt;</div>
</div>


<style>

	.header {
		position: absolute;

		left: 10%;

		height: 60px;
		width: 80%;

		display: grid;
		gap: 0;
		grid-template-columns: repeat(10, 1fr);
	}

	.devices {
		position: relative;

		display: grid;
		grid-column: 2 / 10;
		grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

		height: inherit;

		background: #00800033;
	}

	.device {
		display: flex;
		align-items: center;
		justify-content: center;

		height: inherit;
		padding: 0 15px;

		box-sizing: border-box;

		overflow: hidden;

		font-size: 16px;
		text-align: center;

		user-select: none;

		cursor: pointer;

		transition: 0.4s background-color;
	}

	.na {
		background: none !important;

		cursor: default;
	}

	.last, .next {
		padding: 7px 0;

		background: #00808033;

		font-size: 35px;
		font-weight: 700;
		text-align: center;

		user-select: none;

		cursor: pointer;

		transition: 0.4s background-color;
	}

	.active:hover, .active:hover {
		background: #00808099;
	}

	.device:hover {
		background: #00800066;
	}

	.disabled {
		color: #aaaaaa;

		cursor: default;
	}

	.selected {
		background: #00808033 !important;
	}

</style>

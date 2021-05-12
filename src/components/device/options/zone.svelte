<script>
	export let zone
	export let device
	export let values

	let prev = device.zones.slice(0, zone.id).map(( zone ) => zone.ledsCount).reduce(( acc, curr) => acc + curr, 0)
</script>

{#each values.slice(prev, prev + zone.ledsCount) as led, i}
	<input type="color" bind:value={values[prev + i]}>
{/each}

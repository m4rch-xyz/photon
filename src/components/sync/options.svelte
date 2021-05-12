<script>
	import Option from "./option.svelte"

	export let options
	export let values
	values = {}
</script>


{#each Object.entries(options) as [ name, option ]}
	<div class="option">
		<div class="name">{name}</div>
		<div class="select"><Option bind:value={values[name]} {option} ></Option></div>
	</div>
{/each}


<style>

	.option {
		padding: 5px;
		margin-bottom: 20px;
	}

	.name {
		padding: 5px 0;
		text-align: center;
		border-bottom: 3px solid #000000;
		font-weight: 600;
		font-size: 17px;
	}

	.select {
		margin: 20px;
	}

</style>

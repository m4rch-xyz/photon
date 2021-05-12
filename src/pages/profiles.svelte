<script>
	import Profile from "../components/profiles/profile.svelte"

	export let global
	// export let settings
	export let profiles
	profiles = global.profiles.profiles || profiles

	function add () {
		let name = "new"
		let num = 0

		while (profiles.includes(name)) {
			num++

			name = `new-${num}`
		}

		fetch("http://localhost:3000/profiles/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name })
		})

		profiles = profiles.concat(name)
	}

	$: profiles = profiles.filter(( profile ) => typeof profile == "string")
	$: global.profiles.profiles = profiles

	$: profiles = profiles.sort()

</script>


<div class="main">
	{#each profiles as _, i}
		<Profile on:message bind:global bind:name={profiles[i]} ></Profile>
	{/each}
	<div class="addline">
		<div on:click={add} class="add">+</div>
	</div>
</div>


<style>

	.addline {
		display: flex;
		justify-content: center;
		height: 40px;
		width: 100%;
	}

	.add {
		width: 40px;
		font-size: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 25px;
		transition: 0.4s background-color;
		background: #00808033;
		user-select: none;
		cursor: pointer;
	}

	.add:hover {
		background: #00808066;
	}

</style>

<script>
	import Nav from "./components/nav.svelte"
	import Message from "./components/message.svelte"
	import { shortcut } from "./components/shortcut.js"

	shortcut([ "control", "r" ], () => window.location.reload())

	let nav
	let global = {
		device: {},
		sync: {},
		settings: {},
		profiles: {}
	}

	export let checkState
	export let getAll

	let state = "loading"
	let message = null
	let messageId

	function handleMessage ({ detail }) {
		message = detail

		let curr = Math.random()
		messageId = curr

		setTimeout(() => {
			if (curr == messageId) message = null
		}, 3000)
	}

	(function getState () {
		checkState().then(async ( res ) => {
			if (res.ok) {
				let tState = await res.json()
				if (tState.connected) {
					return state = "online"
				} else {
					state = "offline"
				}
			} else {
				state = "error"
			}
			setTimeout(getState, 5000)
		}).catch(() => {
			state = "error"
			setTimeout(getState, 5000)
		})
	})()

</script>


<svelte:head>
	<title>photon</title>
</svelte:head>

<Nav bind:selected={nav} ></Nav>

<div class="content">
	{#if state == "online"}
		{#if nav}
			{#await getAll() then { devices, modes, profiles, settings, zones }}
				{#if nav.name == "sync"}
					<svelte:component on:message={handleMessage} bind:global {zones} {devices} {modes} this={nav.component} ></svelte:component>
				{:else if nav.name == "device"}
					<svelte:component bind:global {zones} {devices} this={nav.component} ></svelte:component>
				{:else if nav.name == "settings"}
					<svelte:component bind:global {settings} this={nav.component} ></svelte:component>
				{:else if nav.name == "profiles"}
					<svelte:component on:message={handleMessage} bind:global {profiles} {settings} this={nav.component} ></svelte:component>
				{:else}
					<svelte:component this={nav.component} ></svelte:component>
				{/if}
			{/await}
		{/if}
	{:else if state == "offline"}
		<div class="status">OpenRGB not connected</div>
	{:else if state == "error"}
		<div class="status">Service not connected</div>
	{/if}
</div>


{#if message}
	<Message bind:message ></Message>
{/if}


<style>

	@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap");

	:global(*) {
		margin: 0;
		font-family: "Roboto Mono";
	}

	:global(*):focus {
		outline: none;
	}

	:global(body) {
		background: #ffffff;
	}

	.content {
		position: absolute;

		top: 0;
		right: 0;
		bottom: 0;
		left: 80px;

		padding: 20px;
	}

	.status {
		text-align: center;
		margin-top: 1rem;
		font-weight: 600;
		font-size: 3rem;

	}

</style>

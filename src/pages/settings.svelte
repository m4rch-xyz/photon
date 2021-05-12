<script>
	import Nav from "../components/settings/nav.svelte"
	import { tabs } from "../components/settings/tabs.svelte"

	export let settings
	export let global

	let selected = global.settings.selected || 0

	$: global.settings.selected = selected
</script>

<Nav bind:selected ></Nav>

{#if selected}
	<svelte:component bind:global this={tabs[selected].component} options={settings[selected.name] || {}} ></svelte:component>
{/if}

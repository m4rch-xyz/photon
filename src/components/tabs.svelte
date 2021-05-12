<script context="module">
	import Device from "../pages/device.svelte"
	import Sync from "../pages/sync.svelte"
	import Settings from "../pages/settings.svelte"
	import Profiles from "../pages/profiles.svelte"

	export const tabs = [
		{ index: 0, name: "device", component: Device },
		{ index: 1, name: "sync", component: Sync },
		{ index: 2, name: "settings", component: Settings },
		{ index: 3, name: "profiles", component: Profiles }
	]
</script>

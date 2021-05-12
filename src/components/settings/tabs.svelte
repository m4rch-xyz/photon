<script context="module">
	import General from "./tabs/general.svelte"
	import Startup from "./tabs/startup.svelte"
	import Devices from "./tabs/devices.svelte"
	import Service from "./tabs/service.svelte"

	export const tabs = [
		{ index: 0, name: "general", component: General },
		{ index: 1, name: "startup", component: Startup },
		{ index: 2, name: "devices", component: Devices },
		{ index: 3, name: "service", component: Service }
	]
</script>

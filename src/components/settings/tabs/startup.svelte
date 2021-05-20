<script>
	export let options

	let tab = options.tab || "sync"

	function setTab () {
		fetch(`http://localhost:1872/settings/startup/`, {
			method: "POST",
			headers: {
      			"Content-Type": "application/json"
    		},
			body: JSON.stringify({
				"tab": tab
			})
		})
	}
</script>


<div>
	<select bind:value={tab}>
		<option value="sync">sync</option>
		<option value="devices">devices</option>
	</select>
	<button on:click={setTab}>save</button>
</div>


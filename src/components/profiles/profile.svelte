<script>
	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	export let name
	export let global

	let rename = name
	let edit = false

	async function saveEdit () {
		if (rename == name) {
			edit = false
			return
		}
		if (!rename.length) {
			dispatch("message", {
				type: "error",
				text: "new name cannot be empty."
			})
			return
		}

		edit = false
		let res = await fetch("http://localhost:1872/profiles/rename/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				oldName: name,
				newName: rename
			})
		})
		res = await res.json()

		if (res.ok) {
			name = rename
		} else {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		}
	}

	function discardEdit () {
		edit = false
		rename = name
	}

	async function del () {
		let res = await fetch("http://localhost:1872/profiles/delete/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name })
		})
		res = await res.json()

		if (res.ok) {
			name = null
		} else {
			dispatch("message", {
				type: "error",
				text: res.message
			})
		}
	}

	function overwrite () {
		fetch("http://localhost:1872/profiles/save/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name })
		})
	}

	async function load () {
		await fetch("http://localhost:1872/profiles/load/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name })
		})

		let zones = await fetch("http://localhost:1872/sync/zones", { method: "GET" })
		global.sync.zones = await zones.json()

		dispatch("message", {
			type: "info",
			text: `loaded profile "${name}"`
		})
	}

</script>


<div class="profile">
	{#if !edit}
		<div on:click={load} class="name">{name}</div>
	{:else}
		<div class="name">
			<input bind:value={rename}>
		</div>
	{/if}
	{#if !edit}
		<div on:click={() => edit = true} class="edit">edit</div>
		<div on:click={overwrite} class="overwrite">overwrite</div>
		<div on:click={del} class="delete">delete</div>
	{:else}
		<div on:click={saveEdit} class="save-edit">save edit</div>
		<div on:click={discardEdit} class="discard-edit">discard edit</div>
	{/if}
</div>


<style>

	.profile {
		float: left;
		width: 100%;
		height: 60px;
		margin-bottom: 20px;
	}

	.name, .edit, .delete, .overwrite, .save-edit, .discard-edit {
		float: left;
		height: inherit;
		display: flex;
		align-items: center;
	}

	.name {
		float: left;
		width: 70%;
		box-sizing: border-box;
		padding-left: 20px;
		background-color: #00808030;
		font-size: 18px;
		font-weight: 800;
		cursor: pointer;
	}

	.edit, .delete, .overwrite {
		width: 10%;
		justify-content: center;
		transition: 0.4s background-color;
		cursor: pointer;
		user-select: none;
	}

	.edit {
		background: #00800033;
	}

	.edit:hover {
		background-color: #00800066;
	}

	.delete {
		background: #ff000033;
	}

	.delete:hover {
		background: #ff000066;
	}

	.overwrite {
		background-color: #0000ff33;
	}

	.overwrite:hover {
		background-color: #0000ff66;
	}

	.save-edit, .discard-edit {
		width: 15%;
		justify-content: center;
		transition: 0.4s background-color;
		cursor: pointer;
		user-select: none;
	}

	.save-edit {
		background-color: #0000ff33;
	}

	.save-edit:hover {
		background-color: #0000ff66;
	}

	.discard-edit {
		background-color: #ff000033;
	}

	.discard-edit:hover {
		background-color: #ff000066;
	}

</style>

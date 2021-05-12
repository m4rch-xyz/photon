let shortcuts = []

export function shortcut ( keys, callback ) {
	shortcuts.push({
		keys: Object.fromEntries(keys.map(( key ) => [ key.toLowerCase(), false ])),
		callback
	})
}

document.addEventListener("keydown", ({ key }) => {
	shortcuts = shortcuts.map(({ keys, callback }) => {
		if (Object.keys(keys).includes(key.toLowerCase())) {
			keys[key.toLowerCase()] = true

			if (!Object.values(keys).includes(false)) {
				callback()
			}
		}

		return {
			keys,
			callback
		}
	})
})

document.addEventListener("keyup", ({ key }) => {
	shortcuts = shortcuts.map(({ keys, callback }) => {
		if (Object.keys(keys).includes(key.toLowerCase())) {
			keys[key.toLowerCase()] = false
		}
	})
})

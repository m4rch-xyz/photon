const { app, BrowserWindow, globalShortcut } = require("electron")
const path = require("path")

if (require("electron-squirrel-startup")) {
	app.quit()
}

function createWindow () {
	const mainWindow = new BrowserWindow({
		height: 900,
		width: 1600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	mainWindow.removeMenu()
	mainWindow.loadFile(path.join(__dirname, "index.html"))

	if (process.argv.includes("--dev")) mainWindow.webContents.openDevTools()

	app.on("browser-window-focus", () => {
		globalShortcut.registerAll([ "CmdOrCtrl+Shift+C", "CmdOrCtrl+Shift+I" ], () => mainWindow.webContents.openDevTools())
	})

	app.on("browser-window-blur", () => {
		globalShortcut.unregisterAll()
	})
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

if (process.argv.includes("--dev")) {
	require("electron-reload")(__dirname, {
		electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
		awaitWriteFinish: true
	})
}

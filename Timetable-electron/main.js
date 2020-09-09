const electron = require('electron');//includes electron dependency
const { app, BrowserWindow, dialog, screen } = electron//dialogue is remote

const path = require('path')//path to necessary files
const url = require('url')//web dependency
const windowStateKeeper = require('electron-window-state')//preserves the window state
const fs = require('fs')
const Store = require('electron-store')
const store = new Store;

let mainWindow = null;//defines the window as an abject

let config = {
	frame: false,
}

app.on('ready', function () {
	if (store.get('default')) {//emsists
		config = JSON.parse(store.get('default'))
	} else {//doesnt emsist
		store.set('default', JSON.stringify(config))
	}
	create_main_window()
})

app.on('window-all-closed', function () {
	if (process.platform != 'darwin') {
		app.quit()
	}
})

function create_main_window() {
	mainWindow = null
	const { screenwidth, screenheight } = screen.getPrimaryDisplay().workAreaSize //gets screen size and sets it to height and width
	let mainWindowState = windowStateKeeper({ defaultWidth: screenwidth, defaultHeight: screenheight })

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#000000',
		title: 'Timetable',
		icon: path.join(__dirname, '/assets/icons/icon.png'),//some linux window managers cant process due to bug
		frame: config.frame,
		minWidth: 400,
		show: true,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			nodeIntegrationInWorker: true,
			worldSafeExecuteJavaScript: true
		},
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, '/www/index.html'),
		protocol: 'file:',
		slashes: true,
		icon: path.join(__dirname, '/assets/icons/icon.png'),
	}))

	mainWindowState.manage(mainWindow)
}

async function write_file(filepath, buffer_data) {
	console.log('Wrote file', filepath, buffer_data)
	fs.writeFile(filepath, buffer_data, 'utf8', (err) => {//write config to file as json
		if (err) {
			alert("An error occurred creating the file" + err.message)
		} else {
			console.log("The file has been successfully saved to: ", filepath);
		}
	})
}

function setframee(frame) {
	config.frame = frame
	store.set('default', JSON.stringify(config))
	app.relaunch()
	app.exit()
}

exports.setframe = (frame) => setframee(frame);

exports.framestate = () => { return config.frame }

exports.write_object_json_out = (filepath, buffer_data) => { write_file(filepath, buffer_data) }

exports.closeapp = () => { app.quit() }

exports.minmize_main_window = () => { mainWindow.minimize() }

exports.maximize_main_window = () => {
	if (mainWindow.isMaximized()) {
		//minimize
		mainWindow.restore()
		return false;
	} else {
		//maximize
		mainWindow.maximize()
		return true;
	}
}

exports.togglealways_on_top = () => {
	if (mainWindow.isAlwaysOnTop()) {
		mainWindow.setAlwaysOnTop(false)
		return false;
	} else {
		mainWindow.setAlwaysOnTop(true)
		return true;
	}
}

exports.checkontop = () => { return mainWindow.isAlwaysOnTop() }

exports.setontop = () => { mainWindow.setAlwaysOnTop(true) }

exports.setnotontop = () => { mainWindow.setAlwaysOnTop(false) }

const electron = require('electron');//includes electron dependency
const { app, BrowserWindow, dialog, } = electron//dialogue is remote

const path = require('path');//path to necessary files
const url = require('url');//web dependency
const windowStateKeeper = require('electron-window-state');//preserves the window state

var mainWindow;//defines the window as an abject

app.on('ready', function () {
	console.warn('app ready')
	const { screenwidth, screenheight } = electron.screen.getPrimaryDisplay().workAreaSize //gets screen size and sets it to height and width
	let mainWindowState = windowStateKeeper({ defaultWidth: screenwidth, defaultHeight: screenheight });
	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#ffffff',
		title:'Timetable',
		frame: true,
		minWidth:400,
	});
	mainWindow.loadURL(url.format({ pathname: path.join(__dirname, '/www/index.html'), protocol: 'file:', slashes: true, icon: path.join(__dirname, 'assets/icons/icon.webp'), }));

	//mainWindow.loadURL('https://github.com');
	//mainWindow.loadURL(url.format({pathname: path.join(__dirname, '/Change log//index.html'),protocol: 'file:',slashes: true}));
	mainWindowState.manage(mainWindow);
});


app.on('window-all-closed', function () {
	app.quit();
});//closes all processes
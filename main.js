const path = require('path');
const url = require('url');
const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
const { autoUpdater } = require("electron-updater");
const appVersion = require('./package.json').version;
// const feedUrl = `http://10.200.188.232/client/update/${process.platform}/${app.getVersion()}`;
let webContents;

let createWindow = () => {
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            devTools: false
        },
        resizable: false,
        frame: false,
        title: 'DMES客户端',
        show: false
    });
    ipcMain.on('min', e => win.minimize());
    ipcMain.on('close', e => app.quit());
    win.once('ready-to-show', () => {
        win.show()
    })
    webContents = win.webContents;

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, './client/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    webContents.openDevTools();

};
app.on('ready', () => {
    createWindow();
    updateHandle();
    // autoUpdater.checkForUpdates();
    // setTimeout(checkForUpdates, 1000);
});
// let sendUpdateMessage = (message, data) => {
//     webContents.send('message', {
//         message,
//         data
//     });
// };
function updateHandle() {
    let version=app.getVersion()
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新。。。'+version,
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '当前为最新版本！'+version,
        
    };
    const os = require('os');
    autoUpdater.setFeedURL('http://10.128.20.20/client/update');
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error);
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });
    //更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        ipcMain.on('updateNow', (e, arg) => {
            //some code here to handle event
            autoUpdater.quitAndInstall();
        })
        webContents.send('isUpdateNow')
    });

    //
    ipcMain.on("checkForUpdate", () => {
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
    // autoUpdater.checkForUpdates();
}
function sendUpdateMessage(text) {
    webContents.send('message', text)
}



















// let sendUpdateMessage = (message, data) => {
//     webContents.send('message', {
//         message,
//         data
//     });
// };

// let checkForUpdates = () => {
//     autoUpdater.setFeedURL(feedUrl);

//     autoUpdater.on('error', function(message) {
//         sendUpdateMessage('error', message)
//     });
//     autoUpdater.on('checking-for-update', function(message) {
//         sendUpdateMessage('checking-for-update', message)
//     });
//     autoUpdater.on('update-available', function(message) {
//         sendUpdateMessage('update-available', message)
//     });
//     autoUpdater.on('update-not-available', function(message) {
//         sendUpdateMessage('update-not-available', message)
//     });

//     // 更新下载进度事件
//     autoUpdater.on('download-progress', function(progressObj) {
//         sendUpdateMessage('downloadProgress', progressObj)
//     })
//     autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
//         ipcMain.on('updateNow', (e, arg) => {
//             //some code here to handle event
//             autoUpdater.quitAndInstall();
//         })
//         sendUpdateMessage('isUpdateNow');
//     });

//     //执行自动更新检查
//     autoUpdater.checkForUpdates();
// };

// app.on('closed', () => {
//     console.log(1111111111);
//     app.quit();
// });
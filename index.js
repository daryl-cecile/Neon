/**
 * Created by darylcecile on 14/02/2017.
 */

    const electron = require('electron');
    const url = require('url');
    const util = require('util');
    const fs = require('fs');
    const path = require('path');
    const ipc = electron.ipcMain;

    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const valueRegister = {};

    let forceClose = false;

    let win;
    let startingWindow;

    app.on('ready',function(){
        win = new BrowserWindow({
            width: 800,
            height: 600,
            titleBarStyle: 'hidden-inset',
            vibrancy: 'dark',
            fullscreenable:false,
            title:'Neon Studio',
            icon:path.join(__dirname,'assets/logo/primary.png'),
            show:false
        });
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'main.html'),
            protocol:'file:',
            slashes: true
        }));
        win.once('ready-to-show', () => {
            startingWindow = new BrowserWindow({
                width: 628,
                height: 475,
                vibrancy: 'dark',
                title:'NS Welcome',
                resizable:false,
                fullscreenable:false,
                titleBarStyle: 'hidden-inset'
            });
            startingWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'NSSupport', 'firstPage.html'),
                protocol:'file:',
                slashes: true
            }));

            ipc.on('setValue', (event, arg) => {
                // data = { name:variableName, value:variableValue }
                valueRegister[arg.name] = arg.value;
                if (valueRegister['PRC'] == 'done' && arg.name == 'CMD' && arg.value == 'open') {
                    win.show();
                    win.setSheetOffset(38);
                    win.webContents.send('startSetup','');
                }
            });
        });
        global.myWindow = win;
    });
    app.on('window-all-closed', function() {
        app.quit();
    });
    ipc.on('getValue', (event, arg) => {
        console.log(arg);  // prints "ping"
        //data = variableName;
        event.returnValue = valueRegister[arg];
    });



    global.reload = app.relaunch;
    global.platform = process.platform;
    global.editorPath = __dirname;
    global.documentPath = app.getPath('documents');
    global.workspacePath = path.join(app.getPath('documents'),'NeonStudioProjects');

    global.closeAll = function(){
        win.close();
    };

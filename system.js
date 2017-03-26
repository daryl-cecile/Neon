/**
 * Created by darylcecile on 07/03/2017.
 */

const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
const jquery = $ = require('jquery');
const nativejsx = require('nativejsx');


const system = {};

system.openSearch = function(){
    let electron = require('electron');
    let BrowserWindow = electron.remote.BrowserWindow;
    let url = require('url');
    let w = new BrowserWindow({
        width: 600,
        height: 80,
        frame:false,
        vibrancy: 'dark',
        icon:path.join(__dirname,'assets/logo/primary.icns')
    });
    w.once('ready-to-show', () => {
        w.show();
    });
    w.loadURL(url.format({
        pathname: path.join(__dirname, 'quickTool.html'),
        protocol:'file:',
        slashes: true
    }));
    w.on('blur', () => {
        w.close();
    });
};

system.showDevTool = function(){
    $('#guestDesigner')[0].openDevTools();
};

system.setupDesignerCommunication = function(){
    let wbDesigner = $('#guestDesigner')[0];
    wbDesigner.addEventListener('dom-ready', () => {
        let embedCode = function(){
            let v = document.createElement('script');
            v.src= 'file://' + path.join( remote.getGlobal('editorPath') , path.join( 'designerCode', 'designerHost.js' ) );
            document.head.appendChild(v);
            return 'hello'
        };
        wbDesigner.executeJavaScript('const path = require("path"); const remote = require("electron").remote; const {ipcRenderer} = require("electron")',false,function(){
            console.log('Loaded constants');
        });
        wbDesigner.executeJavaScript('('+embedCode.toString()+')()', false, function(){
            console.log('embedded designer host support library');
            setTimeout(function(){
                designerCom.sendScriptToRequest('node_modules/jquery','$');
                designerCom.sendScriptToRequest('node_modules/unsplash-source-js','Unsplash');
                designerCom.sendScriptToExecute('cssSelectorGen.js');
                designerCom.sendScriptToExecute('menuGenAuto.js');
                designerCom.sendScriptToRequest('node_modules/nativejsx','nativejsx');
                wbDesigner.executeJavaScript('designerHost.importSupportStyle("'+ 'file://' + path.join( remote.getGlobal('editorPath') , path.join( 'designerCode', 'desginerHostSupport.css' ) )+'")');
                designerCom.sayReady();
                designerCom.sendScriptToLoad('https://cdnjs.cloudflare.com/ajax/libs/framework7/1.4.2/js/framework7.min.js');
                designerCom.sendStyleToLoad('https://cdnjs.cloudflare.com/ajax/libs/framework7/1.4.2/css/framework7.ios.min.css');
                designerCom.sendStyleToLoad('https://cdnjs.cloudflare.com/ajax/libs/framework7/1.4.2/css/framework7.ios.colors.min.css');
            },2000)
        });
    });

    wbDesigner.addEventListener('ipc-message', (event) => {
        if (event.channel == 'focusItem'){
            designerCom.focusedItem = event.args[0];
            $('section[right]>*:not(p):not(hr):not(atomic-textbox)').remove();
        }
        else if (event.channel == 'noFocusItem'){
            designerCom.focusedItem = undefined;
            $('section[right]>*:not(p):not(hr):not(atomic-textbox)').remove();
        }
        else if (event.channel == 'getRecord'){
            for (let s in event.args[0].styles){
                dset.applyStyle(s,event.args[0].styles[s]);
            }
        }
        else if (event.channel == 'correctFocusItem'){
            console.warn('CORRECTLY FOCUSING ON ','#'+event.args[0]);
            designerCom.focusedItem = '#'+event.args[0];
        }
        else{
            if (designerCom.waitingResponses[event.channel] != undefined) {
                designerCom.waitingResponses[event.channel]( event.args );
                designerCom.waitingResponses[event.channel] = undefined;
            }
        }
        console.log(event);
    });

    window.sendMessage = function(msg,channelName="system"){
        wbDesigner.send(channelName,msg);
    };
};

system.toggleDevice = function(){
    document.getElementById('guestDesigner').classList.toggle("max");
};

window.designerCom = {};
window.designerCom.focusedItem = undefined;
window.designerCom.waitingResponses = {};
window.designerCom.setStyle = function(elemPath,style){
    let message = {
        'id':atomic.componentGUID.GetNew(),
        'action':'SET_STYLE',
        'data':{
            'target':elemPath,
            'value':'"'+style+'"'
        }
    };

    sendMessage(JSON.stringify(message),'designer');
};

window.designerCom.sendScriptToExecute = function(m_src,m_isRaw=false){
    let message = {
        'id':atomic.componentGUID.GetNew(),
        'action':'EXEC_THIS',
        'data':'active'
    };

    if (m_isRaw == true){
        message.data = m_src
    }
    else{
        m_src = path.join(__dirname, m_src);
        message.data = fs.readFileSync(m_src,'utf8').replace('#!/usr/bin/env node','');
    }
    sendMessage(JSON.stringify(message),'designer');
};

window.designerCom.sendScriptToLoad = function(src){
    let embedCode = function(src){
        let v = document.createElement('script');
        v.src= src;
        document.head.appendChild(v);
        return 'hello'
    };
    $('#guestDesigner')[0].executeJavaScript('('+embedCode.toString()+')("'+src+'")', false, function(){

    });
};

window.designerCom.sendStyleToLoad = function(src){
    let embedCode = function(src){
        let v = document.createElement('link');
        v.rel = "stylesheet";
        v.href= src;
        document.head.appendChild(v);
        return 'hello'
    };
    $('#guestDesigner')[0].executeJavaScript('('+embedCode.toString()+')("'+src+'")', false, function(){

    });
};

window.designerCom.sendScriptToRequest = function(m_src,name){
    let message = {
        'id':atomic.componentGUID.GetNew(),
        'action':'REQ_THIS',
        'data':{}
    };
    message.data.module = path.join(__dirname,m_src);
    message.data.name = name;
    sendMessage(JSON.stringify(message),'designer');
};

window.designerCom.sayReady = function(){
    let message = {
        'id':atomic.componentGUID.GetNew(),
        'action':'CHANGE',
        'data':'active'
    };

    sendMessage(JSON.stringify(message),'designer');
};

window.designerCom.undoChanges = function(){
    let message = {
        'id':atomic.componentGUID.GetNew(),
        'action':'HISTORY',
        'data':'undo'
    };

    sendMessage(JSON.stringify(message),'designer');
};

window.designerCom.requestStyles = function(cb){
    let message = {
        'id':atomic.componentGUID.GetNew(),
        'action':'REQUEST_STYLES',
        'data':''
    };
    sendMessage(JSON.stringify(message),'designer');
    designerCom.waitingResponses[message.id] = cb;
};

window.NeonCore = {};
NeonCore.getVersionInfo = function(){
    return {
        versionName:function(){
            return "red"
        },
        versionNumber:function(){
            return "1.0.0.1"
        },
        versionStage:function(){
            return "beta"
        },
        serviceCode:function(){
            return "AER"
        }
    }
};


NeonCore.try = function (fn,me,complete=function(successful){}) {
    try{
        if (me) {
            fn.call(me);
        } else {
            fn();
        }
        complete(true);
    }
    catch (c){
        complete(false,c);
        console.warn(c);
    }
};
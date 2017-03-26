

window.Cordova = require('node-cordova');
window.app_build = undefined;

const app_manifest = {

};

const veil = {
    show:function(){
        $('[blocker]').animate({opacity:"0.7"},1000).css({pointerEvents:"auto"});
        $('nav[left] i').css({pointerEvents:"none"});
        $('.loader').remove();
        $('<div class="loader"></div>').appendTo('body');
    },
    hide:function(){
        $('[blocker]').animate({opacity:"0"},1000).css({pointerEvents:"none"});
        $('nav[left] i').css({pointerEvents:"auto"});
        $('.loader').remove();
    }
}

function beginSetup(){
    updateBuildStatus('settingUp');
    const electron = require('electron');
    const ipcRenderer = electron.ipcRenderer;
    const app = electron.remote.app;
    
    
    ipcRenderer.on('startSetup', setup);

    function updateBuildTip(text){
        $('#buildStat').parent().attr('tip',text);
    }

    function setup(){
        app_manifest['name'] = ipcRenderer.sendSync('getValue','projectName');
        var fs = require('fs');
        try{
            fs.mkdirSync(path.join( app.getPath('documents') , 'Neon Studio Projects' ));
        }
        catch(c){}
        try{
            fs.mkdirSync(path.join( app.getPath('documents') , 'Neon Studio Projects' , app_manifest.name));
        }
        catch(c){}
        updateBuildTip('Creating Project Files...');
        app_build = new Cordova( path.join( app.getPath('documents') , 'Neon Studio Projects', app_manifest.name) );
        console.error(app_build.setCurrentWorkspace(__dirname));
        updateBuildTip('Setting up...');
        app_build.create('com.neon.'+app_manifest.name,app_manifest.name,function(err, stdout, stderr){
            console.log(0,err,stdout,stderr);
            updateBuildTip('Adding iOS Files...');
            app_build.addPlatform('ios', function(err, stdout, stderr){
                console.log(1,err,stdout,stderr);
                updateBuildTip('Prebuilding app folder...');
                app_build.build('ios',function(err, stdout, stderr){
                    console.log(2,err,stdout,stderr);
                    updateBuildStatus('done');
                    updateBuildTip('Ready!');
                    new Notification('Neon Studio', {
                        body: 'Project workspace created for '+app_manifest.name,
                        icon: '../assets/logo/primary.png',
                        badge: '../assets/logo/primary.png'
                    });
                    veil.hide();
                });
            });
        });
    }
}

beginSetup();
veil.show();
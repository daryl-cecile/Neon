/**
 * Created by darylcecile on 26/01/2017.
 */


window.Neon.Router = {
    start:function(root='body'){
        $('body').on('click','a, [live]',function(ev){
            let link = $(this).attr('href');
            if (link.indexOf('Neon://') == 0){
                ev.preventDefault();
                let cmd = link.split('//')[1].split('/')[0];
                let param = link.split('//')[1].split('/')[1];

                if (Neon.Router.Commands.active[cmd] == undefined){
                    Neon.Console.log('NRouter Error','This command has not been set up! ('+cmd+')',true);
                }
                else{
                    Neon.Router.Commands.active[cmd](param);
                }
            }
        });
    },
    Commands:{
        active:{},
        set:function(cmd,fnc){
            Neon.Router.Commands.active[cmd] = fnc;
        }
    },
    route:function(path){
        let link = path;
        if (link.indexOf('Neon://') == 0){
            let cmd = link.split('//')[1].split('/')[0];
            let param = link.split('//')[1].split('/')[1];

            if (Neon.Router.Commands.active[cmd] == undefined){
                Neon.Console.log('NRouter Error','This command has not been set up! ('+cmd+')',true);
            }
            else{
                Neon.Router.Commands.active[cmd](param);
            }
        }
    },
    handle:{
        noClick:function(){
            Neon.Console.log('No Click','Handled a link with no events');
        }
    }
};
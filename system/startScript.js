/**
 * Created by darylcecile on 24/01/2017.
 */

const remote = require('electron').remote;
const fs = require('fs');
const path = require('path');

Neon.modules.import('jquery.js','dependencies/js/');
Neon.modules.import('core').test();
Neon.modules.import('system').test();
Neon.modules.import('process').test();
Neon.modules.import('NRouting').test('Router');
Neon.modules.import('pageController').test('pages');
Neon.modules.import('NProject').test('project');
Neon.modules.import('neonComponents').test('components');

Neon.modules.whenReady(function(){

    Neon.system.runAll(); // Launch all system tasks

    Neon.Console.note('Start Script','System tasks launched!');

    Neon.pipes.getFrom('NEON','PROCESS',function(message){
        Neon.Console.note('Start Script > Pipe > PROCESS: ',message);
    });

    Neon.pipes.getFrom('NEON','SETUP',function(message){
        Neon.Console.note('Start Script > Pipe > SETUP: ',message);
    });

    Neon.Router.start();

    Neon.Console.note('Start Script','Router system started!');

    Neon.Router.Commands.set('goto',function(p){
        if (p.indexOf('#') != -1) {
            Neon.pages.goto(p.split('#')[0], Boolean( p.split('#')[1] ) );
        }
        else{
            Neon.pages.goto(p);
        }
        Neon.Console.note('Changing Context',' NAV: Neon://goto/'+p);
    });

    Neon.pipes.push(new NeonMessagePackage('Start Script Execution Complete', 'SETUP'));
    Neon.pipes.push(new NeonMessagePackage('Process queues are ready', 'PROCESS'));

    Neon.Router.route('Neon://goto/dash');

    Neon.components.start();
});
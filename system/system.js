/**
 * Created by darylcecile on 24/01/2017.
 */


window.Neon.system = {
    tasks:[],
    running:[],
    runAll:function(){
        for(let i = 0; i <= Neon.system.tasks.length - 1 ; i ++){
            let taskInterval = setInterval(function(){
                let ind = Neon.system.tasks.indexOf( Neon.system.tasks[i] );
                Neon.system.tasks[i](function(){ clearInterval(taskInterval); Neon.system.running.splice( Neon.system.running.indexOf(taskInterval), 1 ) ; Neon.system.tasks.splice( ind , 1 ); });
            },250);
            Neon.system.running.push(taskInterval);
        }
    },
    run:function(t){
        Neon.system.tasks.push(t);
        let taskInterval = setInterval(function(){
            let ind = Neon.system.tasks.indexOf( t );
            t(function(){ clearInterval(taskInterval); Neon.system.running.splice( Neon.system.running.indexOf(taskInterval), 1 ) ; Neon.system.tasks.splice( ind , 1 ); });
        },250);
        Neon.system.running.push(taskInterval);
    },
    get taskCount(){
        return Neon.system.running.length;
    },
    wait:function(ms){
        let start = new Date().getTime();
        let end = start;
        while(end < start + ms) {
            end = new Date().getTime();
        }
    }
};

window.Neon.system.tasks.push(function(kill){
    if ( Neon.process.queue.length == 0 ) return;
    let task =  Neon.process.stack[ Neon.process.queue[ Neon.process.queue.length - 1 ] ];
    if (task.state == 'WORKING') {
        //do nothing
        if (task.lifetimeRounds != -1){
            if (task.lifetimeRounds > 0){
                task.lifetimeRounds -- ;
            }
            else{
                task.kill();
            }
        }
        else{

            let retVal;
            try{
                task.values.push ( task.work() );
                task.updateValues();
                task.callback(true,task);
            }
            catch(x){
                task.values.push ( task.work() );
                task.updateValues();
                task.callback(false,task);
            }

        }
    }
    else if (task.state == 'WAITING'){
        //waiting
        console.log('running waiting task '+task.tid);
        task.state = 'WORKING';

    }
});

window.Neon.system.tasks.push(function(kill){
   //To monitor process counter and tasks
    let NeonProcessCount = Neon.process.poll().stack.count;

    if (NeonProcessCount > 32){
        // Limits Neon Process Result count to 1024
        console.error('Process Queue is Stalling!');
        Neon.pipes.push(new NeonMessagePackage('Queue is Stalling with more than 32 processes!' , 'PROCESS'));
    }

});

window.Neon.access = {
    fs:require('fs'),
    get location(){
        return require('path').resolve('../IDE');
    }
};
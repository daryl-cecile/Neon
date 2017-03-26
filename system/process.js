/**
 * Created by darylcecile on 24/01/2017.
 */


// Processes class

class process{
    constructor(lifetimeRounds=-1,iteration=1){
        this.tid = Neon.Generator.random(); //define task ID
        this.lifetimeRounds=lifetimeRounds; // defines how long to wait in line before auto kill
        this.callback = function(){};
        this.state = 'WAITING'; // can be either; WAITING, WORKING, or COMPLETE
        this.work = function(){};
        this.iteration=iteration;
        this.values = [];
    }
    start(task,callback){
        Neon.process.stack[this.tid] = this;
        this.work = task;
        Neon.process.queue.unshift(this.tid);
        if (callback == undefined){
            let b = this.callback;
            return function(cb){
                b = cb;
            }
        }
        else{
            this.callback = callback;
            return function(){}
        }
    }
    kill(inQueue=true){
        delete Neon.process.stack[this.tid];
        if (inQueue == true) Neon.process.queue.splice( Neon.process.queue.indexOf(this.tid) );
        return 0;
    }
    updateValues(){
        if (this.values.length > 32){
            let numtoremove = this.values.length - 32;
            this.values.splice(0,numtoremove);
        }
    }
}


class NeonMessagePackage{
    constructor(message,sender='SYSTEM',recipient='NEON',immortal=true){
        this.message = NeonMessagePackage.encrypt(message,recipient);
        this.sender = sender;
        this.immortal = immortal;
    }
    setSender(sender){
        this.sender = sender;
        return this;
    }
    get(recipient){
        return NeonMessagePackage.decrypt(this.message, recipient);
    }
    static encrypt(message,password){
        return Neon.hash.pack(password,message);
    }
    static decrypt(encryptedMessage,password){
        return Neon.hash.unpack(password,encryptedMessage);
    }
}
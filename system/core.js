/**
 * Created by darylcecile on 24/01/2017.
 */


// Regulates core actions

window.Neon.core = {};

window.Neon.process = {
    stack:{},
    queue:[],
    current:0,
    task:function(action,callback,killStraightAfterExecution=true){
        let t = new process(-1,killStraightAfterExecution);
        t.start(action,callback)(callback);
        return t;
    },
    poll:function(){
        return {
            stack:{
                count: Object.keys(Neon.process.stack).length,
                raw: Neon.process.stack
            },
            queue:{
                count: (Neon.process.queue.length >= 1) ? 1 : 0,
                raw: Neon.process.queue
            },
            system:{
                count: Neon.system.taskCount,
                raw: Neon.system.running
            }
        }
    }
};

window.Neon.Console = {
    getErrors:function(){
        return Neon.Console.notes;
    },
    notes:'\n',
    log:function (Title,Message,debug=false) {
        console.error('\n*** Neon Report ***\nERROR: '+Title + '\nMESSAGE: ' + Message + '\n ');
        Neon.Console.note(Title,Message);
        if (debug==true){
            alert('\nNEON DEBUG ERROR REPORT\n\nERR :  ' + Title + '\nMSG:  ' + Message + '\n ')
        }
    },
    note:function(Title,Message){
        Neon.Console.notes += Neon.Console.timestamp + ':' + Title + ':' + Message + '\n';
    },
    get timestamp(){
        let a = new Date();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        return  hour + ':' + min + ':' + sec ;
    },
    get datestamp(){
        let a = new Date();
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        return date + ' ' + month + ' ' + year;
    }
};

window.Neon.Generator = {
    random:function(min=1111,max=9999,binary=false){
        let val;
        val = Math.floor(Math.random() * max) + min;

        if (binary == true){
            val = '';
            for (let i = 0 ; i <= max -1 ; i++){
                let r =  Math.floor(Math.random() * 100) + 1;
                val += ( r > 50 ) ? 1 : 0;
            }
        }
        return val;
    }
};

window.Neon.hash = {
    store:{},
    pack:function(password , message){
        let key = Neon.Generator.random(0,8,true);
        Neon.hash.store[key] = password + Neon.hash.meld(message);
        return key;
    },
    unpack:function(password,enc){
        let item = Neon.hash.store[enc];
        let encryptedMessage = item.replace(password,'');
        return Neon.hash.meld(encryptedMessage,item.length == encryptedMessage.length);
    },
    meld:function(string,forward=true){

        let alph = ' abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[].<>()\'"@£#$%^&*~`;:::::';

        let finalString = '';

        for (let c = 0; c <= string.length - 1 ; c ++){

            finalString += alph[ alph.indexOf(string[c])+ ((forward*6)-3) ];

        }

        return finalString;

    }
};


window.Neon.pipes = {
    push:function(messagePacket){
        let sender = messagePacket.sender;
        let cleanList = [];
        if ( Neon.pipes.messageListenerStack[sender] != undefined ){
            for (let i=0; i <= Neon.pipes.messageListenerStack[sender].length -1 ; i++){
                let listener = Neon.pipes.messageListenerStack[sender][i];

                listener.callback( messagePacket.get( listener.receiver ) );

                if (listener.immortal == false) cleanList.push(i);

            }

            for (let i = 0; i <= cleanList.length - 1 ; i ++ ){
                delete Neon.pipes.messageListenerStack[sender][ cleanList[i] ];
            }
        }
    },
    messageListenerStack:{},
    getFrom:function(receiver,sender,cb){
        if ( Neon.pipes.messageListenerStack[sender] == undefined ){
            Neon.pipes.messageListenerStack[sender] = [];
        }
        Neon.pipes.messageListenerStack[sender].push({
            callback:cb,
            receiver:receiver
        });
    }
};

window.Neon.UI = {
    handleLeftSidebar:function(evt, parent){
        let x = evt.pageX;
        let tp = $(parent);
        let t = tp.find('.siderbar.left');
        let wSize = t.width() + 35;

        let mainContainer = tp.find('.mainbar');
        let sideRight = tp.find('.siderbar.right');

        if (x >= wSize - 8 && x <= wSize + 8 && evt.which === 1){
            window.resize_drag_left_sidebar = true;
            if ( (x - 35) < 16) {
                t.width(16);
            }
            else{
                t.width(x - 35)
            }
        }
        else if (x >= wSize - 8 && x <= wSize + 8 && evt.which === 0){
            t.addClass('resizer');
            tp.addClass('resizer_parent');
        }
        else if (evt.which === 1 && window.resize_drag_left_sidebar){
            if ( (x - 35) < 16) {
                t.width(16);
            }
            else{
                t.width(x - 35)
            }
        }
        else{
            window.resize_drag_left_sidebar = false;
            t.removeClass('resizer');
            tp.removeClass('resizer_parent');
        }

        mainContainer.width( $('body').width() - (sideRight.width() + t.width() + 35) );
        mainContainer.css('left', (36 + t.width()) + 'px' )
    },
    handleRightSidebar:function(evt, parent){
        let x = evt.pageX;
        let tp = $(parent);
        let t = tp.find('.siderbar.right');
        let c = $('body').width();
        let wSize = c - t.width();
        let gapRight = c - x;

        let mainContainer = tp.find('.mainbar');
        let sideLeft = tp.find('.siderbar.left');

        if (x >= wSize - 8 && x <= wSize + 8 && evt.which === 1){
            window.resize_drag_right_sidebar = true;
            if ( (gapRight ) < 45) {
                t.width(45);
            }
            else{
                t.width(gapRight)
            }
        }
        else if (x >= wSize - 8 && x <= wSize + 8 && evt.which === 0){
            t.addClass('resizerB');
            tp.addClass('resizer_parent');
        }
        else if (evt.which === 1 && window.resize_drag_right_sidebar){
            if ( (gapRight) < 45) {
                t.width(45);
            }
            else{
                t.width(gapRight)
            }
        }
        else{
            window.resize_drag_right_sidebar = false;
            t.removeClass('resizerB');
            tp.removeClass('resizer_parent');
        }

        mainContainer.width( $('body').width() - (sideLeft.width() + t.width() + 35) );
        mainContainer.css('left', (36 + sideLeft.width()) + 'px' )
    }
};

const toolbox = {};
const creator = {};
const sidebar = {};

creator.controls = {};
creator.controls.core = {};

toolbox.tools = {};

sidebar.show = function(name){
    $('[smartStick]>i').animate({opacity:0},400,function(){
        $(this).text('close');
        $('[smartStick]>i').animate({opacity:1},400);
    });
    $('nav[left], main').addClass('opened');

    let p = $('<p toolboxItem>'+name+'</p>').css({opacity:0,marginBottom:0});
    $('nav[left]').prepend(p);
    p.animate({opacity:1});

    let controlContainer = $("#toolbox");
    if (controlContainer.length == 0) {
        controlContainer = $('<div toolboxItem id="toolbox"/>').css({opacity:0});
        $('nav[left]').append(controlContainer);
    }
};

toolbox.loadTools = function () {
    let fs = require('fs');
    let defaultTools = ['button','card','heading','label','listitem','paragraph','radio','textbox','toolbar'];
    let path_to_tools = path.join(__dirname,'NSControls');
    let toolsFound = fs.readdirSync(path_to_tools).filter((file) => {
        return fs.lstatSync(path.join(path_to_tools, file)).isFile() && path.extname(file) === ".jsx";
    });

    if (toolsFound.length < 1){
        toolbox.tools = defaultTools;
    }
    else{
        toolbox.tools = [];
        toolsFound.forEach(function(n){
            toolbox.tools.push( path.parse( path.join(path_to_tools,n) ).name );
        });
    }
};

toolbox.show = function(){

    sidebar.show('Toolbox');

    toolbox.loadTools();

    creator.controls.core = {};

    for (let ind in toolbox.tools){
        let pathC = path.join( __dirname , path.join('NSControls', toolbox.tools[ind]+'.jsx') );
        let toolName = Object.keys(creator.controls.core)[Object.keys(creator.controls.core).length-1];

        let convCode = eval(toolbox.addToolX( pathC ));
        creator.controls.core[toolName] = eval(convCode);
        console.warn ( creator.controls.core[toolName] );

        toolbox.addTool( toolName );

    }

    let message = {
        'id':atomic.componentGUID.GetNew(),
        'action':'SYNC_TOOLBOX',
        'data':'RESET'
    };

    sendMessage(JSON.stringify(message),'designer');

    $('#toolbox').animate({opacity:0},700,function(){
        $('#toolbox').animate({opacity:1},500);
    });
    // $('[smartStick]>i').animate({opacity:1});
};

sidebar.hide = function(){
    $('[smartStick]>i').text('dashboard');
    $('nav[left] *[toolboxItem]').animate({
        opacity:0
    },500,function(){
        $('nav[left] *[toolboxItem]').remove();
        $('nav[left], main').removeClass('opened');
    });
}

toolbox.hide = function(){
    sidebar.hide();
};

toolbox.toggle = function(){
    if ( $('nav[left],main').is('.opened') ){
        toolbox.hide();
    }
    else{
        toolbox.show();
    }
};

sidebar.toggle = function(n){
    if ( $('nav[left],main').is('.opened') ){
        sidebar.hide();
    }
    else{
        sidebar.show(n);
    }
};

toolbox.addTool = function(name){
    let controlObject = creator.controls.core[ name ];

    let controlContainer = $('#toolbox');
    if (controlContainer.length == 0) {
        controlContainer = $('<div toolboxItem id="toolbox"/>').css({opacity:0});
        $('nav[left]').append(controlContainer);
    }

    let control = $('<div draggable item></div>');
    control.attr('id',atomic.componentGUID.GetNew());

    control.append( $('<img class="prevIcon" src="'+path.join(__dirname,'NSControls',controlObject.icon)+'.png"/>') );
    control.append( $('<p>'+controlObject.data.control+'</p>') );

    control[0].setAttribute('e',controlObject.name);

    control[0].addEventListener('dragstart', function(e){
        console.log(e,control[0],'*');
        window.toolbox.dragging = control[0].getAttribute('e');

        toolbox.addListener();

    }, false);

    toolbox.tools[control.attr('id')] = controlObject;

    controlContainer.append(control);
};

toolbox.addToolX = function(name){
    return nativejsx.parseSync(name, {
        declarationType: 'var',
        variablePrefix: '$$'
    })
};

toolbox.addListener = function(w){
    $('[listener]').remove();

    let designer = $('#guestDesigner');
    let listener = ( w == undefined ? $('<div listener/>') : w );
    let defaultCSS = {
        background:'transparent',
        position:'fixed',
        outline:'1px solid dodgerblue'
    };

    listener.offset({left:designer.offset().left, top:designer.offset().top});

    listener.width( designer.width() );
    listener.height( designer.height() );


    listener.css(defaultCSS);

    if (w == undefined) listener[0].loop = setInterval(function(){
        listener.width( designer.width() );
        listener.height( designer.height() );
    },50);

    if (w == undefined) $('main').append(listener);

    listener[0].addEventListener ("DOMNodeRemoved", function(e){
        if (w == undefined) clearInterval(e.target.loop);
    });

    listener[0].addEventListener('dragenter',function(e){
        listener.css(defaultCSS);
        let gDesigner = $('#guestDesigner');
        let x = e.pageX - gDesigner.offset().left;
        let y = e.pageY - gDesigner.offset().top;
        if (x >= 0 && y >= 0 && x <= gDesigner.width() && y <= gDesigner.height()){
            let message = {
                'id':atomic.componentGUID.GetNew(),
                'action':'NEW_HOVER_TARGET',
                'data':{
                    'x':x,
                    'y':y
                }
            };

            sendMessage(JSON.stringify(message),'designer');
        }
        e.preventDefault();
    });

    listener[0].addEventListener('dragover',function(e){
        listener.css(defaultCSS);
        let gDesigner = $('#guestDesigner');
        let x = e.pageX - gDesigner.offset().left;
        let y = e.pageY - gDesigner.offset().top;
        if (x >= 0 && y >= 0 && x <= gDesigner.width() && y <= gDesigner.height()){
            let message = {
                'id':atomic.componentGUID.GetNew(),
                'action':'NEW_HOVER_TARGET',
                'data':{
                    'x':x,
                    'y':y
                }
            };

            sendMessage(JSON.stringify(message),'designer');
        }
        e.preventDefault();
    });

    listener[0].addEventListener('dragleave',function(){
        let message = {
            'id':atomic.componentGUID.GetNew(),
            'action':'NO_HOVER_TARGET',
            'data':''
        };

        sendMessage(JSON.stringify(message),'designer');
        listener.css({
            background:'transparent',
            position:'fixed',
            outline:'1px solid black'
        });
    });

    listener[0].addEventListener('drop',function(e){
        console.warn('a',window.toolbox.dragging);

        let gDesigner = $('#guestDesigner');
        let x = e.pageX - gDesigner.offset().left;
        let y = e.pageY - gDesigner.offset().top;
        if (x >= 0 && y >= 0 && x <= gDesigner.width() && y <= gDesigner.height()){
            let message = {
                'id':atomic.componentGUID.GetNew(),
                'action':'INSERT_ELEM',
                'data':window.toolbox.dragging
            };

            sendMessage(JSON.stringify(message),'designer');
        }


        listener.remove();

    });
};


toolbox.availableTools = ['button','card','heading','label','listitem','paragraph','radio','textbox','toolbar'];


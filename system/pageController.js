/**
 * Created by darylcecile on 24/01/2017.
 */


window.Neon.pages = {
    goto:function(page,preserveCurrent=true){
        let container = $('<div></div>');
        let body = $('body');
        container.load(encodeURI(path.join(remote.getGlobal('editorPath'),"/pages/"+page+'.neonpage')), function () {
            let pID = Neon.Generator.random(111,999);
            container.find('neon-page').attr('id', pID );
            container.find('neon-page').css({
                position:'fixed',
                left:'100%',
                top:'0px',
                width:'100%',
                height:'100%'
            });
            if (preserveCurrent==false){
                Neon.pages.history = [];
                container.find('neon-page').css('left','0');
                body.html( container.html() );
            }
            else{
                Neon.pages.history.push(pID);

                body.append( container.html() );

                if (Neon.pages.history.length > 1){
                    let previous = $('#'+Neon.pages.previousPage);
                    let current = $('#'+Neon.pages.currentPage);

                    let old_Width = previous.width();

                    current.animate({
                        'left':'0',
                        'opacity':'1'
                    },700);

                    previous.animate({
                        'left':(-1 * ((old_Width/2)*1)) +'px',
                        'opacity':'0'
                    },700);
                }
                else{
                    $('body').find('#'+pID).css('left','0');
                }
            }
            Neon.Console.note('Context Changed','loaded '+"/pages/"+page+'.neonpage');
        });
    },
    goBack:function(){
        if ( Neon.pages.history.length == 1 ){
            return;
        }
        let oldPage_id = Neon.pages.history.pop();
        let oldPage = $('#'+oldPage_id);
        let newPage_id = Neon.pages.currentPage;
        let newPage = $('#'+newPage_id);

        let old_Width = oldPage.width();

        oldPage.animate({
            'left':(old_Width/2)+'px',
            'opacity':'0'
        },700);

        newPage.animate({
            'left':'0px',
            'opacity':'1'
        },700,function(){
            oldPage.remove();
        });
    },
    renderPages:function(){

    },
    pop:function(page,mapped=false){
        if ( $('#pop_modules').length != 0 ) {
            $('#pop_modules').data('close')();
            return;
        }
        let file =  "/pages/"+page+'.neonpage';
        let container = $('<div id="pop_modules" neon-pop></div>');
        container.css('opacity','0');
        container.load(encodeURI(path.join(remote.getGlobal('editorPath'),file)));
        let place = (mapped == true ? '#'+this.currentPage : 'body');
        $( place ).append(container);
        container.animate({'opacity':'1'},300);
        function close(){
            container.animate({'opacity':'0'},300,function(){
                container.remove();
            });
        }

        container.data('close',close);

        if (mapped) container.css({
            'width':'calc(100% - 35px)',
            'height':'100%',
            'left':'35px',
            'top':'0px'
        });

        return close;
    },
    history:[],
    get currentPage(){
        return (Neon.pages.history[ Neon.pages.history.length - 1 ]);
    },
    get previousPage(){
        if ( Neon.pages.history.length > 1 ){
            return (Neon.pages.history[ Neon.pages.history.length - 2 ]);
        }
        else{
            return (Neon.pages.history[ Neon.pages.history.length - 2 ]);
        }
    }
};

window.Neon.interaction = {
    setLogo:function(){
        let l = $('h1, h2, h3, h4').parent().find('*:contains(":n"), :contains(":e"), :contains(":o")');
        if ( l.length == 0 ) return;
        l.each(function(i,a){
            $(this).html( $(this).html().replace(/:n/g,'&#8898;').replace(/:o/g,'&#8857;').replace(/:e/g,'<span style="font-weight: 300">e</span>') )
        });
    }
};
/**
 * Created by darylcecile on 06/02/2017.
 */

window.Neon.components = {
    start:function(){
        this.self = setInterval(function(){
            Neon.components.check();
        },250);
    },
    stop:function(){
        clearInterval(this.self);
    },
    check:function(){
        let keys = Object.keys(this.definitions);
        for (let i = 0; i < keys.length ; i++){

            let targ = $(keys[i]);

            if ( targ.length > 0 ){

                for (let ix = 0; ix < targ.length ; ix++){

                    this.definitions[keys[i]]( $(targ[ix]) , function(){
                        delete Neon.components.definitions[ keys[i] ];
                    } );

                }

            }

        }
    },
    define:function(tagName,handler){
        this.definitions[tagName] = handler;
    },
    definitions:{},
    self:undefined
};


Neon.components.define('neon-tabs', function($obj){

    let new_TabControl = $('<div neon-component="tab" neon-post="parent"></div>');

    let new_tabHeaderPanel = $('<div neon-component="tab_header_panel" neon-post="container child"></div>');

    let new_tabPanel = $('<div neon-component="tab_panel" neon-post="container child"></div>');

    for (let i = 0 ; i < $obj.children().length ; i ++ ){
        let current_tab = $obj.children()[i];
        let new_tab_header = $('<div neon-component="tab_header" neon-post="child">'+ $(current_tab).attr('title') +'</div>');
        let new_tab = $('<div neon-component="tab_container" neon-post="child" neon-identifier="'+$(current_tab).attr('title')+'">' + current_tab.innerHTML + '</div>');

        new_tabHeaderPanel.append( new_tab_header );
        new_tabPanel.append( new_tab );

        if (i == 0){
            new_tab_header.addClass('current');
            new_tab.addClass('current');
        }
    }

    new_TabControl.append( new_tabHeaderPanel );
    new_TabControl.append( new_tabPanel );

    let theParent = $obj.parent();

    $obj.remove();

    $(theParent).append( new_TabControl );

    $(new_tabHeaderPanel).children().click(function(){
        new_tabHeaderPanel.find('[neon-component="tab_header"]').removeClass('current');

        new_tabPanel.find('[neon-component="tab_container"]').removeClass('current');

        let text = $(this).text();

        new_tabPanel.find('[neon-component="tab_container"]').each(function(){
            if ( $(this).attr('neon-identifier') == text ){
                $(this).addClass('current');
            }
        });

        $(this).addClass('current');

    });

});

// Find and register neon components
/*
    <neon-tabs>
        <tab title="tab1">
            tabContents
        </tab>
        <tab title="tab2">
            tab contents for tab 2
        </tab>
    </neon-tabs>
 */
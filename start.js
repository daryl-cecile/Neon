/**
 * Created by darylcecile on 07/03/2017.
 */


window.a = atomic;

a.define('atomic-unitbox','unitbox.xml');
a.define('atomic-search','searchbox.xml');
a.define('atomic-selectionbox','selectionbox.xml');
a.define('atomic-drop','dropdown.xml');
a.define('atomic-color','colorpicker.xml');
a.define('atomic-switcher','switcher.xml');
a.define('atomic-textbox','textbox.xml');
a.define('atomic-range','range.xml');
a.define('atomic-inputbox','inputbox.xml');
a.define('atomic-numberbox','numberbox.xml');

Mousetrap.bind('alt+space', function(e) {
    e.preventDefault();
    system.openSearch();
});

system.setupDesignerCommunication();

$('section[right]>*:not(p):not(hr):not(atomic-textbox)').remove();

$('atomic-textbox')[0].addEventListener('startFinding',function(e){
    let w = e.detail;
    let v = dset.ref(w).values.join(',').toString();
    let f = dset.ref(w).attrGUID;

    if (w.length > 10){

        if (w.indexOf('-') > -1){
            w = w[0] + '-'+ w.split('-')[1];
        }
        else{
            w = w.toString().substr(0,10);
        }

    }

    let y = $('#'+f);
    if ( y.length > 0 ){
        y[0].scrollIntoView({behavior: "smooth"});
        y.fadeOut(500).fadeIn(500);
        return;
    }

    let toAdd = undefined;
    if (v=='<color>') {
        toAdd = ($('<atomic-color id="'+f+'" label:html="'+w+'"></atomic-color>'));
    }
    else if (v=="<length>"){
        toAdd = ( $('<atomic-unitbox id="'+f+'" label:html="'+w+'" input:val="0" button:html="px"></atomic-unitbox>') );
    }
    else if (v=="<time>"){
        toAdd = ( $('<atomic-unitbox id="'+f+'" label:html="'+w+'" input:val="0.5" button:html="s"></atomic-unitbox>') );
    }
    else if (v=="<string>"){
        toAdd = ( $('<atomic-inputbox id="'+f+'" label:html="'+w+'"></atomic-inputbox>') );
    }
    else if (v.indexOf(',')>-1){
        toAdd = ( $('<atomic-selectionbox id="'+f+'" label:html="'+w+'" data:list="'+v.split(',').join('|')+'"></atomic-selectionbox>') );
    }
    else if (v=="<number>"){
        toAdd = ( $('<atomic-numberbox id="'+f+'" label:html="'+w+'"></atomic-numberbox>') );
    }
    else {
        // alert(v+f);
    }

    if (toAdd != undefined){
        $('section[right]').append(toAdd);

        let origName = e.detail;

        toAdd[0].addEventListener('updated',function(e){
            let customStyle = '{'+origName+':'+e.detail+'}';
            designerCom.setStyle(designerCom.focusedItem,customStyle);
        });
    }

});

dset.applyStyle = function(prop){
    let w = prop;
    let v = dset.ref(w).values.join(',').toString();
    let f = dset.ref(w).attrGUID;

    if (w.length > 10){

        if (w.indexOf('-') > -1){
            w = w[0] + '-'+ w.split('-')[1];
        }
        else{
            w = w.toString().substr(0,10);
        }

    }

    let y = $('#'+f);
    if ( y.length > 0 ){
        y[0].scrollIntoView({behavior: "smooth"});
        y.fadeOut(500).fadeIn(500);
        return;
    }

    let toAdd = undefined;
    if (v=='<color>') {
        toAdd = ($('<atomic-color id="'+f+'" label:html="'+w+'"></atomic-color>'));
    }
    else if (v=="<length>"){
        toAdd = ( $('<atomic-unitbox id="'+f+'" label:html="'+w+'" input:val="0" button:html="px"></atomic-unitbox>') );
    }
    else if (v=="<time>"){
        toAdd = ( $('<atomic-unitbox id="'+f+'" label:html="'+w+'" input:val="0.5" button:html="s"></atomic-unitbox>') );
    }
    else if (v=="<string>"){
        toAdd = ( $('<atomic-inputbox id="'+f+'" label:html="'+w+'"></atomic-inputbox>') );
    }
    else if (v.indexOf(',')>-1){
        toAdd = ( $('<atomic-selectionbox id="'+f+'" label:html="'+w+'" data:list="'+v.split(',').join('|')+'"></atomic-selectionbox>') );
    }
    else if (v=="<number>"){
        toAdd = ( $('<atomic-numberbox id="'+f+'" label:html="'+w+'"></atomic-numberbox>') );
    }
    else {
        // alert(v+f);
    }

    if (toAdd != undefined){
        $('section[right]').append(toAdd);

        let origName = prop;

        toAdd[0].addEventListener('updated',function(e){
            let customStyle = '{'+origName+':'+e.detail+'}';
            designerCom.setStyle(designerCom.focusedItem,customStyle);
        });
    }
};


dset.func.getLinks(function(){
    dset.update();
});

$('section[right]').bind('mousewheel', function(e){
    if(e.originalEvent.wheelDelta < 0) {
        if ( $(this).scrollTop() >= 50 ){
            if ($(this).find('atomic-textbox').parent().is('.topWrapper') == false) $(this).find('atomic-textbox').wrap('<div class="topWrapper"></div>');
        }

    }else {
        if ( $(this).scrollTop() == 0 && $(this).find('atomic-textbox').parent().is('.topWrapper')){
            $(this).find('atomic-textbox').unwrap();
        }
    }

});

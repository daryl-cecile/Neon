/**
 * Created by darylcecile on 07/03/2017.
 */

const atomic = {};

atomic.require = function(module){

};

atomic.defineAdv = function(tagName,modulePath,eClass){
    atomic.componentRegistry[tagName] = modulePath;
    customElements.define(tagName,eClass);
    $(tagName).each(function () {
        console.log(this);
        $(this)[0].setup(tagName,modulePath,{});
    });
};

atomic.framework = {};

atomic.define = function(tagName,module,methods={}){

    let mepath = remote.getGlobal('editorPath') + '/atomic_components/' + module;
    let parentDirPath = path.join( path.parse(mepath).dir , path.parse(mepath).name );

    mepath = path.join( parentDirPath , module );

    let mecontent = $( fs.readFileSync(mepath,'utf8') );

    if ( mecontent.find('class').length > 0 ){
        let tpath = mecontent.find('class').attr('src');

        if ( fs.existsSync( tpath ) == false ){

            methods = eval( fs.readFileSync(path.join(parentDirPath, tpath),'utf8') );

        }
        else{
            methods = eval( fs.readFileSync(tpath,'utf8') );
        }
    }


    if (typeof methods == "function") {
        atomic.defineAdv(tagName,module,methods);
        return;
    }

    atomic.componentRegistry[tagName] = module;
    customElements.define(tagName, class extends atomicElement{
        constructor(){
            super(tagName,module,methods);
        }
    });
};

// COMPONENT HANDLERS

atomic.componentRegistry = {};
atomic.componentCSS = {};

atomic.componentGUID = new (function() {
    this.empty = "00000000-0000-0000-0000-000000000000";
    this.GetNew = function() {
        let fourChars = function() {
            return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1).toUpperCase();
        };
        return (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    };
})();

atomic.componentCSS.add = function(selector, rules, index=1) {

    let sheet = atomic.componentStyleSheet.get();

    if("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index);
    }
    else if("addRule" in sheet) {
        sheet.addRule(selector, rules, index);
    }
};

atomic.componentStyleSheet = {};
atomic.componentStyleSheet.get = function(){
    let sheets = document.styleSheets;
    let sheet = undefined;
    for (let i in sheets){
        if (sheets.hasOwnProperty(i) == false) continue;
        if ( sheets[i].href.indexOf('atomic_components_dynamic.css') != -1 ){
            sheet = sheets[i];
        }
    }
    if ( sheet == undefined ){
        let p = path.join( remote.getGlobal('editorPath') , '/atomic_components/atomic_components_dynamic.css' );
        fs.writeFileSync( p , '' , 'utf8' );

        let styl = document.createElement('link');
        styl.href = p;
        styl.rel = "stylesheet";
        document.getElementsByTagName('head')[0].appendChild( styl );
        sheets = document.styleSheets;

        return sheets[sheets.length-1];
    }
    return sheet;
};

class atomicElement extends HTMLElement {
    constructor(tagName,moduleName,methodObjects={}) {
        super();
        if (tagName != undefined && moduleName == undefined) moduleName = tagName +'.xml';
        this.isLoaded = false;

        const shadowRoot = this.attachShadow({mode: 'open', delegatesFocus: false});

        console.info(tagName,moduleName,methodObjects);

        if (moduleName == undefined) return;

        this.setup(tagName,moduleName,methodObjects);

    }

    setup(tagName,module,methods={}){


        let pt = path.join( remote.getGlobal('editorPath') , 'atomic_components');
        pt = path.join( pt , path.parse(module).name );

        let parentDirPt = path.parse( path.join(pt,module) ).dir;
        let content = fs.readFileSync(path.join(pt , module),'utf8');
        let icr = $('<div/>').html( content );
        let elementDefinitionTag = icr.find('element[alias="'+tagName+'"]');
        let me = this;

        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type == "attributes") me.event_attrChange();
            });
        });

        let styles = "";

        let content_ammended = elementDefinitionTag.find('content').get(0).innerHTML;

        if ( elementDefinitionTag.find('style').length > 0 ){
            let $styleTag = elementDefinitionTag.find('style');
            if ($styleTag.get(0).hasAttribute('file')) {
                styles = fs.readFileSync(path.join(parentDirPt, $styleTag.attr('file')), 'utf8');
            }
            else{
                styles = $styleTag.text();
            }
        }

        let res = "";

        if (elementDefinitionTag.find('res').length > 0){
            let $res = elementDefinitionTag.find('res');
            if ($res.get(0).hasAttribute('file')) {
                if ( $res.attr('type') == 'stylesheet' ) res = fs.readFileSync( path.join( __dirname ,$res.attr('file') ), 'utf8');
            }
        }

        if (elementDefinitionTag.find('css-rule').length > 0){
            let $styleTag = elementDefinitionTag.find('css-rule');
            $styleTag.each(function(){
                let styleCSS = $(this).text();
                let selector = $(this).attr('select').replace(/\$root/g,tagName);

                document.styleSheets[0].addRule((selector.indexOf(tagName)==-1?tagName+' ':'')+selector,styleCSS, 1);
            });
        }

        let config = { attributes: true, childList: true, characterData: true };

        // pass in the target node, as well as the observer options
        observer.observe(this, config);


        this.shadowRoot.innerHTML = '<span class="spacer"></span><style>*{box-sizing:border-box} .spacer{height:5px;width: 100%;display:block} :host{contain: layout; height:100%}'+styles+res+'</style>'+
            content_ammended + '<span class="spacer"></span>';


        $(this.shadowRoot).find('script').each(function(s){
            eval.call(me.shadowRoot,this.innerHTML);
        });

        this.event_attrChange();
        this.isLoaded = true;
        this.onReady();
    }

    onReady(){

    }

    event_attrChange(){

        for (let i in this.attributes) {

            if (this.attributes.hasOwnProperty(i)) {
                let attr_name = this.attributes[i].name;
                let attr_value = this.attributes[i].value;

                if (attr_name.indexOf('atomic:') == 0){
                    attr_name = attr_name.split(':')[1];

                    continue;
                }
                else if (attr_name.indexOf('data:') == 0){
                    continue;
                }
                else if (attr_name.indexOf('anc:')==0){
                    //no conflict mode
                    let targetName = attr_name.split(":")[1].split(':')[0];
                    let propertyName = attr_name.split(":")[2];

                    let taskTarget = $(this.shadowRoot).find(targetName);
                    console.log(targetName,propertyName,taskTarget);
                    if (taskTarget.length > 0) {
                        $(taskTarget[0])[propertyName](attr_value);
                    }
                    else{
                        $(this.shadowRoot).find('#'+targetName)[propertyName](attr_value);
                    }

                    continue;
                }
                else if (attr_name.indexOf(':') > -1){

                    let targetName = attr_name.split(":")[0];
                    let propertyName = attr_name.split(":")[1];

                    let taskTarget = $(this.shadowRoot).find(targetName);
                    console.log(targetName,propertyName,taskTarget);
                    if (taskTarget.length > 0) {
                        $(taskTarget[0])[propertyName](attr_value);
                    }
                    else{
                        $(this.shadowRoot).find('#'+targetName)[propertyName](attr_value);
                    }

                    continue;
                }
                else if (attr_name == 'style'){
                    $(this.shadowRoot).find('div')[0].setAttribute('style',attr_value);
                }

                let rootElemDefTag = $(this.shadowRoot);
                rootElemDefTag.find('*').filter(function() {
                    return $(this).attr('expecting');
                }).each(function(){
                    if ( $(this).attr('expecting').indexOf(attr_name) > -1 ){
                        $(this).attr(attr_name,attr_value);
                    }
                });
            }
        }
    }
}

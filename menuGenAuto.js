
window.Menu = remote.Menu;
window.MenuItem = remote.MenuItem;


window.menu = new Menu();



// window.addEventListener('context-menu', (e) => {
//     e.preventDefault();
//     console.log(e);
//     menu.popup(remote.getCurrentWindow())
// }, false);

remote.getCurrentWebContents().on('context-menu',function(e,p){
    e.preventDefault();
    console.log(e.target);
    window.menu = new Menu();
    let af = MenuGA.addFunction;
    let can = type => p.editFlags[`can${type}`] && p.hasText;
    let hasText = p.selectionText.trim().length > 0;
    let canEdit = p.isEditable;
    let editFlags = p.editFlags;

    af({
        label:'Copy',
        role: (can('Copy') && hasText ?'copy':''),
        enabled: (can('Copy') && hasText)
    });

    af({
        label:'Cut',
        role: (can('Cut') && canEdit && hasText?'cut':''),
        enabled: (can('Cut') && canEdit && hasText)
    });
    af({
        label:'Paste',
        role:(editFlags.canPaste && canEdit?'paste':''),
        enabled:(editFlags.canPaste && canEdit)
    });

    af({
        type:'separator'
    });
    af({
        label:'Remove Component',
        click(){
            let xd = document.elementFromPoint(p.x,p.y);
            if (xd.tagName == 'HTML') xd = document.body;

            if(xd.hasAttribute('element-name') == true || xd.tagName == 'BODY'){
                let myNewName = xd.localName;
                if (xd.hasAttribute('element-name')) myNewName = xd.getAttribute('element-name');
            }
            else{

                if (xd.tagName == 'HTML') xd = document.body;
                while(xd.tagName != 'BODY' && xd.hasAttribute('element-name') == false){
                    xd = xd.parentNode;
                }
            }
            $(xd).remove();
        }
    });
    af({
        type:'separator'
    });

    if (p.mediaType === 'image') {
        af({
            type: 'separator'
        });
        af({
            label:'Remove Image',
            click(){
                console.log(e,p);
                $(document.elementFromPoint(p.x,p.y)).remove();
            }
        });
        af({
            label:'Copy Image Link',
            click(){
                if (process.platform === 'darwin') {
                    remote.clipboard.writeBookmark('imageLink', p.srcURL);
                } else {
                    remote.clipboard.writeText(p.srcURL);
                }
            }
        });
        af({
            label:'Link to resource',
            click(){

            }
        });
    }
    if (p.linkURL && p.mediaType === 'none') {
        af({
            type: 'separator'
        });
        af({
            label: 'Copy Link',
            click() {
                if (process.platform === 'darwin') {
                    remote.clipboard.writeBookmark(p.linkText, p.linkURL);
                } else {
                    remote.clipboard.writeText(p.linkURL);
                }
            }
        });
    }

    af({
        type: 'separator'
    });
    af({
        label:'Inspect',
        click(){
            remote.getCurrentWebContents().inspectElement(p.x,p.y);

            if (remote.getCurrentWebContents().isDevToolsOpened()) {
                remote.getCurrentWebContents().devToolsWebContents.focus();
            }
        }
    });
    af({
        type: 'separator'
    });
    af({
        label:'Enable Navigation',
        type:'checkbox',
        checked: virtual.browserExperience.allowNavigate,
        click(){
            virtual.browserExperience.allowNavigate = false == virtual.browserExperience.allowNavigate;
            if (virtual.browserExperience.allowNavigate == true){
                if (designerHost.marker){
                    document.body.removeChild(designerHost.marker);
                    designerHost.marker = undefined;
                }
                if (designerHost.selector){
                    document.body.removeChild(designerHost.selector);
                    designerHost.selector = undefined;
                }
            }
        }
    });

    menu.popup(remote.getCurrentWindow());
},false);

window.MenuGA = {};

MenuGA.addFunction = function(options={}){
    menu.append(new MenuItem(options));
};

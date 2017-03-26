class switcher extends atomicElement{
    constructor(){
        super('atomic-switcher','switcher.xml');
        this.checked = false;
        let me = this;
        this.addEventListener('click',function(e){
            if (e.path[0].localName=='input') me.toggleChecked(me);
        })
    }
    toggleChecked(){
        this.checked = (false == this.checked);
        this.updateCheckUI();
        let me = this;
        me.dispatchEvent(new CustomEvent('updated', {
            bubbles: true,
            composed: true,
            detail: me.checked
        }));
    }
    updateCheckUI(me=this){
        console.log(me.shadowRoot);
        if (me.checked == undefined) me.checked = false;
        $(me.shadowRoot).find('p:not(:first)').text( me.checked.toString() );
    }
    event_attrChange(me=this){
        me.updateCheckUI(me);
        super.event_attrChange();
    }
}
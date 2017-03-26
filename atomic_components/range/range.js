class range extends atomicElement {
    constructor() {
        super('atomic-range','range.xml');

        let me = this;

        this.__defineGetter__('value',function(){
            return $(me.shadowRoot).find('input[type="range"]')[0];
        });

        this.__defineGetter__('label',function(){
            return $(me.shadowRoot).find('label')[0];
        });

        this.__defineGetter__('div',function(){
                return $(this.shadowRoot).find('div')[0];
        });

        this.__defineGetter__('input',function(){
            return $(me.shadowRoot).find('input[type="text"]')[0];
        });

        this.addEventListener('mouseleave',function(){
            $(me.div).removeClass('active');
        });
    }
}
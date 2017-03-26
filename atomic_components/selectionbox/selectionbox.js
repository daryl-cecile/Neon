class selectionbox extends atomicElement{
    constructor(){
        super('atomic-selectionbox','selectionbox.xml');
    }
    onReady(){
        super.onReady();
        this.fillItems();
        this.inp = $(this.shadowRoot).find('input')[0];
        let dd = $(this.shadowRoot).find('.dropdown')[0];
        let dp = dd.parentNode;
        this.inp.addEventListener('click',function(){
            $(dd).toggleClass('max');
            $(dp).toggleClass('max');
        });
        this.inp.addEventListener('blur',function(){
            setTimeout(function(){
                $(dd).removeClass('max');
                $(dp).removeClass('max');
            },300)
        });
        let me = this;

        this.__defineGetter__('value',function(){
            let amount = $(me.inp).val();
            if (amount.length < 1) amount = $(dd).find('.listItem p')[0].innerHTML;
            return amount;
        });

        let mb = this.inp;
        this.addEventListener('unitChanged',function (e) {
            $(mb).val(e.detail);
            $(dd).removeClass('max');
            $(dp).removeClass('max');
            me.dispatchEvent(new CustomEvent('updated', {
                bubbles: true,
                composed: true,
                detail: $(mb).val()
            }));
        });

        this.inp.addEventListener('keydown',function(e){
            if (e.keyCode == 13){
                me.dispatchEvent(new CustomEvent('unitChanged', {
                    bubbles: true,
                    composed: true,
                    detail: $(mb).val()
                }));
            }
        });
    }
    fillItems(u){
        $(this.shadowRoot).find('.dropdown').empty();
        let aa = $(this).attr('data:list');
        console.warn(aa);
        let units = (u || (aa==undefined ? "inherit|initial" : aa));
        let tag = "<div class='listItem'><p>$units</p></div>";
        let me = this;

        units = units.split("|");
        for (let i in units){
            let d = $(tag.replace("$units",units[i]));
            $(this.shadowRoot).find('.dropdown')[0].appendChild( d.click(function(){
                me.dispatchEvent(new CustomEvent('unitChanged', {
                    bubbles: true,
                    composed: true,
                    detail: $(this).find('p').text()
                }));
            })[0] );
        }
        return this;
    }
}
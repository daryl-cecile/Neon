class unitbox extends atomicElement{
    constructor(){
        super('atomic-unitbox','unitbox.xml');
    }
    onReady(){
        super.onReady();
        this.fillItems();
        this.btn = $(this.shadowRoot).find('button')[0];
        this.inp = $(this.shadowRoot).find('input')[0];
        let dd = $(this.shadowRoot).find('.dropdown')[0];
        this.btn.addEventListener('click',function(){
            $(dd).toggleClass('max');
        });
        let me = this;

        this.__defineGetter__('value',function(){
            let amount = $(me.inp).val();
            if (amount.length < 1) amount = '0';
            return amount + $(me.btn).text();
        });

        let mb = this.btn;
        this.addEventListener('unitChanged',function (e) {
            $(mb).text(e.detail);
            $(dd).removeClass('max');
            me.dispatchEvent(new CustomEvent('updated', {
                bubbles: true,
                composed: true,
                detail: me.value
            }));
        });

        this.inp.addEventListener('keyup',function(e){
            if (e.keyCode == 13){
                me.dispatchEvent(new CustomEvent('updated', {
                    bubbles: true,
                    composed: true,
                    detail: me.value
                }));
            }
        });
    }
    fillItems(){
        let units = "px||%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|q|in|pt|ms|s";
        let tag = "<div class='listItem'><p>$units</p></div>";
        let me = this;

        units = units.split("|");
        for (let i in units){
            let d = $(tag.replace("$units",units[i]));
            $(this.shadowRoot).find('.dropdown')[0].appendChild( d.click(function(){
                let r = this;
                me.dispatchEvent(new CustomEvent('unitChanged', {
                    bubbles: true,
                    composed: true,
                    detail: $(r).find('p').text()
                }));
            })[0] );
        }
    }
}
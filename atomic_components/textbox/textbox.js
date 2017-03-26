class textbox extends atomicElement{
    constructor(){
        super();
    }
    onReady(){
        super.onReady();
        this.fillItems();
        this.inp = $(this.shadowRoot).find('input')[0];
        let dd = $(this.shadowRoot).find('.dropdown')[0];
        let me = this;

        this.__defineGetter__('value',function(){
            return $(me.inp).val();
        });

        this.addEventListener('valueChanged',function (e) {
            $(me).attr('label:html',me.search(e.detail,me));
        });

        this.inp.addEventListener('keyup',function(){
            me.dispatchEvent(new CustomEvent('valueChanged', {
                    bubbles: true,
                    composed: true,
                    detail: $(me.inp).val()
                }));
        });

        this.inp.addEventListener('keydown',function(e){
            if (e.keyCode == 9) {
                e.preventDefault();
                let attrb = $(me).attr('label:html');
                if ( attrb.length > 0 && attrb != 'find properties'){
                    $(me.inp).val( attrb )
                }
            }
            else if (e.keyCode == 13){
                let attrb = $(me).attr('label:html');
                let rvale = $(me.inp).val();
                if ( attrb == rvale ){
                    me.dispatchEvent(new CustomEvent('startFinding', {
                        bubbles: true,
                        composed: true,
                        detail: rvale
                    }));
                    $(me.inp).val('');//.blur();
                    $(me).attr('label:html','find properties');
                }
                else if ( attrb.length > 0 && attrb != 'find properties'){
                    $(me.inp).val( attrb );
                }
            }
        });

        this.inp.addEventListener('focus',function(){
            $(dd).addClass('max');
        });

        this.inp.addEventListener('blur',function(){
            setTimeout(function(){
                $(dd).removeClass('max');
            },200);
        });
    }
    search(term,me=this){
        term = term.toLowerCase();
        let r = [];

        $(me.shadowRoot).find('.listItem p').each(function(i,a){
            if ( $(this).text().startsWith(term) ) {
                $(this).parent().show();
                r.push($(a).text());
            }
            else if ( $(this).text().indexOf(term) != -1 ){
                $(this).parent().show();
            }
            else{
                $(this).parent().hide();
            }
        });
        if (r.length == 0) r.push(' ');
        return (term.length > 0 ? r[0] : 'find properties');
    }
    fillItems(){
        let res = dset.getProperties();
        let tag = "<div class='listItem'><p>$res</p></div>";
        let me = this;

        let units = res;
        for (let i in units){
            let d = $(tag.replace("$res",units[i]));
            $(this.shadowRoot).find('.dropdown')[0].appendChild( d.click(function(){
                me.dispatchEvent(new CustomEvent('startFinding', {
                    bubbles: true,
                    composed: true,
                    detail: $(d).find('p').text()
                }));
                $(me.inp).val('');//.blur();
                $(me).attr('label:html','find properties');
            })[0] );
        }
    }
}
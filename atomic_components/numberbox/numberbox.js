class numberbox extends atomicElement {
    constructor() {
        super('atomic-numberbox','numberbox.xml');

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

    }
    onReady(){
        let me = this;
        this.inp = $(me.shadowRoot).find('input[type="text"]')[0];

        this.inp.addEventListener('keyup',function(e) {
            if (e.keyCode == 9) {
                e.preventDefault();
            }
            else if (e.keyCode == 38){
                e.preventDefault();
                me.increaseValue(me.parseValue(me));
            }
            else if (e.keyCode == 40){
                e.preventDefault();
                me.decreaseValue(me.parseValue(me));
            }
            me.dispatchEvent(new CustomEvent('updated', {
                bubbles: true,
                composed: true,
                detail: $(me.inp).val()
            }));
        });

        this.inp.addEventListener('keydown',function(e) {
            if (e.keyCode == 9) {
                e.preventDefault();
            }
            else if (e.keyCode == 38){
                e.preventDefault();
            }
            else if (e.keyCode == 40){
                e.preventDefault();
            }
        });
    }
    parseValue(mm=this){

        let res = [];
        let inX = $(mm.input).val().split(' ');

        for (let i in inX){
            let numval, unitval;
            let raw = inX[i];

            const regex = /(-*[0-9]+)([a-z%]*)/g;
            const str = raw;
            let m;

            while ((m = regex.exec(str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.

                if (m.length < 2 && m.length >= 1){
                    res.push({
                        value:m[1],
                        unit:"px"
                    });
                }
                else if (m.length < 1){
                    res.push({
                        value:"0",
                        unit:"px"
                    });
                }
                else{
                    res.push({
                        value:m[1],
                        unit:m[2]
                    });
                }
            }
        }
        return res;

    }
    increaseValue(l){
        let pos = [];
        let lastPosEnd = 0;
        let me = this;
        let posAt = 0;
        let oldPos = me.inp.selectionStart;
        if (l.length > 1){
            let w = '';
            $(l).each(function(mex,a){

                let posI = {
                    start:lastPosEnd,
                    end:(lastPosEnd+(this.value.length + this.unit.length))
                };
                pos.push(posI);

                if ( posI.start <= me.input.selectionStart-1 && posI.end >= me.input.selectionStart-1){
                    w += (JSON.parse(this.value) + 1).toString() + this.unit + '  ';
                }
                else{
                    w += (JSON.parse(this.value)).toString() + this.unit + '  ';
                }
                lastPosEnd = posI.end + 1;


            });
            $(this.input).val( w.trim() );
            $(this.input)[0].selectionStart = oldPos;
            $(this.input)[0].selectionEnd = oldPos;
        }
        else{
            $(this.input).val( ( JSON.parse(l[0].value) + 1) + l[0].unit );
        }
    }
    decreaseValue(l){
        let pos = [];
        let lastPosEnd = 0;
        let me = this;
        let posAt = 0;
        let oldPos = me.inp.selectionStart;
        if (l.length > 1){
            let w = '';
            $(l).each(function(mex,a){

                let posI = {
                    start:lastPosEnd,
                    end:(lastPosEnd+(this.value.length + this.unit.length))
                };
                pos.push(posI);

                if ( posI.start <= me.input.selectionStart-1 && posI.end >= me.input.selectionStart-1){
                    w += (JSON.parse(this.value) - 1).toString() + this.unit + '  ';
                }
                else{
                    w += (JSON.parse(this.value)).toString() + this.unit + '  ';
                }
                lastPosEnd = posI.end + 1;


            });
            $(this.input).val( w.trim() );
            $(this.input)[0].selectionStart = oldPos;
            $(this.input)[0].selectionEnd = oldPos;
        }
        else{
            $(this.input).val( ( JSON.parse(l[0].value) - 1) + l[0].unit );
        }
    }
}












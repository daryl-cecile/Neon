class colorpicker extends atomicElement{
    constructor(){
        super('atomic-color','colorpicker.xml');
        this.imageObj = new Image();
        let me = this;
        this.color = undefined;
        this.loadedMe = false;
        this.imageObj.onload = function(){
            me.init.call(me);
        };
        this.imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/color-picker.png';
    }
    init() {
        console.log(this);
        let imageObj = this.imageObj;
        let canvas = this.shadowRoot.getElementById('myCanvas');
        let context = canvas.getContext('2d');
        let mouseDown = false;
        let me = this;
        let padding = 0;
        this.loadedMe = true;

        this.input = $(this.shadowRoot).find('input')[0];
        this.div = $(this.shadowRoot).find('div')[0];

        this.input.addEventListener('click',function(){
            $(canvas).focus();
            $(me.div).toggleClass('active');
        });

        this.input.addEventListener('keyup',function(e){
            if (e.keyCode == 13){
                me.color = $(me.input).val();
                me.dispatchEvent(new CustomEvent('updated', {
                    bubbles: true,
                    composed: true,
                    detail: me.color
                }));
            }
        });

        this.div.addEventListener('mouseleave',function(){
            $(me.div).removeClass('active');
        });

        context.strokeStyle = '#444';
        context.lineWidth = 2;

        canvas.addEventListener('mousedown', function () {
            mouseDown = true;
        }, false);

        canvas.addEventListener('mouseup', function () {
            mouseDown = false;
        }, false);

        canvas.addEventListener('mousemove', function (evt) {
            let mousePos = me.getMousePos(canvas, evt);
            let color = undefined;

            if (mouseDown && mousePos !== null && mousePos.x > padding && mousePos.x < padding + imageObj.width && mousePos.y > padding && mousePos.y < padding + imageObj.height) {

                // color picker image is 256x256 and is offset by 10px
                // from top and bottom
                let imageData = context.getImageData(padding, padding, imageObj.width, imageObj.width);
                let data = imageData.data;
                let x = mousePos.x - padding;
                let y = mousePos.y - padding;
                let red = data[((imageObj.width * y) + x) * 4];
                let green = data[((imageObj.width * y) + x) * 4 + 1];
                let blue = data[((imageObj.width * y) + x) * 4 + 2];
                color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                me.drawColorSquare(canvas, color, imageObj);
            }
        }, false);

        context.drawImage(imageObj, padding, padding,200,200);
        this.drawColorSquare(canvas, 'white', imageObj);
    }
    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    drawColorSquare(canvas, color, imageObj) {
        let colorSquareSize = 20;
        let padding = 0;
        let context = canvas.getContext('2d');
        let squareX = 200;
        let squareY = 0;

        context.beginPath();
        context.fillStyle = color;
        this.color = color;
        $(this.input).val(this.color);
        let me = this;
        me.dispatchEvent(new CustomEvent('updated', {
            bubbles: true,
            composed: true,
            detail: me.color
        }));
        context.fillRect(squareX, squareY, colorSquareSize, 200);
    }
}
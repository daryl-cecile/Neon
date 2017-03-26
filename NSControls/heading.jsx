


creator.controls.core['Heading'] = (function() {
    return {
        icon:'heading',
        name:'heading',
        data:{
            control:'Heading',
            properties:[]
        },
        accepts:[],
        styles:['width','height','font','background','color','padding'],
        build:function(){
            return (
                <h1 d="true" e="heading">Heading</h1>
            )
        }
    };
})();


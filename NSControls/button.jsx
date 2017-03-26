

creator.controls.core['Button'] = (function() {
    return {
        icon:'button',
        name:'button',
        data:{
            control:'Button',
            properties:[]
        },
        accepts:[],
        styles:['width','height','font','background','color','border','borderRadius'],
        build:function(){
            return (
                <button e="button" d="true">Button</button>
            )
        }
    };
})();
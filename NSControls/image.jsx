


creator.controls.core['Image'] = (function() {
    return {
        icon:'image',
        name:'image',
        data:{
            control:'Image',
            properties:[]
        },
        accepts:[],
        styles:['width','height','background','color','margin'],
        build:function(){
            return (
                <img d="true" e="image" src="rand#09"/>
            )
        }
    };
})();


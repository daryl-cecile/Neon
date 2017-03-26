

creator.controls.core['Container'] = (function() {
    return {
        icon:'container',
        name:'container',
        data:{
            control:'Container',
            properties:[]
        },
        accepts:[],
        styles:['width','height','font','background','color','border','borderRadius','padding'],
        build:function(){
            return (
                <div e="container" d="true" c="true">

                </div>
            )
        }
    };
})();
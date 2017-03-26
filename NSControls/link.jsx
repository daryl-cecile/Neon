
creator.controls.core['Link'] = (function() {
    return {
        icon:'link',
        name:'link',
        data:{
            control:'Link',
            properties:[]
        },
        accepts:[],
        styles:['color','font','padding','align'],
        build:function(){
            return (
                <a e="link" d="true" c="true">This is a link</a>
            )
        }
    };
})();

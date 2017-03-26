creator.controls.core['Input'] = (function() {
    return {
        icon:'input',
        name:'input',
        data:{
            control:'Input',
            properties:[]
        },
        accepts:[],
        styles:[],
        build:function(){
            return (
                <input type="text" d="true" e="input" placeholder="type in me"/>
            )
        }
    };
})();
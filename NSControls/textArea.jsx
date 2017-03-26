


creator.controls.core['TextArea'] = (function() {
    return {
        icon:'textArea',
        name:'textArea',
        data:{
            control:'TextArea',
            properties:[]
        },
        accepts:[],
        styles:[],
        build:function(){
            return (
                <input type="text" d="true" e="textArea" name="text_element" placeholder="type in me"/>
            )
        }
    };
})();
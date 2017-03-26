

creator.controls.core['Radio'] = (function() {
    return {
        icon:'radio',
        name:'radio',
        data:{
            control:'Radio',
            properties:[]
        },
        accepts:[],
        styles:[],
        build:function(){
            return (
                <input d="true" e="radio" type="radio" name="radio_element"/>
            )
        }
    };
})();

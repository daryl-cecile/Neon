
creator.controls.core['Label'] = (function() {
    return {
        icon:'label',
        name:'label',
        data:{
            control:'Label',
            properties:[]
        },
        accepts:[],
        styles:['width','height','color'],
        build:function(){
            return (
                <label d="true" e="label">I am a label</label>
            )
        }
    };
})();
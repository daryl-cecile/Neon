
creator.controls.core['Paragraph'] = (function() {
    return {
        icon:'paragraph',
        name:'paragraph',
        data:{
            control:'Paragraph',
            properties:[]
        },
        accepts:[],
        styles:['color','font','padding'],
        build:function(){
            return (
                <p e="paragraph" d="true">
                    This is a Paragraph
                </p>
            )
        }
    };
})();

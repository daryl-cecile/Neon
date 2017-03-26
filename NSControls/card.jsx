

creator.controls.core['Card'] = (function() {
    return {
        icon:'card',
        name:'card',
        data:{
            control:'Card',
            properties:[]
        },
        accepts:['image','label','heading','paragraph','container'],
        styles:['width','height'],
        build:function(){
            return (
                <div class="card" e="card" d="true">
                    <img e="image" src="https://source.unsplash.com/category/summer" alt="Avatar" style="width:100%" d="true"/>
                    <div e="container" d="true" c="true">
                        <h4 e="heading" d="false">Title</h4>
                        <p e="paragraph" d="false">Description</p>
                    </div>
                </div>
            )
        }
    };
})();


creator.controls.core['Views'] = (function() {
    return {
        icon:'views',
        name:'views',
        data:{
            control:'Views',
            properties:[]
        },
        accepts:['view'],
        styles:[],
        build:function(){
            return (
                <div e="views" d="true" class="views">
                    <div d="false" e="view" class="view main-view">
                        <div className="pages" d="false">
                            <div className="page" d="false">
                                <div class="page-content" d="false" c="true">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };
})();

creator.controls.core['View'] = (function() {
    return {
        icon:'view',
        name:'view',
        data:{
            control:'View',
            properties:[]
        },
        accepts:[],
        styles:[],
        parentFit:['.views'],
        build:function(){
            return (
                <div d="true" e="view" class="view">
                    <div className="pages" d="false">
                        <div className="page" d="false">
                            <div class="page-content" d="false" c="true">

                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };
})();
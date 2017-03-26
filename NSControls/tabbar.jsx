

creator.controls.core['TabBar'] = (function() {
    return {
        icon:'tabBar',
        name:'tabbar',
        data:{
            control:'TabBar',
            properties:[]
        },
        accepts:[],
        styles:[],
        build:function(){
            return (
                <div d="true" e="toolbar" class="toolbar">
                    <div d="false" e="container" class="toolbar-inner" c="true">
                        <a d="true" e="link" href="#" class="link">Link 1</a>
                        <a d="true" e="link" href="#" class="link">Link 2</a>
                        <a d="true" e="link" href="#" class="link">Link 3</a>
                        <a d="true" e="link" href="#" class="link">Link 4</a>
                    </div>
                </div>
            )
        }
    };
})();
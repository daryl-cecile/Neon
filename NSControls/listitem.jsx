



creator.controls.core['ListItem'] = (function() {
    return {
        icon:'listItem',
        name:'listitem',
        data:{
            control:'ListItem',
            properties:[]
        },
        accepts:[],
        styles:[],
        build:function(){
            return (
                <div d="true" e="listitem" style="height:55px; overflow:hidden" class="card">
                    <img d="false" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=PIC&w=100&h=100" alt="Avatar" style="width:100px;display:inline-block;vertical-align: middle"/>
                    <div d="false" style="display: inline-block;vertical-align:middle;" e="container" c="true">
                        <p d="false" e="paragraph">Item</p>
                    </div>
                </div>
            )
        }
    };
})();

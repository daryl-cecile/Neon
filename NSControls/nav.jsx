creator.controls.core['Nav'] = (function() {
    return {
        icon:'nav',
        name:'nav',
        data:{
            control:'Nav',
            properties:[]
        },
        accepts:[],
        styles:[],
        build:function(){
            return (
                <div e="nav" d="true" class="navbar">
                    <div class="navbar-inner" d="false">
                        <div class="left">
                            <a href="#" class="link" e="link" d="true" c="true">
                                <i class="icon icon-back"></i>
                                <span e="paragraph">Back</span>
                            </a>
                        </div>
                        <div class="center" d="false" e="heading" c="true">Center</div>
                        <div class="right">
                            <a href="#" class="link" d="true" e="link" c="true">
                                <i class="icon icon-bars"></i>
                                <span e="paragraph">Menu</span>
                            </a>
                        </div>
                    </div>
                </div>
            )
        }
    };
})();
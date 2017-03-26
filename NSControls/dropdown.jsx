creator.controls.core['Dropdown'] = (function() {
    return {
        icon:'dropdown',
        name:'dropdown',
        data:{
            control:'select',
            properties:[]
        },
        accepts:[],
        styles:['width','height','font','background','color','border','borderRadius','padding'],
        build:function(){
            return (
                <select e="dropdown" d="true">
                    <option d="false" value="A">A</option>
                    <option d="false" value="A">B</option>
                    <option d="false" value="A">C</option>
                </select>
            )
        }
    };
})();
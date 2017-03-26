

const viewbox = {};

viewbox.show =function(){
    sidebar.show('App Views');
    let app = require('electron').remote.app;
    let fs = require('fs');
    let container = $('#toolbox');
    container.append($('<div smartList id="views"/>'));

    let path_to_views = path.join( app.getPath('documents') , 'Neon Studio Projects', app_manifest.name , "www" , "views");
    NeonCore.try(function(){ fs.mkdirSync(path_to_views) });
    let viewsList = fs.readdirSync(path_to_views).filter((file) => fs.lstatSync(path.join(path_to_views, file)).isDirectory());
    console.info(viewsList);
    viewsList.forEach(function(view){
        viewbox.addView(view);
    });
    container.animate({
        opacity:"1"
    },500);
};

viewbox.addView = function(name){
    let vContainer = $('#views');
    if (vContainer.length == 0) return;

    vContainer.append( 
        "<div>" +
        "   <p>"+name+"</p>" +
        "   <div>" +
        "       <span><i class='material-icons'>edit</i></span>" +
        "       <span><i class='material-icons'>delete</i></span>" +
        "   </div>" +
        "</div>"
     );

};
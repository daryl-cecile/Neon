


const net = {};

net.providers = {
    ping:require('ping'),
    servers:["8.8.8.8","8.8.4.4","google.com","yahoo.com","bing.com","amazon.com"],
    pointer:0,
    pollingRate:(1/3),
    get rate(){
        return 1000 / net.providers.pollingRate
    },
    resultate:function(){
        net.ping(function(isAlive){
            net.services.poll.forEach(function(i){
                i( isAlive );
            });
        });
        net.services.autoPing = setTimeout(net.providers.resultate,net.providers.rate);
    }
};

net.services = {
    ping:{
        isBusy:false
    },
    poll:[],
    autoPing:setTimeout(net.providers.resultate,net.providers.rate)
};

net.ping = function(ip, callback) {
    if (net.services.ping.isBusy) return;
    if (net.services.poll.length == 0) return;
    net.services.ping.isBusy = true;

    if (typeof ip === "function") {
        callback = ip;
        ip = net.providers.servers[net.providers.pointer];
        net.providers.pointer ++;
        if (net.providers.pointer > net.providers.servers.length-1) net.providers.pointer = 0;
    }

    net.providers.ping.sys.probe(ip, function(isAlive){
        net.services.ping.isBusy = false;
        callback(isAlive);
    },{
        timeout: 10
    });
};

net.registerListener = function (cb) {
    net.services.poll.push(cb);
};

net.deregisterListener = function (cb) {
    net.services.poll.splice(net.services.poll.indexOf(cb),1);
};
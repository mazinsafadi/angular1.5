var cluster = require('cluster');
if(cluster.isMaster){
//Count the Machine's CPU
var cpuCount = 3;//require('os').cpus().length;
console.log('cpuCount in this Machine is '+ cpuCount);
//Create a worker for each CPU
for(var i=0; i< cpuCount; i+=1){
cluster.fork();
}

cluster.on('online', function(worker) {
        //console.log('Worker ' + worker.process.pid + ' is online');
    });


cluster.on('exit', function(worker, code, signal) {  
    console.log('Worker %d died with code/signal %s. Restarting worker...', worker.process.pid, signal || code);
    cluster.fork();
});
}else {
//console.log('inside else statement');
	console.log('Process ' + process.pid + ' is listening to all incoming requests');
	require('./server.js');
}
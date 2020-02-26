var Service = require('node-windows').Service;

var svc = new Service({
  name:'insw_new11',
  description: 'Internet Switch - Automatically disable network for non-admin users - Created by Terren Gurule (ter.ren)',
  script: 'C:\\Program Files\\insw\\newservice\\service.js'
});
 
svc.on('install',function(){
  svc.start();
});
 
svc.install();
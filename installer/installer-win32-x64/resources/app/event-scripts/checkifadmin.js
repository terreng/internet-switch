const wincmd = require('node-windows');

function checkIfUserIsAdmin(username, callback) {

var exec = require('child_process').exec;

exec('net user "'+username+'" /DOMAIN', function(error, stdout, stderr){

var groups = stdout.split("Global Group memberships")[1].split("The command completed successfully.")[0].split("*");
groups.reverse()
groups.pop()
groups = groups.map(function(a) {return a.trim()})

console.log(groups)

exec('net localgroup Administrators', function(error, stdout2, stderr){

var administrators = stdout2;

var isadmin = false;

for (var i = 0; i < groups.length; i++) {
    if (administrators.indexOf(groups[i]) > -1) {
        isadmin = true;
    }
}

callback(isadmin);

});

});

}

checkIfUserIsAdmin("ekoch0319",function(res) {
    console.log(res)
})
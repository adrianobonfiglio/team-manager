var mysql = require('mysql');
exports.database = function() {
	var connection = mysql.createConnection({
	  host     : 'ip',
	  port: porta,
	  insecureAuth: true,
	  user     : '',
	  password : '',
	  database: ''
	});

	return connection;
}

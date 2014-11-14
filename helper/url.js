module.exports = function(usuario, params) {
	var options = {
	    host: 'ip',
	    port: porta,
	    path: params,
	    headers: {
	     'Authorization': 'Basic ' + new Buffer(usuario.login+ ':' + usuario.senha).toString('base64')
	   } 
	};

	return options
}
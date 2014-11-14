module.exports = function(app) {
	var async = require('async'); 
	var consultaService = app.services.consulta;
	DashboardController = {
		index : function(req, res) {
			var params = req.body;
			var r = null;
			if(req.params.id) {
				params = {sprint: req.params.id}
			}
			var result = null;
			async.waterfall([
				function(callback) {consultaService.issuesBySprint(req.session.usuario, params, function(err, retorno){
					r = retorno;
			    	callback(null, retorno);
				})},
				function(retorno, callback) {consultaService.chamadosByNumeros(r.projects, function(err, ret) {
					result = {list: ret.projects, params: params};
					callback(null, result);
		    	})},
		    	function(result, callback) {
		    		res.render('dashboard/index', result);
		    	}
			]);

		}
	}

	return DashboardController
}
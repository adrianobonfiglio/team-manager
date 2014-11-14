module.exports = function(app) {
	var consultaService = app.services.consulta;
	ConsultaController = {
		index : function(req, res){
			consultaService.versionsByProject(req.session.usuario, function(err, body) {
				if(err != null) {
					console.log(err);
					res.redirect('/login');
				} else {
					var js = JSON.parse(body);
					var params = {list: js};
					res.render('consulta/index', params)
				}

			});
		},

		consultaSprint : function(req, res) {
			var params = {sprint: req.params.id};
			consultaService.issuesBySprint(req.session.usuario, params, function(err, retorno){
		    	var ret = {list: retorno.issues, params: params}
			    res.render('consulta/issues', ret)
			});
		},

		opened : function(req, res) {
			var params = {sprint: req.params.id};
			consultaService.findOpenedIssues(req.session.usuario, params, function(err, retorno) {
				if(err != null) {
					console.log(err);
					res.redirect('/login');
				} else {
					var ret = {list: retorno, params: params}
					res.render('consulta/andamento', ret)
				}

			});			
		},

		categoriaDefeitos : function(req, res) {
			var params = {sprint: req.params.id};
			consultaService.findDefeitosRetrabalhos(req.session.usuario, params, function(err, retorno) {
				if(err != null) {
					console.log(err);
					res.redirect('/login');
				} else {
					var ret = {defeitos: retorno.defeitos, retrabalhos: retorno.retrabalhos, params: params}
					console.log(ret);
					res.render('consulta/defeitos', ret)
				}				
			})
		},

		demandaVsRetrabalho : function(req, res) {
			var params = {sprint: req.params.id};
			consultaService.demandaVsRetrabalho(req.session.usuario, params, function(err, retorno) {
				if(err != null) {
					console.log(err);
					res.redirect('/login');
				} else {
					console.log(retorno);
					res.render('consulta/tempos', retorno);
				}				
			})
		}		
		
	}

	return ConsultaController
}
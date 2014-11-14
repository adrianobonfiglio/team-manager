module.exports = function(app) {
	var consulta = app.controllers.consulta;

  	var router = app.get('router');

	router.get('/consulta', consulta.index);

	router.post('/consulta/sprint', consulta.consultaSprint);

	router.get('/issues/sprint/:id', consulta.consultaSprint);

	router.get('/issues/opened/:id', consulta.opened);

	router.get('/consulta/defeitos/:id', consulta.categoriaDefeitos);

	router.get('/consulta/demandaVsRetrabalho/:id', consulta.demandaVsRetrabalho);

}

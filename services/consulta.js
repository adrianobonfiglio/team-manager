module.exports = function(app) {
	var urlHelper = require('../helper/url');
	var urlChamadoHelper = require('../helper/urlChamados');
	var conn = require('../helper/database');
	var http = require('http');

	var ConsultaService = {
		issuesBySprint : function(usuario, params, callback) {
			var clause = "/projects/safetech/issues.json?include=relations&status_id=*&limit=100&set_filter=1&sort=project%2Cid%3Adesc&fixed_version_id="+params.sprint
			var options = urlHelper(usuario, clause);
			http.get(options, function(res){

				var retorno  = {};
			    var body = "";

			    res.on('data', function(data) {
			        body += data;
			    });
			    
			    res.on('end', function() {
				    var projects = {};
				    var issues = [];
					var js = JSON.parse(body);
					var total = 0
					js.issues.forEach(function(iss, i) {
						findNumeroSolicitacaoByIssueId(iss.id, function(err, ret) {
							var issue = issue = app.models.issue;
							issue = {}
							issue.id = iss.id;
							issue.projectName = iss.project.name;
							issue.trackerName = iss.tracker.name;
							issue.statusName = iss.status.name;
							issue.subject = iss.subject,
							issue.priorityName = iss.priority.name,
							issue.estimatedHours = iss.estimated_hours
							issue.numeroSolicitacao = ret.numeroSolicitacao;
							issue.spentHours = ret.spentHours;

							issues[i] = issue;

							var hour = parseFloat(issue.estimatedHours);
							if(isNaN(hour)) {
								hour = 0
							}
							total += hour;
							if(issue.projectName in projects) {
								var project = projects[issue.projectName];
								project.nome = issue.projectName;
								project.issues = project.issues + 1;
								project.estimatedHours += hour;
								project.timeEntries += parseFloat(issue.spentHours);
								project.timeEntries = Math.round(project.timeEntries);
								if(issue.trackerName === "Retrabalho") {
									project.reworkHours += parseFloat(issue.spentHours);
									project.reworkHours = Math.round(project.reworkHours);
								}
								if(issue.statusName === "Fechada") {
									project.closedIssues += 1;
								}
								if(issue.statusName === "Homologação") {
									project.homologIssues += 1;
								}			
								if((issue.trackerName === "Demanda") || (issue.trackerName === "Melhoria")) {
									project.demandaIssues += 1;
								}else if(issue.trackerName === "Defeito") {
									project.defeitoIssues += 1;
								}																							
								if(project.servicesList.indexOf(issue.numeroSolicitacao) == -1) {
									project.servicesList[project.servicesList.length] = issue.numeroSolicitacao;
								}
								projects[issue.projectName] = project;
							} else {
								var project = app.models.dataProject;
								project = {};
								project.nome = issue.projectName;
								project.issues = 1;
								project.estimatedHours = hour;
								project.closedIssues = 0;
								project.timeEntries = parseFloat(issue.spentHours);
								project.demandaIssues = 0;
								project.defeitoIssues = 0;

								if(issue.statusName === "Retrabalho") {
									project.reworkHours = parseFloat(issue.spentHours);
								} else {
									project.reworkHours = 0;
								}
								if(issue.statusName === "Fechada") {
									project.closedIssues = 1;
								}
								if(issue.statusName === "Homologação") {
									project.homologIssues = 1;
								}
								if((issue.trackerName === "Demanda") || (issue.trackerName === "Melhoria")) {
									project.demandaIssues = 1;
								}else if(issue.trackerName === "Defeito") {
									project.defeitoIssues = 1;
								}																

								project.servicesList = [issue.numeroSolicitacao];								
								projects[issue.projectName] = project;
							}

							if(i === (js.issues.length -1)) {
								retorno = {issues: issues,projects: projects, total: total};	    	
			        			callback(null, retorno);
							}														
						});

					});

			    });

			    res.on('error', function(e) {
			        callback(e, null);
			    })
			});
		},

		versionsByProject : function(usuario, callback) {
			var clause = "/projects/safetech/versions.json";
			var options = urlHelper(usuario, clause);
			console.log(options);
			http.get(options, function(res){

			    var body = "";
			    res.on('data', function(data) {
			        body += data;
			    });
			    
			    res.on('end', function() {
			    	if(body === " ") {
			    		callback("erro ao consultar", body);
			    	} else {
			    		callback(null, body);
			    	}
			        
			    });

			    res.on('error', function(e) {
			        callback(e, null);
			    })
			});
		},

		chamadosByNumeros : function(projects, callback) {
			console.log("CHAMADOSS");
			var size = Object.keys(projects).length;
			console.log(size);
			var i = 0
/*			for(var p in projects){
				i++;
				var project = projects[p];
				console.log(project.nome);
				var clause = "solucaoChamado/findSolucoes?date=2014-08-28&numeros="+project.servicesList;
				var options = urlChamadoHelper(clause);
				http.get(options, function(res){

				    var body = "";
				    res.on('data', function(data) {
				        body += data;
				    });
				    
				    res.on('end', function() {
				    	var js = JSON.parse(body);
				    	var hours = 0;
				    	js.forEach(function(obj, i) {
				        	var hour = parseFloat(obj.horasTempoSolucao);
				        	var min = parseFloat("0."+obj.minutosTempoSolucao);
				        	hours += (hour+min);
				    	});
				        project.servicesHours = hours;
				        projects[p] = project;
				    	
				        if(i === size) {
				        	console.log("RETORNO");
				        	callback(null, {projects: projects});
				        }
				    });

				    res.on('error', function(e) {
				        callback(e, null);
				    })
				});			
			}
			*/
			callback(null, {projects: projects});

		},

		findOpenedIssues : function(usuario, params, callback) {
			var clause = "/projects/safetech/issues.json?status_id=2&fixed_version_id="+params.sprint
			var options = urlHelper(usuario, clause);
			http.get(options, function(res){

				var retorno  = {};
			    var body = "";

			    res.on('data', function(data) {
			        body += data;
			    });
			    
			    res.on('end', function() {
				    var projects = {};
				    var issues = [];
					var js = JSON.parse(body);
					var total = 0
					js.issues.forEach(function(iss, i) {
						findJournalsByIssue(usuario, iss.id, function(err, ret) {
							var estimated = parseInt(iss.estimated_hours);
							var days = Math.round(estimated / 8);
							var now = new Date()
							now.setHours(0);
							now.setMinutes(0);
							now.setSeconds(0);

							console.log("NOW "+now);
							if(isNaN(days)) {
								days = 0;
							}
							var date
							if(ret != null) {
								date = new Date(ret.created_on.match(/\d{4}-\d{2}-\d{2}/));
							} else {
								date = new Date()
							}
							date.setHours(0);
							date.setMinutes(0);
							date.setSeconds(0);

							date.setDate(date.getDate() + days);
							console.log(date);

							var resultado
							if(now.toString() == date.toString()) {
								resultado = 0
							}else if(date > now) {
								resultado = 1
							}else if(date < now) {
								resultado = -1
							}

							var issue = app.models.issue;
							issue = {}
							issue.id = iss.id;
							issue.projectName = iss.project.name;
							issue.trackerName = iss.tracker.name;
							issue.statusName = iss.status.name;
							issue.subject = iss.subject,
							issue.priorityName = iss.priority.name,
							issue.estimatedHours = iss.estimated_hours
							issue.startDate = date.getDate()+"/"+date.getMonth()+"/"+date.getYear()
							issue.late = resultado;
							if(ret) {
								issue.changedBy = ret.user.name;
							}

							issues[i] = issue;

							if(i === (js.issues.length -1)) {
								callback(null, issues)
							}
						});
					});

			    });

			    res.on('error', function(e) {
			        callback(e, null);
			    })
			});			
		},

		findDefeitosRetrabalhos : function(usuario, params, callback) {
			var clause = "/projects/safetech/issues.json?set_filter=1&f[]=tracker_id&op[tracker_id]=%3D&v[tracker_id][]=1&v[tracker_id][]=12&f[]=fixed_version_id&op[fixed_version_id]=%3D&v[fixed_version_id][]="+params.sprint+"&status_id=*"
			var options = urlHelper(usuario, clause);
			http.get(options, function(res){

				var retorno  = {};
			    var body = "";

			    res.on('data', function(data) {
			        body += data;
			    });
			    
			    res.on('end', function() {
				    var projects = {};
				    var issues = [];
					var js = JSON.parse(body);
					var total = 0
					var tipoRetrabalho = [];
					var tipoDefeito = [];
					js.issues.forEach(function(iss, i) {
						iss.custom_fields.forEach(function(custom, j) {
							if(custom.id == "15") {
								custom.value.forEach(function(val, k) {
									if(!(val in tipoDefeito)) {
										tipoDefeito[val] = 1
									} else {
										tipoDefeito[val] += 1
									}
								})
							}
							if(custom.id == "14") {
								custom.value.forEach(function(val, k) {
									if(!(val in tipoRetrabalho)) {
										tipoRetrabalho[val] = 1
									} else {
										tipoRetrabalho[val] += 1
									}
								})								
							}
						});
						if(i === (js.issues.length -1)) {
							var retorno = {defeitos: tipoDefeito, retrabalhos: tipoRetrabalho}
							callback(null, retorno);
						}						
					});

			    });

			    res.on('error', function(e) {
			        callback(e, null);
			    })
			});			
		},

		demandaVsRetrabalho : function(usuario, params, callback) {
			var clause = "/projects/safetech/issues.json?include=relations&status_id=*&limit=100&set_filter=1&sort=project%2Cid%3Adesc&fixed_version_id="+params.sprint
			var options = urlHelper(usuario, clause);
			http.get(options, function(res){

				var retorno  = {};
			    var body = "";

			    res.on('data', function(data) {
			        body += data;
			    });
			    
			    res.on('end', function() {
				    var projects = {};
				    var issues = [];
					var js = JSON.parse(body);
					var total = 0
					var totalRet = 0;
					var totalDem = 0;
					js.issues.forEach(function(iss, i) {
						if(iss.status.name === "Fechada" || iss.tracker.name === "Homologação") {
							findSpentHours(iss, usuario, function(ret) {
								if(iss.tracker.name === "Retrabalho") {
									totalRet += ret;
								} else {
									totalDem += ret;
								}
								if(i === (js.issues.length -1)) {
									var percent = (totalRet * 100) / totalDem
									callback(null, {retrabalhos: Math.round(totalRet), 
										demandas: Math.round(totalDem), percent: Math.round(percent)});
								}
							});
						}

					});

			    });

			    res.on('error', function(e) {
			        callback(e, null);
			    })
			});
		},

	}

	var findJournalsByIssue = function(usuario, id, callback) {
		var clause = "/issues/"+id+".json?include=journals"
		var options = urlHelper(usuario, clause);
		http.get(options, function(res){

		    var body = "";
		    res.on('data', function(data) {
		        body += data;
		    });
		    
		    res.on('end', function() {
		    	if(body === " ") {
		    		callback("erro ao consultar", body);
		    	} else {
		    		var js = JSON.parse(body);
		    		var result = null;
					js.issue.journals.forEach(function(j, i) {
						j.details.forEach(function(d, i){
							if(d.name == "status_id") {
								if(d.new_value == "2") {
									result = j;
								}
							}
						});
						if(i === (js.issue.journals.length - 1)) {
		    			   callback(null, result);
		    			}
					});		    		
		    	}
		        
		    });

		    res.on('error', function(e) {
		        callback(e, null);
		    })
		});		
	}

	var findNumeroSolicitacaoByIssueId = function(id, callback) {
		var db = conn.database();
		db.connect();
		var numeroSolicitacao = null
		var spentHours = null
		db.query("select sum(s.hours) as hours, numero_solicitacao from time_entries s, issues i where i.id ="+id+" and i.id = s.issue_id", function(err, rows, fields) {
		  if (err) throw err;
		  numeroSolicitacao = rows[0].numero_solicitacao;
		  spentHours = rows[0].hours
		  if(spentHours != null) {
		  	spentHours = spentHours.toFixed(1);
		  }else {
		  	spentHours = 0;
		  }
		  callback(err, {numeroSolicitacao: numeroSolicitacao, spentHours: spentHours})
		});
		
		db.end();
	}

	var findSpentHours = function(issue, usuario, callback) {
			var hours = false
			var clause = "/issues/"+issue.id+".json"
			var options = urlHelper(usuario, clause);
			http.get(options, function(res){

			    var body = "";
			    res.on('data', function(data) {
			        body += data;
			    });
			    
			    res.on('end', function() {
			    	if(body === " ") {
			    		callback("erro ao consultar", body);
			    	} else {
			    		var js = JSON.parse(body);
						hours = parseFloat(js.issue.spent_hours);;
						callback(hours);
			    	}
			        
			    });

			    res.on('error', function(e) {
			        callback(e, null);
			    })
			});
	}	

	return ConsultaService
}
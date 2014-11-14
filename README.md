# Team Manager

Este projeto tem como objetivo realizar comunicação e obtenção de dados do Redmine para realizar, gráficos, dashboards, entre outros dados de gerenciamento.

## Pré-requisitos
[Node.js](http://nodejs.org)

[Git](http://git-scm.com/)

## Preparando o ambiente
* baixe o projeto: `git clone git@bitbucket.org:abonfiglio/team-manager.git`
* instale as dependências: `cd team-manager && npm install`
* inicie o projeto: `npm start`

## Iniciando
Seu fluxo de trabalho pode ser de N maneiras, uma delas é a seguinte:

* Crie um novo branch (local): `git checkout -b new-task`
* Trabalhe nesse novo branch: `new-task`
* Adicione todos os arquivos que deseja commitar: `git add a, b, c` ou `git add *`
* Realize o commit (local): `git commit -m "minha mensagem"`
* Vá para o branch master e atualize-o: `git checkout master && git pull`
* No master, faça merge com o branch criado (new-task): `git merge new-task`
* Caso ocorra conflito, corrija, depois submeta para o servidor: `git push`

## ÚTIL
[Git- SCM](http://git-scm.com/)

[Git - Guia prático](http://rogerdudler.github.io/git-guide/index.pt_BR.html)

[Node.js Documentation](http://nodejs.org/documentation/)

[NPM - Node Packaged Modules](http://npmjs.org/)

[Express.js](http://expressjs.com/)

[Redmine REST API](http://www.redmine.org/projects/redmine/wiki/Rest_api)

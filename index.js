const express = require('express');

const server = express();
server.use(express.json()); //permitindo que as apis aceitem JSON
const projects = []; //definindo array de projetos
var reqQuantidade = 0;

server.use((req,res,next) =>{
  reqQuantidade++;
  console.log(`Total de ${reqQuantidade} requisições`);
  return next();
});


function checkId(req,res,next){ //Middware para chegar se esta vindo ID na requisição
  const {id} = req.params // pega id vindo por parametro
 
 if(!id){ //se não estiver vindo ID
    return res.status(400).json({error: "Has'nt id in request"}); // Erro
  }
  return next(); //se estiver vindo id, chama o proximo
}


server.post('/projects',(req,res) =>{
  const {id, title} = req.body; //pegando dados da requisição post

  const project = { //definindo projeto com os dados vindo do post
    id,
    title,
    tasks: []
  };

  projects.push(project); //adicionando o projeto ao array projects

  return res.json(projects); //retornando todos os projetos
});


server.post('/projects/:id/tasks',checkId,(req,res) =>{ //roda para adicionar tasks
  const { tasks } = req.body; //recebe as tasks via post pelo body da requisição
  const { id } = req.params; //recebe o parametro relacionado a task

  const project = projects.find(p => p.id == id); //busca o projeto dentro do array projects e traz
  project.tasks = [tasks]; //insere o valor de tasks no projeto

  return res.json(project); //retorna o projeto
})

server.get('/projects', (req,res)=>{ //rota trazendo todos os projetos
  return res.json(projects); //retorna json com todos projetos
});


server.get('/projects/:id',checkId, (req,res) =>{
    const {id} = req.params

    const project = projects.find(p => p.id == id);
    return res.json(project);
})


server.put('/projects/:id',checkId, (req,res) =>{ //rota put para alterar projeto
  const { id } = req.params; //recebendo o id vindo por parametro
  const { title } = req.body; // recebendo a alteração via body

  const project = projects.find(p => p.id == id); // procurando um projeto cujo id seja o que veio por parametro

  project.title = title; //definindo novo valor title para o projeto conforme veio a alteração

  return res.json(project); // retornando projeto alterado

})




server.delete('/projects/:id',checkId, (req,res)=>{ //rota para deletar projeto
  const { id } = req.params; //recebendo id do projeto via parametro

  const projectIndex = projects.findIndex(p => p.id == id); //procurando o index do array cujo id seja o que veio por parametro

  projects.splice(projectIndex, 1); //apagando 1 valor do index do projeto

  return res.send(); //retornando codigo 200 ok
})



server.listen(3004);
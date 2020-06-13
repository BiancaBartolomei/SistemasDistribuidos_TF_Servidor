const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const port = 3300; //porta padrão
const { Pool, Client } = require('pg')
const connectionString = 'postgresql://postgres:suasenha@localhost:5432/trabalho_sd'
const pool = new Client({
  connectionString: connectionString,
})

pool.connect()



//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router); // requisições que chegam na raiz devem ser enviadas para o router

router.get('/users', (req, response) =>{
  pool.query('SELECT * FROM users', (err, res) => {
    // pool.end()
    response.json(res.rows)

  })
  
})

router.delete('/deleteUsers/:id', (req, response) =>{
  const id = parseInt(req.params.id);
  pool.query(`DELETE FROM users where id=${id}`, (err, res) => {
    pool.end()
    response.json(res.rows)

  })
  
})

router.post('/createRequest', (req, response) => {
  const user_id = req.body.userId;
  const name = req.body.name;
  const cnpj = req.body.cnpj;
  const area = parseInt(req.body.area);
  const endereco = req.body.endereco;
  const maxQnt = parseInt(req.body.maxQnt);

  const text = `INSERT INTO public.requests (user_id, name, cnpj, area, endereco, max_qnt) 
                VALUES ('${user_id}', '${name}', '${cnpj}', '${area}', '${endereco}', '${maxQnt}')`

  console.log(req.body)
  pool.query(text, (err, res) => {
    response.json(res)
    if(err){
      console.log(err)
    }

  })
})

router.patch('/place/:id', (req, response) =>{
  const id = parseInt(req.params.id);
  const name = req.body.name.substring(0,150);
  const cnpj = req.body.cnpj.substring(0,11);
  const area = parseInt(req.body.area.substring(0,50));
  const max_qnt = req.body.max_qnt.substring(0,50);
  
  pool.query(`UPDATE places SET name='${name}',cnpj='${cnpj}',area=${area},max_qnt='${max_qnt}' WHERE id=${id}`, (err, res) => {
      // pool.end()
      response.json(res)
      console.log(res)
    })
 
})


router.get('/place/:name', (req, response) =>{

  // Have to install pg_trgm: CREATE EXTENSION pg_trgm;
  pool.query(`SELECT * FROM places WHERE similarity(name, '${req.params.name.replace("_", " ")}') > 0.5`, (err, res) => {
      // pool.end()
      response.json(res.rows)
    })
    console.log("Get places")
 
})


router.get('/favourites/:id', (req, response) =>{

  // Have to install pg_trgm: CREATE EXTENSION pg_trgm;
  pool.query(`select * from places join favourites on (places.place_id = favourites.place_id) where user_id = '${req.params.id}'`, (err, res) => {
  // pool.end()
  response.json(res.rows)

})
console.log("Get favourites")
     
    })

router.get('/allRequests', (req, response) =>{
  pool.query(`SELECT r.name as name, r.cnpj as cnpj, u.name as username, r.area as area, r.endereco, r.max_qnt 
  FROM requests r join users u on u.user_id = r.user_id`, (err, res) => {
      // pool.end()
      response.json(res.rows)
    })
    console.log("Get places")
 
})

router.post('/request', (req, response) =>{
  const id = parseInt(req.params.id);
  console.log(req.body.name)
  const user_id = req.body.user;
  const name = req.body.name;
  const cnpj = req.body.cnpj;
  const area = parseInt(req.body.area);
  const max_qnt = req.body.max_qnt;
  console.log(name)
  
  pool.query(`INSERT INTO requests VALUES (id=${id}, user_id='${user_id}', name='${name}',cnpj='${cnpj}',area=${area},max_qnt='${max_qnt}')`, (err, res) => {

      // pool.end()
      response.json(res.rows)

    })
    console.log("Get favourites")
 
})

router.get('/favourite/:user_id&:place_id', (req, response) =>{
  const user_id = req.params.user_id;
  const place_id = req.params.place_id;

  pool.query(`select * from favourites where ( user_id = '${user_id}' and place_id = '${place_id}')`, (err, res) => {
      response.json(res.rows)
      if(err){
        console.log(err)
      }
    })

    console.log("Get favourite")
 
})

router.post('/favourite', (req, response) => {
  const user_id = req.body.user_id;
  const place_id = req.body.place_id;

  const text = `INSERT INTO public.favourites (user_id, place_id) 
                VALUES ('${user_id}', '${place_id}')`

  console.log(req.body)
  pool.query(text, (err, res) => {
    response.json(res)
    if(err){
      console.log(err)
    }

  })

  console.log("Post favourite")
})


router.delete('/favourite/:user_id&:place_id', (req, response) =>{
  const user_id = req.params.user_id;
  const place_id = req.params.place_id;

  pool.query(`DELETE from favourites where ( user_id = '${user_id}' and place_id = '${place_id}')`, (err, res) => {
      response.json(res.rows)
      if(err){
        console.log(err)
      }
    })

    console.log("Delete favourite")
 
})


router.post('/login', (req, response) => {
  const email = req.body.email
  const senha = req.body.senha
  const text = `SELECT * FROM public.users WHERE email ='${email}' and password='${senha}' `


  pool.query(text, (err, res) => {
    response.json(res.rows)

  })
})

router.post('/createUser', (req, response) => {
  const nome = req.body.nome
  const cpf = req.body.cpf
  const telefone = req.body.telefone
  const email = req.body.email
  const senha = req.body.senha

  const text = `INSERT INTO public.users(
    name, cpf, email, password)
    VALUES ('${nome}', '${cpf}', '${telefone}', '${email}', '${senha}')`
  
  pool.query(text, (err, res) => {
    response.json(res)
  })
})

//inicia o servidor

app.listen(port);

console.log('API funcionando!');



require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log('Conectei a base de dados!')
    app.emit('ready')
  }) 
  .catch(e => console.log(e)) //Lembrar de criar uma página com erro (em html e css)

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const routes = require('./routes')
const path = require('path')
//const helmet = require('helmet') --> incluir na hora de por o site pra funcionar
const csrf = require('csurf')
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware')
const sessionOptions = session({
  secret: 'askdjfnasdhrgwahofrgdf',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
})

//app.use(helmet()) --> incluir na hora de por o site pra funcionar
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(sessionOptions)
app.use(flash())
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')
app.use(csrf())
//Nossos próprios middlewarer
app.use(middlewareGlobal) //está disponível em todos os locais
//app.use('/nesselocal', middlewareGlobal) //está disponível somente em (/nesselocal)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

app.on('ready', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000')
    console.log('Servidor executando na porta 3000')
  })
})

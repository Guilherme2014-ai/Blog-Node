// Mudanças Necessarias Para Fazer Deploy da Aplicação
// const PORT = process.env.PORT || 8089, dar um npm init e add start nos scripts e mudar o banco de dados.

const express = require ('express')
const app = express ()
const PORT = process.env.PORT || 8089
const mongoose = require ('mongoose')
const session = require ('express-session')
const flash = require ('connect-flash')
const handlebars = require ('express-handlebars')
const bodyparser = require ('body-parser')
const db = require ('./config/db')
const path = require ('path')

//============================Rotas===================================
const admin = require ('./routes/admin')
const usuario = require ('./routes/usuario')
 
//===========================Models===================================
require ('./models/postagens') // Diretório
const postagens = mongoose.model ('postagens') // Nome da Collection
require ('./models/categorias')
const categorias = mongoose.model ('categorias')

//==========================Passport==================================
const passport = require ('passport')
require ('./config/auth')(passport)

//====================================================================


// Configurações:

    // Session:
        app.use (session({
            secret: 'curso de node',
            resave: true,
            saveUninitialized: true
        }))

        app.use (passport.initialize())
        app.use (passport.session())

        app.use (flash())

    // Body-Parser:
        app.use (bodyparser.urlencoded({extended: true}))
        app.use (bodyparser.json())

    // Handle-Bars:
        app.engine ('handlebars', handlebars({defaultLayout: 'main'})) 
        app.set ('view engine', 'handlebars')                           /* ROTAS SEMPRE ABAIXO DAS CONFIGURAÇÕES */

    // Mongoose:
        mongoose.Promise = global.Promise;
        mongoose.connect (db.mongoURI).then (() => {
            console.log ('Conectado Com Sucesso (MONGO)')
        }).catch ('Falha ao  Se Conectar (MONGO)')
    
    // Middleware:
        app.use ((req,res, next) => {
            console.log ('im here')
            res.locals.success_msg = req.flash ('success_msg')
            res.locals.error_msg = req.flash ('error_msg')
            res.locals.error = req.flash ('error')
            res.locals.user = req.user || null
            next()
        })

    // Public:
        app.use (express.static('public')) // Necessario Para Poder Acessar a Pasta 'Public'.

// Outros:
    app.get ('/', (req, res) => {
        postagens.find().lean().populate('categoria').then((postagens) => {
            res.render ('layouts/admin/index',{postagens:postagens})
        })
        })

    app.get ('/postagens/:slug', (req ,res) => {
        const slug = req.params.slug // Novo Jeito de mostrar o banco de dados
        postagens.findOne ({slug: slug}).then((postagens) => {
            if (postagens){
                const post ={
                    titulo: postagens.titulo,
                    data: postagens.data,
                    conteudo: postagens.conteudo
                }
                res.render ('postagem/index',{post:post})
            }
        }).catch((erro) => {
            req.flash ('error_msg','Algo Deu Errado ,_,. ERRO:' + erro)
            console.log("algo de errado" + erro)
            res.redirect ("/")
        })
        })
    app.get ('/categorias', (req ,res) => {
        categorias.find().lean().then((categorias) => {
        res.render ('categorias/index', {categorias: categorias})
        }).catch((erro) => {
            req.flash ('error_msg','Houve Um Erro Interno !')
        })
    })
    app.get ('/categorias/:slug', (req, res) => {
        const slug = req.params.slug
        categorias.findOne({slug: slug}).then((categorias) => { // Escolhe uma Categoria q tenha o slug igual ao "req.params.slug"
            postagens.find({categoria: categorias}).lean().then((postagens) => { // escolhe uma postagem q tenha o campo "categoria" igual a categoria acima
                res.render ("categorias/postagem",{postagens:postagens})

            }).catch((erro) => {
                req.flash ('error_msg','Erro ao achar Categoria !')
                res.redirect ('/')
            })
            }).catch((erro) => {
                req.flash ('error_msg','Erro ao achar Postagens !')
                res.redirect ('/')
            })
    })
    app.get ('/error_404',(req, res) => {
        res.render ('error_404/error_404')
    })
    app.get ('/logout',(req, res) => {
        req.logOut()
        req.flash ('success_msg','Deslogado.')
        res.redirect('/')
    })
    app.use ('/admin', admin)
    app.use ('/usuario', usuario)

// Porta:
    app.listen (PORT,() => {
        console.log ('Rodando !')
})

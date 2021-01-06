const router = require('express').Router()
const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const bcrypt = require ('bcryptjs')
const { route } = require('./admin')
const passport = require('passport')
//========================================
require ('../models/usuario')
const usuario = mongoose.model ('usuarios') // Nome Da Collection
//========================================

router.get ('/registro', (req, res) => {
    res.render ('usuarios/registro')
})

router.post ('/registro', (req, res) => {
    usuario.findOne({email: req.body.email}).then((usuarios) => {
        const erros = []

    if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined){
        erros.push ({
            texto: 'O Campo Nome Esta Invalido ou Nulo !'
        })
    }
    if (!req.body.email || req.body.email == null || typeof req.body.email == undefined){
        erros.push ({
            texto: 'O Campo Email Esta Invalido ou Nulo !'
        })
    } 
    if (!req.body.senha || req.body.senha == null || typeof req.body.senha == undefined){
        erros.push ({
            texto: 'O Campo Senha Esta Invalido ou Nulo !'
        })
    }
    if (!req.body.senha2 || req.body.senha2 == null || typeof req.body.senha2 == undefined){
        erros.push ({
            texto: 'O Campo Redefinir Senha Esta Invalido ou Nulo !'
        })
    }
    if (req.body.senha.length < 4){
        erros.push ({
            texto: 'Senha Curta demais !'
        })
    }
    if (req.body.senha2 != req.body.senha){
        erros.push ({
            texto: 'As Senhas Nao Condizem !'
        })
    }
    if (usuarios){
        erros.push ({
            texto: 'Email Ja Cadastrado !'
        })
    }
    if (erros.length > 0){
        res.render ('usuarios/registro',{erros:erros})
    }
    else {
               const novousuario = { // Isso nao precisa da um find
               nome: req.body.nome,
               email: req.body.email,
               senha: req.body.senha
            }
           
           bcrypt.genSalt(10,(erro, salt) => {
            bcrypt.hash(novousuario.senha, salt, (erro,hash) => {
                if (erro){
                    console.log (`${erro}`)
                    req.flash ('error_msg','Erro Ao Salvar Contar !')
                    res.redirect('/usuario/registro')
                }
                else{
                    //novousuario.senha = hash
                    new usuario(novousuario).save().then(() => {
                        req.flash ('success_msg', 'Salvo Com Sucesso !')
                        res.redirect('/')
                    }).catch((erro) => {
                        console.log (`${erro}`)
                        req.flash ('error_msg','Erro ao Salvar !')
                    })
                }
            })
        })           
        }
    })  
})

router.get ('/login', (req, res) => {
    res.render ('usuarios/login')
})

router.post ('/login',(req, res, next) => {
    passport.authenticate ('local', {
        successRedirect: '/',
        failureRedirect: '/usuario/login',
        failureFlash: true,
    })(req, res, next)
    const emailusuario = {
        email: req.body.email
    }
    console.log(`${emailusuario.email}`)
})

module.exports = router
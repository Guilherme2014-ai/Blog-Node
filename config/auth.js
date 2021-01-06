const localStrategy = require ('passport-local').Strategy
const mongoose = require ('mongoose')
const bcript = require ('bcryptjs')
// ===================================
require ('../models/usuario')
const usuario = mongoose.model('usuarios')
// ===================================

module.exports = (passport) => {
    passport.use (new localStrategy({usernameField: 'email', passwordField: 'senha' /*== req.body.email && req.body.senha*/}, (email, senha, done) => {
        usuario.findOne({email: email /*email: req.body.email*/}).then((usuario) => {
            if (!usuario){
                return done(null, false, {message: 'Esta Conta Nao Existe !'})
            }
            if (senha == usuario.senha){
                return done(null, usuario, {message: 'Cadastrado Com Sucesso !'})
            }
            if (usuario.eAdmin == 1){
                return done(null, usuario, {message: 'Bem-Vindo Adm !'})
            }
            else {
                return done(null, false, {message: 'Senha Incorreta !'})
            }
        })
    }))

    passport.serializeUser((usuario,done) => {
        done(null, usuario)
    })
    passport.deserializeUser((id, done) => {
        usuario.findById(id, (erro, usuario) => {
            done(erro, usuario)
        })
    })
}
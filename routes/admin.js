const express = require('express')
const app = express()
const router = require ('express').Router()
const mongoose = require ('mongoose')
const {eAdmin} = require ('../helpers/eAdmin')

//===============================================
require ('../models/categorias') // Diretório
const categoria = mongoose.model ('categorias') // Nome da Collection
//===============================================
require ('../models/postagens') // Diretório
const postagens = mongoose.model ('postagens') // Nome da Collection
//===============================================

router.get ('/categorias', eAdmin, (req, res) => {
    
    categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render ('layouts/admin/categorias', {categorias: categorias.map (categorias => categorias.toJSON())})
        
    }).catch((erro) => {
        req.flash ('error_msg','Erro ao Listar Categoria !')
        res.redirect ('/admin')
    })
})
router.get ('/categorias/add', eAdmin, (req, res) => {
    res.render ('layouts/admin/addcategorias')
})
router.get ('/categorias/edit/:id', eAdmin, (req, res) => {
    categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render ('layouts/admin/editcategorias', {categoria: categoria})
    }).catch((erro) => {
        req.flash ('error_msg','essa categoria nao existe')
        res.redirect ('/admin/categorias')
    })
})
router.post ('/categorias/edit', eAdmin, (req, res) => {
    categoria.findOne({_id: req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flesh ('success_msg','Salvo Com Sucesso !')
            res.redirect ('/admin/categorias')

        }).catch(() => {
            res.redirect ('/admin/categorias')
        })

    }).catch((erro) => {
        req.flash ('error_msg','Nao foi encontrada nenhuma categoria !')
        res.redirect ('/admin/categorias')
    })
})
router.post ('/categorias/deletar', eAdmin, (req, res) => {
    categoria.remove({_id: req.body.id}).then(() => {
        req.flash ('success_msg','Sucesso ao Deletar !')
        res.redirect ('/admin/categorias')
    }).catch((erro) => {
        req.flash ('error_msg','Erro ao Deletar Categoria')
    })
})
router.get ('/postagens', eAdmin, (req, res) => {
    postagens.find().populate('categoria').sort({date: 'desc'}).then((postagens) => { // Populate() Tem Tuncao Semelhante ao Lean()
        res.render ('layouts/admin/postagens',{postagens:postagens.map(postagens => postagens.toJSON())})
    })
})
router.get ('/postagens/edit/:id', eAdmin,(req, res) => {
    categoria.find().lean().then((categorias) => {
        postagens.findOne({_id: req.params.id}).lean().then((postagens) => {
            res.render ('layouts/admin/editpostagens',{categorias: categorias,postagens:postagens})
        })
    })
})
router.post ('/postagens/edit', eAdmin, (req, res) => {
    postagens.findOne({_id: req.body.id}).then((postagens) => {

        postagens.titulo = req.body.titulo
        postagens.slug = req.body.slug
        postagens.descricao = req.body.descricao
        postagens.conteudo = req.body.conteudo
        postagens.categoria = req.body.categorias

        postagens.save().then(() => {
            req.flash ('success_msg','Post Alterado Com Sucesso !')
            res.redirect ('/admin/postagens')
        })
    }).catch((erro) => {
        req.flash ('error_msg','Erro ao Alterar Post !')
        res.redirect ('/admin/postagens')
    })
})
router.get ('/postagens/deletar/:id', eAdmin, (req, res) => {
    postagens.remove({_id: req.params.id}).then(() => {
        req.flash ('success_msg','Deletado Com Sucesso !')
        res.redirect ('/admin/postagens')
    }).catch((erro) => {
        req.flash ('error_msg','Falha ao Deletar !')
        res.redirect ('/admin/postagens')
    })
})
router.get ('/postagens/add', eAdmin, (req, res) => {
    categoria.find().lean().sort({_id:'desc'}).then((categorias) => {
        res.render ('layouts/admin/addpostagem',{categorias: categorias})
    }).catch((error) => {
        req.flash ('error_msg','Houve Um Erro ao Carregar as Categoria !')
    })
    
})
router.post ('/postagens/nova', eAdmin, (req,res) => {
    const erros = []

    if (!req.body.titulo || req.body.titulo == null || typeof req.body.titulo == undefined){
        req.flash('error_msg','O Titulo não Foi Preenchido ou Foi Digitado de Forma Invalida !!')
        res.redirect('/admin/postagens')
    }
    if (!req.body.slug || req.body.slug == null || typeof req.body.slug == undefined){
        req.flash('error_msg','O Slug não Foi Preenchido ou Foi Digitado de Forma Invalida !!')
        res.redirect('/admin/postagens')
    }
    if (!req.body.descricao || req.body.descricao == null || typeof req.body.descricao == undefined){
        req.flash('error_msg','A Descrição Não Foi Preenchido ou Foi Digitada de Forma Invalida !!')
        res.redirect('/admin/postagens')
    }
    if (req.body.categorias == "0"){
        erros.push ({texto: 'Categoria Invalida !!'})
    }
    if (erros.length > 0){
        res.render ('layouts/admin/addpostagem',{erros: erros})
    }
    else {
        const postagemNova = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categorias
        }
        new postagens(postagemNova).save().then(() => {
            req.flash ('success_msg','Postagem Feita Com Sucesso !')
            res.redirect ('/admin/postagens')
        }).catch((erro) => {
            req.flash ('error_msg','Falha ao Salvar Postagem !')
            res.redirect ('/admin/postagens')
        })
    }
})
router.post ('/categorias/nova', eAdmin, (req, res) => {

    var erros = []
    if (!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined){ // Se Seleciona o Item Atraves do "name".
        erros.push ({
            texto: 'Erro ao Cadastrar, Nome não foi informado '
        })
    }
    if (!req.body.slug || req.body.slug == null || typeof req.body.slug == undefined){
        erros.push ({
            texto: 'Erro ao Cadastrar, Slug não foi informado '
        })
    }
    if (erros.length > 0){
        res.render ('layouts/admin/addcategorias', {erros: erros} /*Serve Para Passar Dados Para o Handle-Bars*/)
        

    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        
        new categoria (novaCategoria).save().then(() => {
            req.flash ('success_msg','Categoria Criada Com Sucesso !')
            res.redirect ('/admin/categorias')
        }).catch ((erro) => {
            req.flash ('error_msg','Falha ao Criar Categoria !')
            res.redirect ("/admin")
        })
    }
  
}
) 

module.exports = router

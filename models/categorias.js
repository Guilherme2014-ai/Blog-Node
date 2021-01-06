// Aqui Iremos Enviar os Dados ao Banco De Dados.

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const categorias = new Schema ({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now() // Valor Pré-Definido.
    }
})

mongoose.model ('categorias', categorias)

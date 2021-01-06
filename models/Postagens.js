const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const postagens = new Schema ({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {                    /*Campo Feito Para Guardar Postagens de outras Collections*/
        type: Schema.Types.ObjectId,
        ref: "categorias", /*qual collection quer pegar as postagens*/
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model ('postagens',postagens)
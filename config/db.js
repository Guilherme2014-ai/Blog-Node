if (process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://blogapp:celso_bixa2014@blogapp.dkcpb.mongodb.net/blogapp?retryWrites=true&w=majority'}
}else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}
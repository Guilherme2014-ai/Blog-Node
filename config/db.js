if (process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://chat:guilherme2014@chat.gtuwm.mongodb.net/chat?retryWrites=true&w=majority'}
}else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}
import { database } from "./firebase.js";
import { set, ref as databaseRef } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js"

document.addEventListener('DOMContentLoaded',()=>{
    const formPost = document.querySelector('.form-post')
    const tituloPost = document.querySelector('.titulo-post')
    const imagemPost = document.querySelector('.imagem-post')
    const mensagemPost = document.querySelector('.mensagem-post')
    const dataPublicacaoPost = document.querySelector('.data-publicacao-post')
    const autorPost = document.querySelector('.autor-post')
    const sendPost = document.querySelector('.send-post')

    const enviarPost = (postId, titulo, mensagem, data, autor)=>{
        return set(databaseRef(database, `posts/${postId}`),{
            titulo:titulo,
            mensagem:mensagem,
            data:data,
            autor:autor
        })
    }

    sendPost.addEventListener('click',()=>{
        const postId = new Date().getTime().toString()
        const titulo = tituloPost.value
        const mensagem = mensagemPost.value
        const data = dataPublicacaoPost.value
        const autor = autorPost.value

        enviarPost(postId, titulo, mensagem, data, autor)
    })

    

})

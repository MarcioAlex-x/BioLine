import { database, storage } from "./firebase.js";
// as significa um apelido ou seja databaseRef é o apelido de ref que é uma função do firebase
import { set, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js"
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js"

document.addEventListener('DOMContentLoaded', () => {
    // Declarando as variáveis
    const formPost = document.querySelector('.form-post')
    const tituloPost = document.querySelector('.titulo-post')
    const imagemPost = document.querySelector('.imagem-post')
    const mensagemPost = document.querySelector('.mensagem-post')
    const dataPublicacaoPost = document.querySelector('.data-publicacao-post')
    const autorPost = document.querySelector('.autor-post')
    const sendPost = document.querySelector('.send-post')
    const divConteudos = document.querySelector('.conteudos')

    const postsRef = databaseRef(database, `posts`)

    if (sendPost && tituloPost && mensagemPost && dataPublicacaoPost && autorPost && imagemPost) {
        // Grava as informações
        const enviarPost = (postId, titulo, mensagem, data, autor, imagemUrl) => {
            return set(databaseRef(database, `posts/${postId}`), {
                titulo,
                mensagem,
                data,
                autor,
                imagemUrl
            })
        }

        //Envia os dados gravados
        sendPost.addEventListener('click', () => {
            const postId = new Date().getTime().toString() // Um identificador baseado em milisegundos
            const titulo = tituloPost.value
            const mensagem = mensagemPost.value
            const data = dataPublicacaoPost.value
            const autor = autorPost.value
            const imagem = imagemPost.files[0]

            if (imagem) {
                const imagemRef = storageRef(storage, `posts/${postId}/${imagem.name}`)
                uploadBytes(imagemRef, imagem)
                    .then((snapshot) => {
                        getDownloadURL(snapshot.ref)
                            .then((url) => {
                                enviarPost(postId, titulo, mensagem, data, autor, url)
                                    .then(() => {
                                        tituloPost.value = ''
                                        mensagemPost.value = ''
                                        dataPublicacaoPost.value = ''
                                        autorPost.value = ''
                                        imagemPost.value = ''
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                            })
                    })
            }

        })
    }

    const listarPosts = (conteudos) =>{
        onValue(postsRef,(snapshot)=>{
            const posts = snapshot.val()
            divConteudos.innerHTML = ''
            if(posts){
                const postsIds = Object.keys(posts)
                postsIds.forEach((postId) =>{
                    const post = posts[postId]
                    const postElement = document.createElement('div')
                    postElement.innerHTML = `
                        <h2 class="mt-5 fw-bold text-center text-success" >${post.titulo}</h2>
                        <div class="decoration-bar" ></div>
                        <img="${post.imagemUrl}" alt="imagem de ${post.titulo}" class="img-blog my-5 img-fluid" />
                        <p>${post.mensagem}</p>
                        <p class="align-self-center mt-5" >Publicado em:${post.data} por ${post.autor}.</p>
                        <hr/>
                    `
                    divConteudos.appendChild(postElement)
                })
            }else{
                divConteudos.innerHTML='<p class="mt-5" >Nenhum post encontrado.</p>'
                
            }
        })
    }
    listarPosts()

})

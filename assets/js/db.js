import { database, storage } from "./firebase.js";
import { set, ref as databaseRef, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    // Declarando as variáveis
    const formPost = document.querySelector('.form-post');
    const tituloPost = document.querySelector('.titulo-post');
    const imagemPost = document.querySelector('.imagem-post');
    const mensagemPost = document.querySelector('.mensagem-post');
    const dataPublicacaoPost = document.querySelector('.data-publicacao-post');
    const autorPost = document.querySelector('.autor-post');
    const sendPost = document.querySelector('.send-post');
    const divConteudos = document.querySelector('.conteudos');
    const gerenciadorConteudos = document.querySelector('.gerenciador-conteudos');
    const categoriaPost = document.querySelector('.categoria');
    const regiaoNorte = document.querySelector('.norte');
    const regiaoNordeste = document.querySelector('.nordeste');
    const regiaoSuldeste = document.querySelector('.suldeste');
    const regiaoSul = document.querySelector('.sul');
    const regiaoCentroOeste = document.querySelector('.centro-oeste');

    const postsRef = databaseRef(database, 'posts');

    const data = (postElement, post) => {
        postElement.innerHTML = `
            <h2 class="mt-5 fw-bold text-center text-success">${post.titulo}</h2>
            <div class="decoration-bar"></div>
            <img src="${post.imagemUrl}" alt="imagem de ${post.titulo}" class="img-blog my-5 img-fluid" />
            <p>${post.mensagem}</p>
            <p class="align-self-center mt-5">Publicado em: ${post.data} por ${post.autor}.</p>
            <hr/>
        `;
    };

    if (sendPost && tituloPost && mensagemPost && dataPublicacaoPost && autorPost && imagemPost && categoriaPost) {
        const enviarPost = (postId, titulo, mensagem, data, autor, imagemUrl, categoria) => {
            return set(databaseRef(database, `posts/${postId}`), {
                titulo,
                mensagem,
                data,
                autor,
                imagemUrl,
                categoria
            });
        };

        sendPost.addEventListener('click', () => {
            const postId = new Date().getTime().toString();
            const titulo = tituloPost.value;
            const categoria = categoriaPost.value;
            const mensagem = mensagemPost.value;
            const data = dataPublicacaoPost.value;
            const autor = autorPost.value;
            const imagem = imagemPost.files[0];

            if (imagem) {
                const imagemRef = storageRef(storage, `posts/${postId}/${imagem.name}`);
                uploadBytes(imagemRef, imagem)
                    .then((snapshot) => {
                        getDownloadURL(snapshot.ref)
                            .then((url) => {
                                enviarPost(postId, titulo, mensagem, data, autor, url, categoria)
                                    .then(() => {
                                        tituloPost.value = '';
                                        mensagemPost.value = '';
                                        dataPublicacaoPost.value = '';
                                        autorPost.value = '';
                                        imagemPost.value = '';
                                        categoriaPost.value = '';
                                    })
                                    .catch((error) => {
                                        console.log('Erro ao enviar o post:', error);
                                    });
                            });
                    });
            }
        });
    }

    const listarPosts = (conteudos, categoria) => {
        onValue(postsRef, (snapshot) => {
            const posts = snapshot.val();
            if (conteudos) {
                conteudos.innerHTML = '';
            }

            if (posts) {
                const postsIds = Object.keys(posts).sort((a, b) => b - a);
                postsIds.forEach((postId) => {
                    const post = posts[postId];
                    if (categoria === 'geral' || post.categoria === categoria) {
                        const postElement = document.createElement('div');
                        data(postElement, post);
                        if (conteudos) {
                            conteudos.appendChild(postElement);
                        }
                    }
                });
            } else {
                if (conteudos) {
                    conteudos.innerHTML = '<p class="mt-5">Nenhum post encontrado.</p>';
                }
            }
        });
    };

    const gerenciarPosts = (conteudos) => {
        onValue(postsRef, (snapshot) => {
            const posts = snapshot.val();
            conteudos.innerHTML = '';
            if (posts) {
                const postIds = Object.keys(posts).sort((a, b) => b - a);
                postIds.forEach((postId) => {
                    const post = posts[postId];
                    const postElement = document.createElement('div');
                    postElement.innerHTML = `
                        <button class="btn btn-danger btn-sm mx-3 delete-post" data-id="${postId}">Apagar</button>
                        <span class="fw-bold">${post.titulo}</span>
                        <hr/>
                    `;
                    conteudos.appendChild(postElement);
                });
                document.querySelectorAll('.delete-post').forEach((button) => {
                    button.addEventListener('click', (e) => {
                        const postId = e.target.getAttribute('data-id');
                        apagarPost(postId);
                    });
                });
            } else {
                conteudos.innerHTML = '<p class="mt-5">Nenhum post encontrado.</p>';
            }
        });
    };

    const apagarPost = (postId) => {
        remove(databaseRef(database, `posts/${postId}`))
            .then(() => {
                alert('Post removido com sucesso');
                listarPosts(divConteudos, 'geral');
                gerenciarPosts(gerenciadorConteudos);
                console.log('Post removido:', postId);
            })
            .catch((error) => {
                console.log(`Erro ao tentar apagar o post: ${error}`);
                alert('Erro ao tentar remover o post');
            });
    };

    // Chama listarPosts para cada região e categoria
    if (divConteudos) {
        listarPosts(divConteudos, 'geral');
    }
    if (gerenciadorConteudos) {
        gerenciarPosts(gerenciadorConteudos);
    }
    if (regiaoNorte) {
        listarPosts(regiaoNorte, 'norte');
    }
    if (regiaoNordeste) {
        listarPosts(regiaoNordeste, 'nordeste');
    }
    if (regiaoSuldeste) {
        listarPosts(regiaoSuldeste, 'suldeste');
    }
    if (regiaoSul) {
        listarPosts(regiaoSul, 'sul');
    }
    if (regiaoCentroOeste) {
        listarPosts(regiaoCentroOeste, 'centro-oeste');
    }
});

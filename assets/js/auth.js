import { auth } from './firebase.js'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"

document.addEventListener('DOMContentLoaded', () => {
    // Declarando as variáveis
    const formLogin = document.querySelector('.form-login')
    const emailInput = document.querySelector('.email-admin')
    const senhaInput = document.querySelector('.senha-admin')
    const linkSair = document.querySelector('.link-sair')
    const formPost = document.querySelector('.form-post')
    const tituloLogin = document.querySelector('.titulo-login')
    const mensagens = document.querySelector('.mensagens')

    // Função de alerta/mensagem
    const alertaUsuario = (alerta) =>{
        mensagens.innerHTML = alerta
    }

    // Limpar mensagem
    const limparMensagem = () =>{
        setInterval(()=>{
            mensagens.innerHTML = ''
        }, 3000)
    }

    // Evento de login
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault()
            const email = emailInput.value
            const senha = senhaInput.value

            signInWithEmailAndPassword(auth, email, senha)
                .then((userCredential) => {
                    const user = userCredential.user
                    alertaUsuario('Usuário logado com sucesso.')                    
                    limparMensagem()
                    emailInput.value = ''
                    senhaInput.value = ''
                })
                .catch(() => {
                    alertaUsuario('Verifique a sua conexão ou o seu email e senha.')
                    limparMensagem()
                })
        })
    }

    // Evento de logout
    if (linkSair) {
        linkSair.addEventListener('click', () => {
            signOut(auth)
                .then(()=>{
                    alertaUsuario('Logout realizado com sucesso.')
                    limparMensagem()
                })
                .catch(()=>{
                    alertaUsuario('Ocorreu um erro inesperado.')                    
                    limparMensagem()
                })
        })
    }

    // Mudança de estado
    onAuthStateChanged(auth,(user)=>{
        if(user){
            const uid = user.uid

            // Verificações de elementos
            if(linkSair) linkSair.classList.remove('hide')
            if(formLogin) formLogin.classList.add('hide')
            if(formPost) formPost.classList.remove('hide')
            if(tituloLogin) tituloLogin.innerHTML = 'ACESSO AO ADMINISTRADOR LIBERADO'
        }else{
            if(linkSair) linkSair.classList.add('hide')
            if(formLogin) formLogin.classList.remove('hide')
            if(formPost) formPost.classList.add('hide')
            if(tituloLogin) tituloLogin.innerHTML = 'FAÇA O LOGIN COMO ADMINISTRADOR!'
        }
    })


})

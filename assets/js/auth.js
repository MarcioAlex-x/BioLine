import { auth } from './firebase.js'

import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('.email-admin')
    const senhaInput = document.querySelector('.senha-admin')
    const formLogin = document.querySelector('.form-login')
    const linkSair = document.querySelector('.link-sair')
    const linkAdmin = document.querySelector('.link-admin')
    const formPost = document.querySelector('.form-post')
    const tituloLogin = document.querySelector('.titulo-login')

    if(formLogin){
     formLogin.addEventListener('submit', (e) => {
        e.preventDefault()
        const email = emailInput.value
        const password = senhaInput.value
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                const user = userCredential.user
                emailInput.value = ''
                senhaInput.value = ''

            })
            .catch((error)=>alert(error.message))
    })   
    }

    onAuthStateChanged(auth,(user)=>{
        if(user){
            const uid = user.uid
            linkAdmin.classList.add('hide')
            linkSair.classList.remove('hide')
            formLogin.classList.add('hide')
            formPost.classList.remove('hide')
            tituloLogin.innerHTML = 'ACESSO AO ADMINISTRADOR LIBERADO'

        }else{
            linkAdmin.classList.remove('hide')
            linkSair.classList.add('hide')
            formLogin.classList.remove('hide')
            formPost.classList.add('hide')
            tituloLogin.innerHTML = 'FAÇA O LOGIN COMO ADMINISTRADOR'

        }
    })

})



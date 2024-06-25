import { auth } from './firebase.js'
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('.form-login')
    const emailInput = document.querySelector('.email-admin')
    const senhaInput = document.querySelector('.senha-admin')

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault()
        const email = emailInput.value
        const senha = senhaInput.value

        if(formLogin){
            signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                const user = userCredential.user
                alert('Usuário logado com sucesso')
                emailInput.value = ''
                senhaInput.value = ''
            })
            .catch(()=>{
                alert('Verifique a sua conexão ou o seu email e senha.')
            })
        }
    })
})

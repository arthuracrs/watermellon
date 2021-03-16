import React, { useState } from 'react';
import Axios from 'axios'
import FlashMessages from '../components/FlashMessages'

import Logo from '../assets/logo.png'

import CreateUser from '../components/CreateUser'

import './Login.css'

function Login(props) {

    const [showCreateUserPage, setShowCreateUserPage] = useState(false)
    const hideCreateUserPageHandle = () => setShowCreateUserPage(false)

    const [flashMessages, setFlashMessages] = useState([])

    function handleSubmit(event) {
        event.preventDefault()

        const req = {
            username: event.target[0].value,
            password: event.target[1].value,
        }

        Axios.post(process.env.REACT_APP_API_URL + '/login', req, { withCredentials: true })
            .then(res => {
                
                setFlashMessages(res.data.flashMessages)
                if (res.data.flashMessages[0].ok === true) {
                    window.location.pathname = "/" 
                }
                
            })
            .catch(error => console.error(error))
    }

    return (
        <>
        { showCreateUserPage ? <CreateUser hideCreateUserPageHandle={hideCreateUserPageHandle} /> : '' }
        <div className="logo-container">
            <img src={Logo} alt=""/>
            <h2>Entrar no Watermellon</h2>
            <FlashMessages flashMessages={flashMessages}/>
            <form onSubmit={handleSubmit}>
                <input className="email" name="username" type="text" placeholder="Username"/>
                <input className="password" name="password" type="password" placeholder="Senha"/>
                <input className="submit" type="submit" value="Entrar"/>
            </form>
            <div className="link-container">
                <a href="."onClick={event => { event.preventDefault(); setShowCreateUserPage(true)}}>Inscreva-se no Watermellon</a>
            </div>
        </div> 
        </>
    )
}

export default Login

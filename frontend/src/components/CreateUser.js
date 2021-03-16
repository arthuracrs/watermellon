import React, { useState } from 'react';
import Axios from 'axios'
import FlashMessages from './FlashMessages'
import Loading from './Loading'

import Logo from '../assets/logo.png'
import ExitIcon from '../assets/exit.svg'

import './CreateUser.css'

function CreateUser(props) {

    const [flashMessages, setFlashMessages] = useState([])
    const [loggedIn, setLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function handleSubmit(event) {
        event.preventDefault()
        setIsLoading(true)

        const req = {
            username: event.target[0].value,
            password: event.target[1].value,
            confirmPassword: event.target[2].value
        }

        Axios.post(process.env.REACT_APP_API_URL + '/user', req, { withCredentials: true })
            .then(res => {
                setFlashMessages([])
                setTimeout(function() {
                    setFlashMessages(res.data.flashMessages)
                    if (res.data.flashMessages[0].ok === true) {
                        setLoggedIn(true)
                    }
                    else {
                        setIsLoading(false)
                    }
                }, 200)

            })
            .catch(error => console.error(error))
    }
    return (
        <div className="create-user">
            {loggedIn ? window.location.pathname = "/" : ''}
            <div className="create-user-container">
                <img className="exit-icon" src={ExitIcon} onClick={props.hideCreateUserPageHandle} alt=""/>
                <img className="logo-icon"src={Logo} alt=""/>
                <FlashMessages flashMessages={flashMessages}/>
                <h2>Crie sua conta</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username"/>
                    <input type="password" placeholder="Senha"/>
                    <input type="password" placeholder="Confirme sua senha"/>
                    { isLoading ? <Loading/> : <input type="submit" className="submit" value="Criar"/>}
                </form>
            </div>
        </div>
    )
}

export default CreateUser

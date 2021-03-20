import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Loading from './Loading'
import FlashMessages from './FlashMessages'

import ExitIcon from '../assets/exit.svg'

import './CreatePost.css'

function CreatePost(props) {

    const [showCreatePost, setShowCreatePost] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const showCreatePostHandle = () => { setShowCreatePost(true) }
    const hideCreatePostHandle = () => { 
        setIsLoading(false)
        setShowCreatePost(false) 
    }

    function PopUp(props) {
        const [flashMessages, setFlashMessages] = useState([])
        const [content, setContent] = useState('')
    
        const onChangeHandle = (e) => {
            setContent(e.target.value)
        }

        function handleSubmit(event) {
            event.preventDefault()
            setIsLoading(true)

            Axios.post(`${process.env.REACT_APP_API_URL}/post`, {content}, { withCredentials: true })
                .then(res => {
                    setFlashMessages(res.data.flashMessages)

                    if (res.data.flashMessages[0].ok === true) {
                        hideCreatePostHandle()
                    }
                    else {
                        setIsLoading(false)
                    }

                })
        }
        const abortStateHandle = () => {
            setFlashMessages({})
            
        }

        useEffect(() => {
            return abortStateHandle
        }, [])
        
        return (
            <div className="create-post">
            <div className="create-post-container">
                <img className="exit-icon" alt="" src={ExitIcon} onClick={props.hideCreatePostHandle}/>
                <FlashMessages flashMessages={flashMessages}/>
                    <textarea onChange={onChangeHandle} className="create-post-textarea" placeholder="Escreva aqui sua postagem">
                    </textarea>
                    { isLoading ? <Loading/>
                    :<input onClick={handleSubmit} type="submit" className="submit" value="Postar"/>}
            </div>
        </div>
        )
    }

    return (
        <div className="create-post-oaa">
            {showCreatePost ? <PopUp hideCreatePostHandle={hideCreatePostHandle}/> : ''}
            <div className="create-post-ghost">
                <input type="submit" className="create-post-new-post" onClick={showCreatePostHandle} value="Criar Post"/>
            </div>
        </div>
    )
}

export default CreatePost

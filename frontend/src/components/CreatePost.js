import React, { useState } from 'react'
import Axios from 'axios'
import Loading from './Loading'
import FlashMessages from './FlashMessages'

import ExitIcon from '../assets/exit.svg'

import './CreatePost.css'

function CreatePost(props) {

    const [showCreatePost, setShowCreatePost] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const showCreatePostHandle = () => { setShowCreatePost(true) }
    const hideCreatePostHandle = () => { setShowCreatePost(false) }

    function PopUp(props) {
        const [flashMessages, setFlashMessages] = useState([])

        function handleSubmit(event) {
            event.preventDefault()
            setIsLoading(true)
            const req = {
                content: event.target[0].value
            }

            Axios.post(`${process.env.REACT_APP_API_URL}/post`, req, { withCredentials: true })
                .then(res => {
                    setFlashMessages(res.data.flashMessages)

                    if (res.data.flashMessages[0].ok === true) {
                        hideCreatePostHandle()
                    } else {
                        setIsLoading(false)
                    }

                })
        }

        return (
            <div className="create-post">
            <div className="create-post-container">
                <img className="exit-icon" alt="" src={ExitIcon} onClick={props.hideCreatePostHandle}/>
                <FlashMessages flashMessages={flashMessages}/>
                <form id="postForm" className="create-post-form" onSubmit={handleSubmit}>
                    <textarea className="create-post-textarea" form="postForm" id="story" name="story" rows="5" cols="33" placeholder="Escreva aqui sua postagem">
                    </textarea>
                    { isLoading ? <Loading/>
                    :<input type="submit" className="submit" value="Postar"/>}
                </form>
            </div>
        </div>
        )
    }

    return (
        <div>
            {showCreatePost ? <PopUp hideCreatePostHandle={hideCreatePostHandle}/> : ''}
            <div className="create-post-invoke-button-container">
                <input type="submit" className="create-post-new-post" onClick={showCreatePostHandle} value="Criar Post"/>
            </div>
        </div>
    )
}

export default CreatePost

import React, { useState } from 'react'
import Axios from 'axios'

import FlashMessages from './FlashMessages'
import Loading from './Loading'

import ExitIcon from '../assets/exit.svg'

import './CreateComment.css'

function CreateComment(props) {

    const [showCreateComment, setShowCreateComment] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const showCreateCommentHandle = () => setShowCreateComment(true)
    const hideCreateCommentHandle = () => {
        setShowCreateComment(false)
        props.refreshHandle()
    }
    
    const [flashMessages, setFlashMessages] = useState([])
    
    function PopUp(props) {
        
        function handleSubmit(event) {
            event.preventDefault()
            
            setIsLoading(true)
            
            const req = {
                content: event.target[0].value
            }

            Axios.post(`${process.env.REACT_APP_API_URL}/comment/${props.postId}`, req, { withCredentials: true })
                .then(res => {
                    setFlashMessages(res.data.flashMessages)
                    if (res.data.flashMessages[0].ok === true) {
                        props.hideCreateCommentHandle()
                    } else {
                        setIsLoading(false)
                    }
                })
        }
        

        return (
            <div className="create-comment-popup">
            <div className="create-comment-popup-container">
                <img className="create-comment-popup-exit-icon" alt="" src={ExitIcon} onClick={props.hideCreateCommentHandle}/>
                <FlashMessages flashMessages={flashMessages}/>
                <form className="create-comment-popup-form" id="postForm" onSubmit={handleSubmit}>
                    <textarea className="create-comment-popup-textarea" form="postForm" id="story" name="story" rows="5" cols="33" placeholder="Escreva aqui seu comentário">
                    </textarea>
                    { isLoading ? <Loading/>
                    : <input type="submit" className="create-comment-popup-submit" value="Comentar"/>}
                </form>
            </div>
        </div>
        )
    }

    return (
        <div>
            {showCreateComment ? <PopUp postId={props.x._id} hideCreateCommentHandle={hideCreateCommentHandle}/> : ''}
            <input className="create-comment-new-comment" type="submit" value="Comentar" onClick={showCreateCommentHandle}/>
        </div>
    )
}

export default CreateComment

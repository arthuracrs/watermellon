import React, { useState } from 'react'
import Axios from 'axios'

import FlashMessages from './FlashMessages'
import Loading from './Loading'

import ExitIcon from '../assets/exit.svg'

import './CreateComment.css'

function CreateComment(props) {

    const [postData] = useState(props.x)
    const [showPopUp, setShowPopUp] = useState(false)

    const showCreateCommentHandle = () => setShowPopUp(true)
    const hidePopUpHandle = () => {
        setShowPopUp(false)
        props.refreshHandle()
    }

    function PopUp(props) {
        const [flashMessages, setFlashMessages] = useState([])
        const [isLoading, setIsLoading] = useState(false)
        const [content, setContent] = useState('')

        const onChangeHandle = (e) => {
            setContent(e.target.value)
        }

        function handleSubmit(event) {
            setIsLoading(true)

            Axios.post(
                    process.env.REACT_APP_API_URL + '/' +
                    postData.userId.username + '/post/' + postData._id +
                    '/comment', { content }, { withCredentials: true })
                .then(res => {
                    setFlashMessages(res.data.flashMessages)
                    if (res.data.flashMessages[0].ok === true) {
                        props.hidePopUpHandle()
                    }
                    else {
                        setIsLoading(false)
                    }
                })
        }

        return (
            <div className="create-comment-popup">
            <div className="create-comment-popup-container">
                <img className="create-comment-popup-exit-icon" alt="" src={ExitIcon} onClick={()=>{setShowPopUp(false)}}/>
                <FlashMessages flashMessages={flashMessages}/>
                <textarea className="create-comment-popup-textarea" 
                    placeholder="Escreva aqui seu comentário" 
                    onChange={onChangeHandle}>
                </textarea>
                { isLoading ? <Loading/>
                : <input type="submit" onClick={handleSubmit} className="create-comment-popup-submit" value="Comentar"/>}
            </div>
        </div>
        )
    }

    return (
        <div>
            {showPopUp ? <PopUp hidePopUpHandle={hidePopUpHandle}/> : ''}
            <input className="create-comment-new-comment" type="submit" value="Comentar" onClick={showCreateCommentHandle}/>
        </div>
    )
}

export default CreateComment

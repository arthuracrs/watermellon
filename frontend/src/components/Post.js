import React, { useState } from 'react'
import Comment from './Comment.js'

import CreateComment from './CreateComment'

import UserIcon from '../assets/user-icon.png'

import './Post.css'

function Post(props) {

    const [commentsNumberLimit, setCommentsNumberLimit] = useState(2)

    function ShowMoreComments(props) {

        return (
            <div>
                { commentsNumberLimit ? 
                <span className="comments-show-all-comments" 
                    onClick={() => { props.setCommentsNumberLimit(undefined) }}>
                        Mostrar todos os comentários
                </span> : 
                <span className="comments-show-all-comments" 
                    onClick={() => { props.setCommentsNumberLimit(2) }}>
                        Mostrar menos
                </span> }
            </div>
        )
    }
    
    return (
        <div className="post">
            <div className="post-info">
                <div className="post-info-container-1">
                    <img className="post-user-icon" alt="" src={UserIcon}/>
                </div>
                <div className="post-info-container-2">
                    <span className="post-username">{props.x.userId.username}</span>
                    <span className="post-text">{props.x.content}</span>
                </div>
            </div>
            <div className="comments-container">
                <CreateComment refreshHandle={props.refreshHandle} x={props.x}/>
                <div className="comments-title-container">
                    <h4 className="comments-title">Comentarios: {props.x.comments.length}</h4>
                </div>
                
                {props.x.comments.slice(0, commentsNumberLimit).map(x=><Comment key={x._id} x={x}/>)}
                {props.x.comments.length > 2 ? <ShowMoreComments setCommentsNumberLimit={setCommentsNumberLimit}/> : '' }
            </div>
        </div>
    )
}

export default Post

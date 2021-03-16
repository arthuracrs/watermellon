import React from 'react'
import UserIcon from '../assets/user-icon.png'

import './Comment.css'

function Comment(props){
    return (
        <div className="comment">
            <img className="comment-user-icon" alt="" src={UserIcon}/>
            <div className="comment-info">
                <p className="">{props.x.userId.username}</p>
                <span className="comment-text">{props.x.content}</span>
            </div>
        </div>
    )
}

export default Comment
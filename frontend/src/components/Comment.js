import React from 'react'
import {Link} from 'react-router-dom'

import UserIcon from '../assets/user-icon.png'

import './Comment.css'

function Comment(props){
    
    return (
        <div className="comment">
            <img className="comment-user-icon" alt="" src={UserIcon}/>
            <div className="comment-info">
                <Link className="comment-username-link"  to={"/"+ props.x.userId.username}><p className="comment-username">{props.x.userId.username}</p></Link>
                <span className="comment-text">{props.x.content}</span>
            </div>
        </div>
    )
}

export default Comment
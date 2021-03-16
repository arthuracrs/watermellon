import React from 'react'

import './FlashMessages.css'

function FlashMessage(props) {
    return (
        <div className="flash-messages">
        {props.flashMessages.map(x=>
            <div 
                className={x.ok ? "flash-message-container-ok" : "flash-message-container-error"} 
                key={x.text}>
                    <span className={x.ok ? "flash-messages-message-ok" : "flash-messages-message-error"} >
                        {x.text}
                    </span>
            </div>)}
        </div>
    )
}

export default FlashMessage

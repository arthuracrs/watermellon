import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams } from 'react-router-dom'

import './Follow.css'

function Follow() {

    const { pathUsername } = useParams()

    const followHandle = () => {
        Axios.put(process.env.REACT_APP_API_URL + '/user', {follow: pathUsername}, { withCredentials: true })
            .then(res => {
                    
            })
    }

    return (
        <div className="follow" >
            
            <input className="follow-button" type="submit" onClick={followHandle} value="Seguir" />
            
        </div>
    )
}

export default Follow

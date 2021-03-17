import React, { useState } from 'react'
import Axios from 'axios'
import { useParams } from 'react-router-dom'

import './Follow.css'

function Follow(props) {

    const { pathUsername } = useParams()
    const [following, setFollowing] = useState(props.loggedUser.following.includes(props.userProfile._id))

    const followHandle = () => {
        setFollowing(true)
        Axios.put(process.env.REACT_APP_API_URL + '/user/' + pathUsername + '/follow', {},{ withCredentials: true })
            .then(res => {
            })
    }
    const unFollowHandle = () => {
        setFollowing(false)
        Axios.put(process.env.REACT_APP_API_URL + '/user/' + pathUsername + '/unfollow', {},{ withCredentials: true })
            .then(res => {
            })
    }
    return (
        <div className="follow" >
            {following ?
            <input className="follow-button" type="submit" onClick={unFollowHandle} value="Deixar de seguir" />
            : <input className="follow-button" type="submit" onClick={followHandle} value="Seguir" />}
        </div>
    )
}

export default Follow

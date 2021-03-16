import React from 'react'
import Axios from 'axios'

import './LogoutButton.css'

function LogoutButton() {

    function LogoutHandle() {
        Axios.post(process.env.REACT_APP_API_URL + '/logout', {}, { withCredentials: true })
            .then(res => {
                window.location.pathname = "/" 
            })
    }

    return ( <input className="logout-button" type="submit" value="Sair" onClick={LogoutHandle}/>)
}

export default LogoutButton

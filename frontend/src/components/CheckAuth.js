import React, { useState } from 'react'
import Axios from 'axios'

import Loading from '../components/Loading'

function CheckAuth(props) {
    
    const [isLoading, setIsLoading] = useState(true)
    
    Axios.post(process.env.REACT_APP_API_URL + '/auth', {}, { withCredentials: true })
        .then(res => {
            if (res.data.flashMessages[0].ok === false) {
                window.location.pathname = "/login" 
            }
            else {
                props.saveUsername(res.data.username)
                setIsLoading(false)
            }
        })

    return (<div> { isLoading ? <Loading/> : <props.component/> } </div>)
}

export default CheckAuth

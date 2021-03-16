import React, {useState} from 'react'
import Axios from 'axios'

import './SearchUser.css'

function SearchUser() {

    const [query, setQuery] = useState()

    function searchUserHandle(event) {
        event.preventDefault()

        Axios.get(process.env.REACT_APP_API_URL + '/user', { username: event.target[0].value }, { withCredentials: true })
        .then(res=>{
              if(res.data.flashMessages[0].ok == true){
                  setQuery(res.data.query)
              }
        })
    }

    return (
        <div className="search-user">
            <form className="search-=user-form" onSubmit={searchUserHandle}>
                <input type="text"/>
                <input type="submit"/>
            </form>
            
        </div>
    )
}

export default

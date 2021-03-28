import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Axios from 'axios'
import { useDebouncedCallback } from 'use-debounce';

import UserIcon from '../assets/user-icon.png'

import './SearchUser.css'

function SearchUser() {

    const [query, setQuery] = useState([])

    const debounced = useDebouncedCallback((e) => {
        onChangeHandle(e)
    }, 500)

    function onChangeHandle(e) {

        if (e.target.value === "") setQuery([])
        Axios.get(process.env.REACT_APP_API_URL + '/search/' + e.target.value, { withCredentials: true })
            .then(res => {
                if (res.data.flashMessages[0].ok === true) {
                    setQuery(res.data.query)
                }
            })
    }

    return (
        <div className="search-user-container">
            <div className="search-user">
                <span className="search-user-tittle">Pesquisar Usuario</span>    
                <input className="search-user-input" onChange={debounced} placeholder="procurar usuario" type="text"/>
                {query[0] !== 0 ? query.map(x=>
                        <Link to={x.username} key={x._id} className="no-underline">
                            <div className="search-users-single-container">
                                <img className="search-users-user-icon" alt="" src={
                                x.avatar
                                || UserIcon
                                }/>
                                <div className="search-users-user-info">
                                    <span className="search-users-single-username">
                                        {x.username}
                                    </span> 
                                </div>
                            </div>
                        </Link>
                    ) : <span className="search-user-none-found" >nenhum usuario encontrado</span>}
            </div>
        </div>
    )
}

export default SearchUser

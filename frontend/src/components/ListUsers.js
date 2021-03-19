import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Link } from "react-router-dom"

import Loading from './Loading'

import UserIcon from '../assets/user-icon.png'

import './ListUsers.css'

function ListUsers() {
    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState([])

    function Loadusers() {
        Axios.get(process.env.REACT_APP_API_URL + '/users', { withCredentials: true })
            .then(res => {
                setUsers(res.data.content)
                setIsLoading(false)
            })
            .catch(error => {
                console.error(error)
            })
    }

    const abortSetStates = () => {
        setUsers({})
        setIsLoading({})
    }

    useEffect(() => {
        Loadusers()
        return abortSetStates
    }, [])

    function Content() {
        return (
            <div>
                <h3>Outros Usuarios:</h3>
                {users.map(x=>
                    <Link to={x.username} key={x._id} className="no-underline">
                        <div className="list-users-single-container">
                        
                            <img className="list-users-user-icon" alt="" src={UserIcon}/>
                            <div className="list-users-user-info">
                                <span className="list-users-single-username">
                                    {x.username}
                                </span> 
                            </div>
                        </div>
                    </Link>
                )}
        </div>
        )
    }


    return (<div> { isLoading ? <Loading/> : <Content/> } </div>)
    }

    export default ListUsers

import React, { useState } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
}
from "react-router-dom"

import CheckAuth from '../components/CheckAuth'
import ListUsers from '../components/ListUsers'
import Header from '../components/Header'
import CreatePost from '../components/CreatePost'
import Profile from '../components/Profile'

import './Dashboard.css'

function Dashboard() {

    const [loggedUser, setLoggedUser] = useState('')

    function Content() {
        return (
            <Router>
            <div className="dashboard">
            <div className="dashboard-header">
                <Header loggedUser={loggedUser} />
            </div>
            <div className="dashboard-main">
                <Switch>
                    <Route path="/" exact>
                        <div>
                            <CreatePost/>
                            <h1>Outros Usuarios:</h1>
                            <ListUsers/>
                        </div>
                    </Route>
                    <Route path={"/:pathUsername"} exact>
                        <Profile loggedUser={loggedUser}/>
                    </Route>
                    <Route path="*" >
                        404
                    </Route>
                </Switch>
            </div>
            </div>
            </Router>
        )
    }
    return (<CheckAuth component={Content} saveUsername={setLoggedUser}/>)
}

export default Dashboard

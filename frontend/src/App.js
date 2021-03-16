import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

import './App.css'

function App() {
  
  return(
    <Router>
      <Switch>
        <Route path="/login" exact >
          <Login/>
        </Route>
        <Route path="/">
          <Dashboard/> 
        </Route>
      </Switch>
    </Router>
    )
}

export default App

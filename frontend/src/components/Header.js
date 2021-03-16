import React from 'react'
import {
  NavLink 
} from "react-router-dom";

import Logo from '../assets/logo.png'
import LogoutButton from './LogoutButton'

import './Header.css'

function Header(props) {
    
    return (
        <div className="header">
            <img src={Logo} alt="" className="header-logo"/>
            <NavLink  exact to="/" activeClassName="selected" className="header-home-link">
                <p> Home</p>
            </NavLink >
            <NavLink  to={"/" + props.loggedUser} className="header-home-link" activeClassName="selected" >
                <p>Perfil</p>
            </NavLink >
            <LogoutButton/>
        </div>
    )
}

export default Header

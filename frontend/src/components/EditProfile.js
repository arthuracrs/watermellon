import React, { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import Axios from 'axios'

import FlashMessages from './FlashMessages'
import Loading from '../components/Loading'

import UserIcon from '../assets/user-icon.png'
import ProfileBanner from '../assets/profile-banner.jpg'

import './EditProfile.css'

import ExitIcon from '../assets/exit.svg'

function EditProfile(props) {

    const [showPopUp, setShowPopUp] = useState(false)

    const showPopUpHandle = () => {
        setShowPopUp(true)
    }

    function PopUp(props) {
        const [changed, setChanged] = useState(false)
        const [flashMessages, setFlashMessages] = useState([])
        const [userProfile] = useState(props.userProfile)
        const [isLoading, setIsLoading] = useState(false)

        function onChangeHandle(e) {
            setFlashMessages([])
            setIsLoading(true)
            Axios.put(process.env.REACT_APP_API_URL + '/user', { bio: e.target.value }, { withCredentials: true })
                .then(res => {
                    setChanged(true)
                    setIsLoading(false)
                    setFlashMessages(res.data.flashMessages)
                })
        }

        const debounced = useDebouncedCallback(
            // function
            (e) => { onChangeHandle(e) },
            // delay in ms
            1000
        );

        return (
            <div className="edit-profile-popup">
                <div className="edit-profile-popup-container">
                    <div className="edit-profile-popup-header">
                        <div className="edit-profile-popup-header-div-1">
                            {flashMessages.length !== 0 || isLoading ?
                            '' : <h3 className="edit-profile-popup-header-div-1-title">Edite Seu Perfil</h3>}
                            <FlashMessages flashMessages={flashMessages}/>
                            {isLoading ? <Loading/> : ''}
                        </div>
                        <img className="edit-profile-popup-exit-icon" alt="" src={ExitIcon} onClick={changed ? props.hidePopUpHandle : ()=>{setShowPopUp(false)}}/>
                    </div>
                    <div className="profile1-container">
                            
                            <div className="profile1">
                                <div className="profile1-header">
                                    <img className="profile1-user-header-banner" alt="" src={ProfileBanner}/>
                                    <img className="profile1-user-icon" alt="" src={UserIcon}/>
                                </div>
                                <div className="profile1-user-info">
                                        <h3>{userProfile.username}</h3>
                                    <textarea 
                                        className="edit-profile1-bio"
                                        defaultValue={userProfile.bio}
                                        onChange={(e) => debounced(e)}
                                        >
                                        </textarea>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        )
    }

    return (
        <div className="edit-profile">
            {showPopUp ? <PopUp handleRefresh={props.handleRefresh} userProfile={props.userProfile} hidePopUpHandle={()=>{ 
            setShowPopUp(false)
            props.handleRefresh()
            }}>
                
            </PopUp> : ''}
            <input type="submit" className="edit-profile-button-invoker" onClick={showPopUpHandle} value="Editar perfil"/>
        </div>
    )
}

export default EditProfile

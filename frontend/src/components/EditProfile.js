import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';
import Axios from 'axios'

import MyEditor from './MyEditor'
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

        const [bio, setBio] = useState()
        const [avatar, setAvatar] = useState(UserIcon)
        const [banner, setBanner] = useState(ProfileBanner)

        const [showMyEditor, setShowMyEditor] = useState(false)

        function updateHandle(e) {
            setFlashMessages([])
            setIsLoading(true)

            let body = {}

            if (avatar) body.avatar = avatar
            if (banner) body.banner = banner
            if (bio) body.bio = bio

            Axios.put(process.env.REACT_APP_API_URL + '/user', body, { withCredentials: true })
                .then(res => {
                    setChanged(true)
                    setIsLoading(false)
                    setFlashMessages(res.data.flashMessages)
                })
        }

        const debounced = useDebouncedCallback(
            // function
            (e) => { setBio(e.target.value) },
            // delay in ms
            1000
        );

        const setImageBanner = (url)=>{
            setBanner(url)
        }

        function FakeProfile(props){
            
            useEffect(()=>{
                console.log(banner)
            }, [])
            
            return(
                <div className="profile1-container">
                    <div className="profile1">
                        <div className="profile1-header">
                            <img className="profile1-user-header-banner" alt="" src={banner}/>
                            <img onClick={()=>{props.setShowMyEditor(true)}} className="profile1-user-icon" alt="" src={avatar}/>
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
            )
        }

        return (
            <div className="edit-profile-popup">
                <div className="edit-profile-popup-container">
                    <div className="edit-profile-popup-header">
                        <div className="edit-profile-popup-header-div-1">
                            {flashMessages.length !== 0 || isLoading ?
                            '' : <h3 className="edit-profile-popup-header-div-1-title">Edite Seu Perfil</h3>}
                            <FlashMessages flashMessages={flashMessages}/>
                            {isLoading && <Loading/>}
                        </div>
                        <img className="edit-profile-popup-exit-icon" alt="" src={ExitIcon} onClick={changed ? props.hidePopUpHandle : ()=>{setShowPopUp(false)}}/>
                    </div>
                    <div className="edit-profile-popup-body">
                        {showMyEditor && <MyEditor setImageBanner={setImageBanner} banner={banner} setShowMyEditor={setShowMyEditor} />}
                        {showMyEditor ? '' : <FakeProfile setShowMyEditor={setShowMyEditor}/>}
                    </div>    
                </div>
            </div>
        )
    }

    return (
        <div className="edit-profile">
            {showPopUp && <PopUp handleRefresh={props.handleRefresh} userProfile={props.userProfile} hidePopUpHandle={()=>{ 
            setShowPopUp(false)
            props.handleRefresh()
            }}/>}
            <input type="submit" className="edit-profile-button-invoker" onClick={showPopUpHandle} value="Editar perfil"/>
        </div>
    )
}

export default EditProfile

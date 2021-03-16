import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios'

import ListUserPost from '../components/ListUserPost'
import Loading from '../components/Loading'
import EditProfile from '../components/EditProfile'

import UserIcon from '../assets/user-icon.png'
import ProfileBanner from '../assets/profile-banner.jpg'

import './Profile.css'

function Profile(props) {

    let { pathUsername } = useParams();

    function ProfileHeader() {
        const [userProfile, setUserProfile] = useState({})
        const [isLoading, setIsLoading] = useState(true)
        const [refresh, setRefresh] = useState(true)
        const handleRefresh = () => { setRefresh(!refresh) }

        function LoadProfile() {
            Axios.get(process.env.REACT_APP_API_URL + "/user/" + pathUsername, { withCredentials: true })
                .then(res => {
                    if (res.data.flashMessages[0].ok === true) {
                        setUserProfile(res.data.content)
                        setIsLoading(false)
                    }
                })
        }

        const abortSetStates = () => {
            setUserProfile({})
            setIsLoading({})
        }

        useEffect(() => {
            LoadProfile()
            return abortSetStates
        }, [pathUsername, refresh])

        function Content() {
            return (
                <div className="profile">
                    <div className="profile-header">
                        <img className="profile-user-header-banner" alt="" src={ProfileBanner}/>
                        <img className="profile-user-icon" alt="" src={UserIcon}/>
                        { props.loggedUser === pathUsername ? 
                        <EditProfile handleRefresh={handleRefresh} userProfile={userProfile} className="profile-edit-profile-button-invoker"/> 
                        : <div className="profile-fake-edit-profile-invoker"></div>}
                    </div>
                    <div className="profile-user-info">
                        <h3>{pathUsername}</h3>
                        <p className="profile-bio">{userProfile.bio ? userProfile.bio : ''}</p>
                    </div>
                </div>
            )
        }
        return (<div>{isLoading ? <Loading/> : <Content/>}</div>)

    }



    return (
        <div className="profile-page">
            <ProfileHeader/>
            <ListUserPost/>
        </div>
    )


}


export default Profile

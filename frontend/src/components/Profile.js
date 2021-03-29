import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from 'axios'

import ListUserPost from '../components/ListUserPost'
import Loading from '../components/Loading'
import EditProfile from '../components/EditProfile'
import Follow from '../components/Follow'

import UserIcon from '../assets/user-icon.png'
import ProfileBanner from '../assets/profile-banner.jpg'

import './Profile.css'

function Profile(props) {

    function ProfileHeader() {
        const { pathUsername } = useParams();

        const [userProfile, setUserProfile] = useState({})
        const [isLoading, setIsLoading] = useState(true)
        const [loggedUser] = useState(props.loggedUser)
        const [refresh, setRefresh] = useState(true)
        const handleRefresh = () => { setRefresh(!refresh) }

        function LoadProfile() {
            Axios.get(process.env.REACT_APP_API_URL + "/" + pathUsername, { withCredentials: true })
                .then(res => {
                    if (res.data.flashMessages[0].ok === true) {
                        setUserProfile(res.data.content)
                        setIsLoading(false)
                    }
                })
        }

        const abortSetStates = () => {
            setUserProfile({})
            setIsLoading(false)
        }

        useEffect(()=>{
            LoadProfile()
            return abortSetStates
        }, [])

        useEffect(() => {
            LoadProfile()
        }, [pathUsername, refresh])

        function Content() {
            return (
                <div className="profile">
                    <div className="profile-header">
                        <img className="profile-user-header-banner" alt="" src={userProfile.banner ? userProfile.banner : ProfileBanner}/>
                        <img className="profile-user-icon" alt="" src={ userProfile.avatar ? userProfile.avatar : UserIcon}/>
                        { loggedUser.username === pathUsername ? 
                        <EditProfile handleRefresh={handleRefresh} userProfile={userProfile} className="profile-edit-profile-button-invoker"/> 
                        : <Follow loggedUser={loggedUser} userProfile={userProfile}/>}
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

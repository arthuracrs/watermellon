import React, { useState } from "react";
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

        const [uploadBody, setUploadBody] = useState({})

        const [myEditorOptions, setMyEditorOptions] = useState({})
        const [showMyEditor, setShowMyEditor] = useState(false)

        const updateHandle = async(e) => {
            setFlashMessages([])
            setIsLoading(true)

            const formData = new FormData();

            const blobCallBack = (type) => {
                return new Promise((resolve, reject) => {
                    uploadBody[type].toBlob((blob) => {
                        resolve(blob)
                    })
                })
            }

            if (uploadBody.avatar) {
                const blob = await blobCallBack('avatar')
                formData.append('avatar', blob)
            }
            if (uploadBody.banner) {
                const blob = await blobCallBack('banner')
                formData.append('banner', blob)
            }
            if (uploadBody.bio) formData.append('bio', uploadBody.bio)

            Axios.put(process.env.REACT_APP_API_URL + '/user', formData, { withCredentials: true })
                .then(res => {
                    setChanged(true)
                    setIsLoading(false)
                    setFlashMessages(res.data.flashMessages)
                })
        }

        const debounced = useDebouncedCallback(
            // function
            (e) => {
                let temp = uploadBody
                temp.bio = e.target.value
                setUploadBody(temp)
            },
            // delay in ms
            1000
        );

        const setImageOutput = (croppedCavas, type) => {
            let temp = uploadBody
            temp[type] = croppedCavas
            setUploadBody(temp)
        }

        const showMyEditorHandle = () => {
            setShowMyEditor(true)
        }

        function FakeProfile(props) {

            return (
                <div className="profile1-container">
                    <div className="profile1">
                        <div className="profile1-header">
                            <div 
                                className="profile1-user-header-banner"
                                onClick={()=>{ 
                                    setMyEditorOptions({
                                        type: "banner",
                                        setImageOutput: setImageOutput,
                                        imageInput: 
                                            uploadBody.banner && uploadBody.banner.toDataURL()
                                            || userProfile.banner
                                            || ProfileBanner 
                                        ,
                                        setShowMyEditor: setShowMyEditor
                                    })
                                    showMyEditorHandle() 
                                }} 
                            >
                                <img 
                                    className="profile1-user-header-banner-img" 
                                    alt="" 
                                    src={ 
                                        uploadBody.banner && uploadBody.banner.toDataURL()
                                        || userProfile.banner
                                        || ProfileBanner 
                                    }
                                />
                                <div className="profile1-user-header-banner-msg">
                                    <span>alterar imagem</span>
                                </div>
                            </div>
                            <div 
                                className="profile1-user-header-avatar" 
                                onClick={()=>{ 
                                    setMyEditorOptions({
                                        type: "avatar",
                                        setImageOutput: setImageOutput,
                                        imageInput: 
                                            uploadBody.avatar && uploadBody.avatar.toDataURL()
                                            || userProfile.avatar
                                            || UserIcon
                                            ,
                                        setShowMyEditor: setShowMyEditor
                                    })
                                    showMyEditorHandle() 
                                }}
                                >
                                    <img 
                                        className="profile1-user-header-avatar-img" 
                                        alt="" 
                                        src={ 
                                            uploadBody.avatar && uploadBody.avatar.toDataURL()
                                            || userProfile.avatar
                                            || UserIcon
                                            }
                                    />
                                    <div className="profile1-user-header-avatar-msg">
                                        <span>alterar imagem</span>
                                    </div>
                            </div>
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
                        <input type="submit"  onClick={updateHandle} />
                        <div className="edit-profile-popup-header-div-1">
                            {flashMessages.length !== 0 || isLoading ?
                            '' : <h3 className="edit-profile-popup-header-div-1-title">Edite Seu Perfil</h3>}
                            <FlashMessages flashMessages={flashMessages}/>
                            {isLoading && <Loading/>}
                        </div>
                        <img className="edit-profile-popup-exit-icon" alt="" src={ExitIcon} onClick={changed ? props.hidePopUpHandle : ()=>{setShowPopUp(false)}}/>
                    </div>
                    <div className="edit-profile-popup-body">
                        {showMyEditor && 
                        <MyEditor 
                             {...myEditorOptions}
                        />}
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

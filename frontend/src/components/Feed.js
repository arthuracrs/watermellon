import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams } from "react-router-dom";

import Loading from './Loading'
import Post from './Post'

import FlashMessages from './FlashMessages'

import './Feed.css'

function Feed(props) {

    const [flashMessages, setFlashMessages] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const [refresh, setRefresh] = useState(false)

    const refreshHandle = () => { setRefresh(!refresh) }

    let { pathUsername } = useParams();

    function LoadPosts() {
        
        Axios.get(process.env.REACT_APP_API_URL + '/feed', { withCredentials: true })
            .then(res => {
                if (res.data.flashMessages[0].ok === false) setFlashMessages(res.data.flashMessages)
                if (res.data.flashMessages[0].ok === true) setPosts(res.data.query)
                setIsLoading(false)
            })
            .catch(error => console.error(error))
    }

    const abortSetStates = () => {
        setIsLoading({})
        setPosts({})
        setFlashMessages({})
    }

    useEffect(() => {
        LoadPosts()
        return abortSetStates
    }, [])

    useEffect(() => {
        LoadPosts()
    }, [refresh])

    function Content() {
        return (
            <div className="user-post-list">
                <div className="user-post-list-title-container">
                    <h3 className="user-post-list-title">{posts.length} Posts</h3>
                    <FlashMessages flashMessages={flashMessages} />
                    {posts.map(x=><Post refreshHandle={refreshHandle} key={x._id} x={x} />)}
                </div>
            </div>
        )
    }

    return (<div>{isLoading ? <Loading/> : <Content/>}</div>)
}

export default Feed

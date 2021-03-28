import React, { useEffect, useState } from 'react'
import Axios from 'axios'

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

    function LoadPosts() {

        Axios.get(process.env.REACT_APP_API_URL + '/user/feed', { withCredentials: true })
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
    }, [refresh])



    function Content() {
        return (
            <div className="user-post-list">
                <div className="user-post-list-title-container">
                    <h3 className="user-post-list-title">Feed</h3>
                    <FlashMessages flashMessages={ flashMessages }/> 
                    { posts.length === 0 ? 
                         <span className="user-post-list-none-post">Você deveria seguir alguns perfis</span>
                         : posts.map(x => <Post refreshHandle={refreshHandle} key={x._id} x={x} />) 
                    } 
                </div>
            </div>
        )
    }

    return (<div>{isLoading ? <Loading/> : <Content/>}</div>)
}

export default Feed

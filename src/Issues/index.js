import React, { useEffect, useState } from 'react'
import './index.css'
import { BsChatSquare } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'


function Issues() {
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [nextPage, setNextPage] = useState()
    const [prevPage, setPrevPage] = useState()

    let { page } = useParams()

    const init = async () => {
        let p = page || 0
        setNextPage(Number(page) + 1)
        setPrevPage(Number(page) - 1)
        setIsLoading(true)
        const owner = "react-native-video"
        const repo = "react-native-video"
        const url = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+type:issue+state:open&page=${p}`
        try {
            const res = await fetch(url)
            const data = await res.json()
            setIsLoading(false)
            setData(data)
        } catch (error) {
            setIsLoading(false)
        }
    }

    const formatDate = (d) => {
        const pd = new Date(d)
        const nd = new Date(Date.now())
        let t = Math.floor(Number(nd.getTime() - pd.getTime()) / 60000)
        if (t === 0) {
            return "Just Now";
        }
        if (t < 60) {
            return t + " min ago";
        }
        if (t >= 60 && t < 1440) {
            return (t / 60).toString().split(".")[0] + " hour ago"
        }
        if (t >= 1440 && t < 39200) {
            const days = (t / 1440).toString().split(".")[0]
            if (days == 1) {
                return "Yesterday"
            }
            return days + " days ago"
        }
        if (t > 39200 && t < 470400) {
            return (t / 39200).toString().split(".")[0] + " month ago"
        }
        if (t > 470400) {
            return (t / 470400).toString().split(".")[0] + " year ago"
        }
        return "a long ago"
    }

    useEffect(() => {
        init()
    }, [page])

    if (isLoading) {
        return (
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <h4>Loading....</h4>
            </div>
        )
    }
    if (!data) {
        return (
            <small>No Issues</small>
        )
    }

    return (
        <div className='container-fluid'>
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <div className='main'>
                            <header className='header'>
                                {data?.total_count} open
                            </header>
                            {
                                data?.items.map((o) => (
                                    <div key={o.id} className='content'>
                                        <div className='d-flex'>
                                            <div className='circle'>
                                                <div className='square'></div>
                                            </div>
                                            {/* title and desc */}
                                            <div>
                                                <div className='d-flex'>
                                                    <b className='title'>{o.title}</b>
                                                    {
                                                        o?.labels?.map((label) => (
                                                            <div key={label.id} className='label' style={{ color: '#' + label.color, backgroundColor: '#' + label.color + '30', border: '0.2px solid #' + label.color }} >
                                                                {label.name}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <small className='desc'>#{o.number} Opened {formatDate(o.created_at)} by {o.user.login}</small>
                                            </div>
                                        </div>
                                        {/* comments */}
                                        {
                                            o.comments && (
                                                <div className='chat-icon'>
                                                    <BsChatSquare color='silver' />
                                                    <small className='desc'>{o.comments}</small>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* pagination row */}
                <div className='row'>
                    <div className='col'>
                        {/* pagination */}
                        <ul className="pagination justify-content-center m-5">
                            {
                                Math.ceil(data.total_count / 30) > nextPage || (
                                    <li className="page-item">
                                        <Link to={"/" + prevPage} className="page-link my-bg">Previous</Link>
                                    </li>
                                )
                            }
                            {
                                [...Array(Math.ceil(data.total_count / 30))].map((el, page_no) => (
                                    <li key={page_no} className="page-item">
                                        <Link to={'/' + parseInt(page_no + 1)}
                                            className={`page-link my-bg ${page_no + 1 == (page || 1) && "active"}`}
                                        >
                                            {page_no + 1}
                                        </Link>
                                    </li>
                                ))
                            }
                            {
                                Math.ceil(data.total_count / 30) < nextPage || (
                                    <li className="page-item">
                                        <Link to={"/" + nextPage} className="page-link my-bg">Next</Link>
                                    </li>
                                )
                            }

                        </ul>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Issues
import React, { useState, useRef } from 'react';

import './explore.scss';
import { withRouter } from 'react-router';

import { ItemCard } from '../containers/Home';

import { exploreData } from '../assets/explore'


function ExploreApp() {

    const navigationList = [
        {
            title: '推荐',
            key: 'recommended',
            color: '',
        }, {
            title: '入门级',
            key: 'gettingStarted',
            color: '',
        }, {
            title: '英语教材',
            key: 'textbook',
            color: '',
        }, {
            title: '名著小说',
            key: 'classicNovel',
            color: '',
        }, {
            title: '技术文档',
            key: 'technicalDocuments',
            color: '',
        }, {
            title: '时事新闻',
            key: 'news',
            color: '',
        }, {
            title: '政治金融',
            key: 'politicalFinance',
            color: '',
        }, {
            title: '文史哲',
            key: 'history',
            color: '',
        }, {
            title: '体育运动',
            key: 'sports',
            color: '',
        }
    ]

    const navigationData = exploreData

    const [navigationIndex, setIndex] = useState(0);

    const seletedKey = navigationList[navigationIndex].key

    return (
        <>
            <header className="wrp-find-header">
                <NavigationBar
                    list={navigationList}
                    seleted={navigationIndex}
                    setIndex={setIndex}
                ></NavigationBar>
            </header>

            <div className="wrp-page wrp-card-container">
                {
                    navigationData[seletedKey].list.map((item, index) => (
                        <ItemCard data={item} key={item.url}></ItemCard>
                    ))
                }
            </div>
        </>
    )
}

function NavigationBar(props) {

    const scrollView = useRef(null);

    const wheel = (e) => {
        // console.log(e, '\n', e.deltaY)
        scrollView.current.scroll({
            left: scrollView.current.scrollLeft + e.deltaY,
            behavior: 'smooth'
        })
    }

    return (
        <>
            <div
                className="wrp-navigation-bar-wrapper"
                onWheel={wheel}
                ref={scrollView}
            >
                <ul className="wrp-navigation-bar-container">
                    {
                        props.list.map((item, index) => (
                            <li
                                className={`wrp-navigation-bar-item ${props.seleted === index
                                    ? 'wrp-navigation-selected' : ''}`}
                                onClick={() => props.setIndex(index)}
                                key={item.key}
                            >
                                {item.title}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default ExploreApp;
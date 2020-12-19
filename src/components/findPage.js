import React, { useState } from 'react';

import './findPage.scss';
import { withRouter } from 'react-router';

import { ItemCard } from '../Home.js';

import { exploreData } from '../assets/explore'


function FindPage() {

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

            <div className="wrp-page">
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

    return (
        <>
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
        </>
    )
}

export default FindPage;
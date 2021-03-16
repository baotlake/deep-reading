import React from 'react'
import {
    Link,
} from 'react-router-dom';

export interface ItemCardData {
    url?: string,
    key?: string,
    icon?: string,
    des?: string,
    title?: string
}

export default function ItemCard(props: {
    key?: any,
    data: ItemCardData,
}) {
    let data = props.data;
    if (!data) data = {};
    return (
        <Link
            to={`/wrp-read?${data.url ? 'url=' + encodeURIComponent(data.url) : 'key=' + data.key}`}
            className="wrp-card-wrapper"
            data-url={data.url}
            data-key={data.key}
        >
            <div className="wrp-image-wrapper wrp-card-image">
                <img className="wrp-image" src={data.icon}></img>
            </div>
            <div className="wrp-card-text-wrapper">
                <div className="wrp-ellipsis wrp-ct">{data.title}</div>
                <div className="wrp-cs">{data.des}</div>
            </div>
        </Link>
    )
}
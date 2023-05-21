import React from 'react'
import Breadcum from '../../components/Breadcum/Breadcum'
import { useLocation } from 'react-router-dom';

export default function FeedView() {
    let { state } = useLocation();
    console.log('from FeedView', state);
    return (
        <div>
            <Breadcum state={state} />
            <h1>FeedView</h1>
        </div>
    )
}

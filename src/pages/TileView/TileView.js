import React from 'react'
import Breadcum from '../../components/Breadcum/Breadcum'
import { useLocation } from 'react-router-dom';

export default function TileView() {
    let { state } = useLocation();
    console.log('from tileview', state);
    return (
        <div>
            <Breadcum state={state} />
            <h1>TileView</h1>
        </div>
    )
}

import React from 'react'

export default function TriangleRight({ id }) {
    return (
        <svg id={id} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
            width: '17px',
            height: '17px'
        }} >
            <rect width="16" height="16" id="icon-bound" fill="none" />
            <polygon points="13,8 5,16 5,0" fill='var(--greyColor)' />
        </svg>
    )
}
export function TriangleRightOutlined({ id }) {
    return (
        <svg id={id} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{
            width: '18px',
            height: '17px'
        }} >
            <rect width="16" height="16" id="icon-bound" fill="none" />
            <polygon points="13,8 5,16 5,0" fill='transparent' stroke='var(--greyColor)' />
        </svg>
    )
}

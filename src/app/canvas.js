"use client";
import {useRef} from 'react'
import React, { useEffect } from 'react';
const Canvas = props => {
    const ref=useRef();

    const draw = (context, count) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = 'grey'
        const delta = count % 800
        context.fillRect(10,10,100,10)
    }

    useEffect(() => {
        const canvas = ref.curent;
        const context = canvas.getContext('2d')
        draw(context)
        let count = 0
        let animationID

        const renderer = () => {
            count++
            draw(context.count)
            animationID = window.requestAnimationFrame(renderer)
        }
        renderer()
        return () => window.cancelAnimationFrame(animationID)
    },[])
    return <canvas ref={ref} {...props}/>
}
export default Canvas
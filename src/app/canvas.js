"use client";
import React, { useRef, useEffect } from 'react';

const Canvas = ({ width, height }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let drawing = false;

    const startDrawing = (e) => {
      drawing = true;
      draw(e);
    };

    const endDrawing = () => {
      drawing = false;
      context.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;
      context.lineWidth = 4;
      context.lineCap = 'round';
      context.strokeStyle = 'red';

      context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      context.stroke();
      context.beginPath();
      context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', endDrawing);
      canvas.removeEventListener('mousemove', draw);
    };
  }, []);

  return <canvas ref={canvasRef} width={1024} height={1366} style={{ position: 'relative', top: 0, zIndex: 1 }} />;
};

export default Canvas;
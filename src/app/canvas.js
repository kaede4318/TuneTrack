"use client";
import React, { useRef, useEffect } from 'react';

const Canvas = ({ width, height, drawingEnabled }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let drawing = false;

    const startDrawing = (e) => {
      if (!drawingEnabled) return; // Exit if drawing is not enabled
      drawing = true;
      draw(e);
    };

    const endDrawing = () => {
      if (!drawingEnabled) return; // Exit if drawing is not enabled
      drawing = false;
      context.beginPath();
    };

    const draw = (e) => {
      if (!drawing || !drawingEnabled) return; // Exit if not drawing or drawing is disabled
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
  }, [drawingEnabled]); // Add drawingEnabled to dependencies

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'relative', top: 0, zIndex: 1 }} />;
};

export default Canvas;

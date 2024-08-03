"use client";
import React, { useRef, useEffect } from 'react';

const Canvas = ({ width, height, drawingEnabled, eraseMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let drawing = false;

    const startDrawing = (e) => {
      if (!drawingEnabled && !eraseMode) return;
      drawing = true;
      draw(e);
    };

    const endDrawing = () => {
      if (!drawingEnabled && !eraseMode) return;
      drawing = false;
      context.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      context.lineWidth = 4;
      context.lineCap = 'round';

      if (eraseMode) {
        context.globalCompositeOperation = 'destination-out'; // Set to erase mode
        context.lineWidth = 10; // Larger line width for erasing
      } else {
        context.globalCompositeOperation = 'source-over'; // Set to drawing mode
        context.strokeStyle = 'red';
      }

      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', endDrawing);
      canvas.removeEventListener('mousemove', draw);
    };
  }, [drawingEnabled, eraseMode]); // Update effect when drawingEnabled or eraseMode changes

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'relative', top: 0, zIndex: 1 }} />;
};

export default Canvas;

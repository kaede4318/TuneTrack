import React, { useRef, useEffect } from 'react';

const Canvas = ({ width, height, drawingEnabled, eraseMode, clearCanvas, saveCanvasState, loadCanvasState }) => {
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

      context.lineWidth = eraseMode ? 25 : 4;
      context.lineCap = 'round';

      if (eraseMode) {
        context.globalCompositeOperation = 'destination-out';//erase
        context.lineWidth = 30;
      } else {
        context.globalCompositeOperation = 'source-over';//draw
        context.strokeStyle = 'rgb(54, 100, 158)';
      }

      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    };

    const handleClearCanvas = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    if (clearCanvas) {
      handleClearCanvas();
    }

    loadCanvasState(canvas);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', endDrawing);
      canvas.removeEventListener('mousemove', draw);
      saveCanvasState(canvas);
    };
  }, [drawingEnabled, eraseMode, clearCanvas, loadCanvasState, saveCanvasState]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'relative', top: 0, zIndex: 1 }} />;
};

export default Canvas;

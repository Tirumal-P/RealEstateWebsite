import React, { useRef, useEffect, useState } from 'react';

const SignaturePad = ({ onSignatureChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas to be responsive to the container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set line properties
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#000000';
    
    setCtx(context);

    // Handle window resize
    const handleResize = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#000000';
      context.putImageData(imageData, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    // Notify parent component about signature change
    if (onSignatureChange) {
      onSignatureChange(canvasRef.current.toDataURL());
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      ctx.closePath();
      setIsDrawing(false);
      
      // Notify parent component about signature change
      if (onSignatureChange) {
        onSignatureChange(canvasRef.current.toDataURL());
      }
    }
  };

  const getCoordinates = (e) => {
    let offsetX, offsetY;
    
    // Handle both mouse and touch events
    if (e.type.includes('touch')) {
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0] || e.changedTouches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }
    
    return { offsetX, offsetY };
  };

  const clearSignature = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setIsEmpty(true);
      
      // Notify parent component that signature is cleared
      if (onSignatureChange) {
        onSignatureChange(null);
      }
    }
  };

  return (
    <div className="signature-pad-container">
      <div className="signature-pad-wrapper" style={{ border: '1px solid #ccc', borderRadius: '4px', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          style={{ width: '100%', height: '150px', touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="signature-instructions text-center text-muted" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', opacity: isEmpty ? 1 : 0 }}>
          Sign here
        </div>
      </div>
      <div className="text-end mt-2">
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearSignature}>
          Clear Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
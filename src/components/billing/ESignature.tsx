"use client";

import { useRef, useState, useEffect } from "react";

export default function SignaturePad({ onSign, onClear }: { onSign: (data: string) => void, onClear?: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#000";
                ctx.lineCap = "round";
            }
        }
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        ctx?.beginPath();
        ctx?.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        ctx?.lineTo(clientX - rect.left, clientY - rect.top);
        ctx?.stroke();
        if (!hasSignature) setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas && hasSignature) {
            onSign(canvas.toDataURL());
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            setHasSignature(false);
            if (onClear) onClear();
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-50 touch-none">
                <canvas
                    ref={canvasRef}
                    className="w-full h-40 cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
                <p>Sign above using your mouse or finger</p>
                <button type="button" onClick={clear} className="text-red-500 hover:text-red-700 font-medium">
                    Clear Signature
                </button>
            </div>
        </div>
    );
}

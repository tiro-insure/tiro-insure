"use client";

import { useEffect, useRef } from "react";

export default function ParticleSphereAnimation({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const points = Array.from({ length: 180 }, (_, index) => {
      const y = 1 - (index / 179) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * index;
      return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
    });
    let frame = 0;
    let rotation = 0;

    const draw = () => {
      const size = Math.max(1, Math.floor(canvas.getBoundingClientRect().width));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== size * pixelRatio || canvas.height !== size * pixelRatio) {
        canvas.width = size * pixelRatio;
        canvas.height = size * pixelRatio;
      }
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, size, size);
      rotation += 0.004;
      const center = size / 2;
      const sphereRadius = size * 0.39;

      points.forEach((point) => {
        const x = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
        const z = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
        const depth = (z + 1) / 2;
        const dotSize = 0.7 + depth * 1.55;
        context.beginPath();
        context.arc(center + x * sphereRadius, center + point.y * sphereRadius, dotSize, 0, Math.PI * 2);
        context.fillStyle = `rgba(65, 164, 255, ${0.2 + depth * 0.8})`;
        context.fill();
      });

      frame = window.requestAnimationFrame(draw);
    };

    draw();
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

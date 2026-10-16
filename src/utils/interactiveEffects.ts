import React, { useEffect, useRef } from 'react';

/**
 * Hook for smooth 3D tilt on mouse move with requestAnimationFrame
 * Max tilt angle: 4-6 degrees as specified
 */
export function use3DTilt<T extends HTMLElement>(maxTiltDeg = 5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if device has fine pointer and motion is allowed
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const updateTransform = () => {
      // Lerp for smooth spring-like feel
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      element.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg) translateZ(0)`;

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        rafId = requestAnimationFrame(updateTransform);
      } else {
        element.style.transform = `perspective(1000px) rotateX(${targetX}deg) rotateY(${targetY}deg) translateZ(0)`;
        rafId = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for spotlight effect
      element.style.setProperty('--mouse-x', `${x}px`);
      element.style.setProperty('--mouse-y', `${y}px`);

      // Calculate tilt (-1 to 1 normalized)
      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      // rotateX tilts up/down based on Y; rotateY tilts left/right based on X
      targetX = -normY * maxTiltDeg;
      targetY = normX * maxTiltDeg;

      if (!rafId) {
        rafId = requestAnimationFrame(updateTransform);
      }
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(updateTransform);
      }
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
      element.style.transform = '';
    };
  }, [maxTiltDeg]);

  return ref;
}

/**
 * Trigger a ripple wave at click position
 */
export function createRipple(event: React.MouseEvent<HTMLElement>) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const circle = document.createElement('span');
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple-wave');

  const existingRipple = button.getElementsByClassName('ripple-wave')[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(circle);
  setTimeout(() => {
    circle.remove();
  }, 500);
}

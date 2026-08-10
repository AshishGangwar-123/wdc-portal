import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Direct positioning for inner dot
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      });

      // Smooth trailing positioning for outer ring
      gsap.to(follower, {
        x: mouseX,
        y: mouseY,
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.7, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.15 });
    };

    // Add interactive hover listeners for buttons & links
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, .interactive-hover');
      
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
          gsap.to(follower, { scale: 1.5, borderColor: '#ff007a', duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
          gsap.to(follower, { scale: 1, borderColor: 'rgba(0, 242, 254, 0.5)', duration: 0.2 });
        });
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
}

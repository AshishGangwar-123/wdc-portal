import React, { useState, useEffect, useRef } from 'react';

const PHRASES = [
  'AI / ML Workshops',
  'Web Dev Sessions',
  'Data Science Deep Dives',
  'Hackathon Prep',
  'C Programming Bootcamps',
];

export default function TypewriterText() {
  const [typedText, setTypedText] = useState('');
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let timeoutId;
    const tick = () => {
      const phrase = PHRASES[phraseIdx.current];
      if (!deleting.current) {
        setTypedText(phrase.slice(0, charIdx.current + 1));
        charIdx.current++;
        if (charIdx.current === phrase.length) {
          deleting.current = true;
          timeoutId = setTimeout(tick, 1800);
          return;
        }
      } else {
        setTypedText(phrase.slice(0, charIdx.current - 1));
        charIdx.current--;
        if (charIdx.current === 0) {
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % PHRASES.length;
        }
      }
      timeoutId = setTimeout(tick, deleting.current ? 50 : 80);
    };

    timeoutId = setTimeout(tick, 600);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <span style={{ color: '#00f2fe', fontWeight: 700, display: 'inline' }}>
      {typedText}
      <span className="type-cursor" />
    </span>
  );
}

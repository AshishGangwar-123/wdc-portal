/* ==========================================================================
   HTML & CSS Visual Cyber-DOM Holo-Lab — React Component v5
   50 Natural Language UI/UX Design Challenges + Granular Live CSS Engine
   ========================================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import soundManager from './soundManager';
import './HTMLCSSCommandRoom.css';

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
  const arr = [...(array || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Granular CSS Rule Parser: converts array of CSS strings into JS inline style object
const parseCSSRulesToStyle = (chipArray) => {
  const styleObj = {};
  (chipArray || []).forEach((rule) => {
    if (!rule || typeof rule !== 'string') return;
    const clean = rule.replace(';', '').trim();
    const colonIdx = clean.indexOf(':');
    if (colonIdx !== -1) {
      const prop = clean.substring(0, colonIdx).trim();
      const val = clean.substring(colonIdx + 1).trim();

      // Convert CSS property name to camelCase (e.g. border-radius -> borderRadius)
      const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styleObj[camelProp] = val;
    }
  });
  return styleObj;
};

const HTML_CSS_LEVELS = [
  {
    id: 1,
    title: 'Semantic DOM & Box Model',
    topic: 'padding, margin & border-radius',
    missions: [
      {
        problem: 'Design a sleek Holographic Cyber-Card: Add 20px internal spacing around the content, smooth out container corners with 16px radius, and outline the card with a glowing 2px neon-pink border (#ff007a).',
        correctSequence: ['padding: 20px;', 'border-radius: 16px;', 'border: 2px solid #ff007a;'],
        widgetPool: ['padding: 20px;', 'border-radius: 16px;', 'border: 2px solid #ff007a;', 'color: red;', 'margin: 50px;', 'background: yellow;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', color: '#f8fafc', background: 'rgba(255, 0, 122, 0.1)', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#ff007a' }}>🤖 CYBER-CARD M1</h3>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem' }}>Box Model Padding & Border</p>
          </div>
        )
      },
      {
        problem: 'Create a dark cyberpunk theme for the header component: Set the background to deep midnight purple (#120516), paint the text in electric cyan (#00f2fe), and add 24px internal padding for comfortable reading.',
        correctSequence: ['background: #120516;', 'color: #00f2fe;', 'padding: 24px;'],
        widgetPool: ['background: #120516;', 'color: #00f2fe;', 'padding: 24px;', 'color: red;', 'background: green;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', textAlign: 'center', border: '1px solid #00f2fe', borderRadius: 12 }}>
            <h3 style={{ margin: 0 }}>🎨 COLOR PALETTE M2</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>Background & Text Color</p>
          </div>
        )
      },
      {
        problem: 'Center the dashboard control panel horizontally on the page: Constrain its total width to 80% of the viewport, apply automatic side margins to center it, and align all internal header text centrally.',
        correctSequence: ['margin: 16px auto;', 'width: 80%;', 'text-align: center;'],
        widgetPool: ['margin: 16px auto;', 'width: 80%;', 'text-align: center;', 'text-align: right;', 'width: 20%;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ background: 'rgba(255, 0, 122, 0.15)', border: '1px solid #ff007a', borderRadius: 10, padding: 16 }}>
            <h3 style={{ margin: 0, color: '#f8fafc' }}>📐 ALIGNED CONTAINER M3</h3>
          </div>
        )
      },
      {
        problem: 'Add visual depth and soft outer glow to the Cyber-Box: Cast a cyan ambient shadow with 20px blur radius (rgba(0, 242, 254, 0.5)) and curve the card corners with 20px radius.',
        correctSequence: ['box-shadow: 0 4px 20px rgba(0, 242, 254, 0.5);', 'border-radius: 20px;'],
        widgetPool: ['box-shadow: 0 4px 20px rgba(0, 242, 254, 0.5);', 'border-radius: 20px;', 'box-shadow: none;', 'border-radius: 0px;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 20, background: '#080206', border: '1px solid #00f2fe', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#00f2fe' }}>✨ GLOW BOX M4</h3>
          </div>
        )
      },
      {
        problem: 'Construct a complete telemetry card box model: Add 20px inner padding, 10px outer margin, enclose it in a 2px solid emerald border (#10b981), and round the outer corners with a 12px radius.',
        correctSequence: ['padding: 20px;', 'margin: 10px;', 'border: 2px solid #10b981;', 'border-radius: 12px;'],
        widgetPool: ['padding: 20px;', 'margin: 10px;', 'border: 2px solid #10b981;', 'border-radius: 12px;', 'color: red;', 'border: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', background: 'rgba(16, 185, 129, 0.1)', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981' }}>🏆 MASTER BOX MODEL M5</h3>
          </div>
        )
      }
    ]
  },
  {
    id: 2,
    title: 'Flexbox Hero Alignment',
    topic: 'display: flex, justify-content & align-items',
    missions: [
      {
        problem: 'Arrange telemetry action buttons in a single horizontal bar: Activate flexbox container mode and push the items to opposite outer ends with space-between distribution.',
        correctSequence: ['display: flex;', 'justify-content: space-between;'],
        widgetPool: ['display: flex;', 'justify-content: space-between;', 'display: block;', 'justify-content: center;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid #00f2fe', padding: 12 }}>
            <div style={{ padding: '6px 12px', background: '#ff007a', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>CARD A</div>
            <div style={{ padding: '6px 12px', background: '#00f2fe', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>CARD B</div>
          </div>
        )
      },
      {
        problem: 'Create a perfectly centered hero splash badge: Enable flexbox container alignment, center the badge horizontally along the main axis, and align it vertically along the cross axis.',
        correctSequence: ['display: flex;', 'justify-content: center;', 'align-items: center;'],
        widgetPool: ['display: flex;', 'justify-content: center;', 'align-items: center;', 'align-items: flex-start;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', minHeight: 120, background: 'rgba(255, 0, 122, 0.1)', border: '1px solid #ff007a' }}>
            <div style={{ padding: '10px 20px', background: '#ff007a', borderRadius: 8, fontWeight: 700 }}>CENTER BADGE</div>
          </div>
        )
      },
      {
        problem: 'Build a vertical mobile navigation menu: Turn on flexbox container rules, switch the layout direction to stack menu items vertically in a column, and add a 12px gap between list items.',
        correctSequence: ['display: flex;', 'flex-direction: column;', 'gap: 12px;'],
        widgetPool: ['display: flex;', 'flex-direction: column;', 'gap: 12px;', 'flex-direction: row;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: 12 }}>
            <div style={{ padding: 8, background: '#38bdf8', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>ROW 1</div>
            <div style={{ padding: 8, background: '#00f2fe', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>ROW 2</div>
          </div>
        )
      },
      {
        problem: 'Create a responsive skill tag container: Enable flexbox wrapping so tag chips wrap onto new lines automatically when horizontal space runs out, with 10px gap spacing.',
        correctSequence: ['display: flex;', 'flex-wrap: wrap;', 'gap: 10px;'],
        widgetPool: ['display: flex;', 'flex-wrap: wrap;', 'gap: 10px;', 'flex-wrap: nowrap;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', background: 'rgba(255, 0, 122, 0.05)', border: '1px solid rgba(255,0,122,0.3)', padding: 12 }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ padding: '6px 12px', background: '#ff007a', borderRadius: 6, fontSize: '0.75rem' }}>TAG {n}</div>
            ))}
          </div>
        )
      },
      {
        problem: 'Assemble an equitable navigation bar layout: Activate flexbox with space-around distribution so items are evenly spaced with equal padding around each item, vertically centered with a 16px gap.',
        correctSequence: ['display: flex;', 'justify-content: space-around;', 'align-items: center;', 'gap: 16px;'],
        widgetPool: ['display: flex;', 'justify-content: space-around;', 'align-items: center;', 'gap: 16px;', 'display: block;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: 12 }}>
            <div style={{ padding: '8px 16px', background: '#10b981', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>PILL 1</div>
            <div style={{ padding: '8px 16px', background: '#38bdf8', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>PILL 2</div>
          </div>
        )
      }
    ]
  },
  {
    id: 3,
    title: 'CSS Grid Matrix Gallery',
    topic: 'display: grid, grid-template-columns & gap',
    missions: [
      {
        problem: 'Structure a 2-column layout grid: Enable CSS Grid layout mode and configure two equal-width fractional columns (1fr 1fr).',
        correctSequence: ['display: grid;', 'grid-template-columns: 1fr 1fr;'],
        widgetPool: ['display: grid;', 'grid-template-columns: 1fr 1fr;', 'display: flex;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', gap: 10, padding: 10, background: 'rgba(0, 242, 254, 0.05)', border: '1px solid #00f2fe' }}>
            <div style={{ padding: 10, background: '#00f2fe', color: '#080206', borderRadius: 6, fontWeight: 700 }}>COL 1</div>
            <div style={{ padding: 10, background: '#ff007a', borderRadius: 6, fontWeight: 700 }}>COL 2</div>
          </div>
        )
      },
      {
        problem: 'Build a 3-column media gallery matrix: Turn on CSS Grid, repeat 3 equal fractional columns, and separate grid cards with a 16px gap grid spacing.',
        correctSequence: ['display: grid;', 'grid-template-columns: repeat(3, 1fr);', 'gap: 16px;'],
        widgetPool: ['display: grid;', 'grid-template-columns: repeat(3, 1fr);', 'gap: 16px;', 'gap: 0px;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', background: 'rgba(255, 0, 122, 0.05)', padding: 12 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={{ height: 35, background: 'rgba(255, 0, 122, 0.2)', border: '1px solid #ff007a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>GRID {n}</div>
            ))}
          </div>
        )
      },
      {
        problem: 'Create a responsive auto-fitting grid layout: Use CSS Grid with repeat(auto-fit, minmax(100px, 1fr)) so grid cards automatically rearrange based on screen size, with 12px gap.',
        correctSequence: ['display: grid;', 'grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));', 'gap: 12px;'],
        widgetPool: ['display: grid;', 'grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));', 'gap: 12px;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', padding: 10, background: 'rgba(56, 189, 248, 0.1)' }}>
            <div style={{ padding: 8, background: '#38bdf8', color: '#080206', borderRadius: 6 }}>ITEM 1</div>
            <div style={{ padding: 8, background: '#38bdf8', color: '#080206', borderRadius: 6 }}>ITEM 2</div>
          </div>
        )
      },
      {
        problem: 'Configure asymmetrical grid gap spacing: Activate CSS Grid and set 20px vertical row gap spacing alongside 10px horizontal column gap spacing.',
        correctSequence: ['display: grid;', 'row-gap: 20px;', 'column-gap: 10px;'],
        widgetPool: ['display: grid;', 'row-gap: 20px;', 'column-gap: 10px;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', gridTemplateColumns: '1fr 1fr', padding: 10 }}>
            <div style={{ padding: 8, background: '#ff007a', borderRadius: 6 }}>R1C1</div>
            <div style={{ padding: 8, background: '#ff007a', borderRadius: 6 }}>R1C2</div>
          </div>
        )
      },
      {
        problem: 'Construct a main content & sidebar grid layout: Set up CSS Grid with a 2-part main area and 1-part sidebar (2fr 1fr), separated by 16px gap spacing.',
        correctSequence: ['display: grid;', 'grid-template-columns: 2fr 1fr;', 'gap: 16px;'],
        widgetPool: ['display: grid;', 'grid-template-columns: 2fr 1fr;', 'gap: 16px;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '100%', padding: 12, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981' }}>
            <div style={{ padding: 10, background: '#10b981', borderRadius: 6, fontWeight: 700 }}>MAIN CONTENT (2FR)</div>
            <div style={{ padding: 10, background: '#38bdf8', color: '#080206', borderRadius: 6, fontWeight: 700 }}>SIDEBAR (1FR)</div>
          </div>
        )
      }
    ]
  },
  {
    id: 4,
    title: 'Glassmorphism & Backdrop Filters',
    topic: 'backdrop-filter: blur & rgba background',
    missions: [
      {
        problem: 'Create a translucent glass backdrop: Set a 10% opacity white background layer using rgba(255, 255, 255, 0.1).',
        correctSequence: ['background: rgba(255, 255, 255, 0.1);'],
        widgetPool: ['background: rgba(255, 255, 255, 0.1);', 'background: #000000;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#f8fafc' }}>🔮 GLASS LAYER M1</h3>
          </div>
        )
      },
      {
        problem: 'Apply a frosted glass blur effect: Use backdrop-filter blur with a 16px blur radius to diffuse background pixels behind the card.',
        correctSequence: ['backdrop-filter: blur(16px);'],
        widgetPool: ['backdrop-filter: blur(16px);', 'backdrop-filter: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#38bdf8' }}>🔮 FROSTED BLUR M2</h3>
          </div>
        )
      },
      {
        problem: 'Outline the glass card with a delicate subtle highlight border: Apply a 1px solid translucent white border (rgba(255, 255, 255, 0.2)).',
        correctSequence: ['border: 1px solid rgba(255, 255, 255, 0.2);'],
        widgetPool: ['border: 1px solid rgba(255, 255, 255, 0.2);', 'border: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#00f2fe' }}>🔮 GLASS BORDER M3</h3>
          </div>
        )
      },
      {
        problem: 'Elevate the glass panel off the screen background: Add a deep ambient dark box shadow (0 8px 32px rgba(0, 0, 0, 0.37)).',
        correctSequence: ['box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);'],
        widgetPool: ['box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);', 'box-shadow: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#ff007a' }}>🔮 GLASS SHADOW M4</h3>
          </div>
        )
      },
      {
        problem: 'Assemble a complete Glassmorphism card component: Combine semi-transparent background (rgba(255, 255, 255, 0.08)), 16px backdrop blur, and 1px translucent glass border.',
        correctSequence: ['background: rgba(255, 255, 255, 0.08);', 'backdrop-filter: blur(16px);', 'border: 1px solid rgba(255, 255, 255, 0.2);'],
        widgetPool: ['background: rgba(255, 255, 255, 0.08);', 'backdrop-filter: blur(16px);', 'border: 1px solid rgba(255, 255, 255, 0.2);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', padding: 20, borderRadius: 16, color: '#f8fafc', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#38bdf8' }}>🏆 MASTER GLASS CARD M5</h3>
          </div>
        )
      }
    ]
  },
  {
    id: 5,
    title: 'Cyber Gradients & Neon Glows',
    topic: 'linear-gradient & box-shadow glow',
    missions: [
      {
        problem: 'Paint the CTA button with a vibrant cyber gradient: Apply a 135-degree linear gradient transitioning from neon pink (#ff007a) to electric cyan (#00f2fe).',
        correctSequence: ['background: linear-gradient(135deg, #ff007a 0%, #00f2fe 100%);'],
        widgetPool: ['background: linear-gradient(135deg, #ff007a 0%, #00f2fe 100%);', 'background: red;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: '16px 24px', borderRadius: 12, color: '#080206', textAlign: 'center', fontWeight: 900 }}>
            ⚡ GRADIENT BADGE M1
          </div>
        )
      },
      {
        problem: 'Add an intense neon pink outer radiance: Cast a 30px glowing pink box-shadow (0 0 30px rgba(255, 0, 122, 0.8)).',
        correctSequence: ['box-shadow: 0 0 30px rgba(255, 0, 122, 0.8);'],
        widgetPool: ['box-shadow: 0 0 30px rgba(255, 0, 122, 0.8);', 'box-shadow: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: '16px 24px', background: '#ff007a', borderRadius: 12, color: '#f8fafc', textAlign: 'center', fontWeight: 900 }}>
            ⚡ NEON GLOW M2
          </div>
        )
      },
      {
        problem: 'Create a gradient text mask effect: Clip the background gradient to text content using -webkit-background-clip: text and make text color transparent.',
        correctSequence: ['-webkit-background-clip: text;', 'color: transparent;'],
        widgetPool: ['-webkit-background-clip: text;', 'color: transparent;', 'color: white;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, background: 'linear-gradient(135deg, #ff007a, #00f2fe)', textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem' }}>TEXT GRADIENT M3</h2>
          </div>
        )
      },
      {
        problem: 'Create a dual-tone neon aura: Apply a multi-layered box shadow featuring a 20px inner pink glow and 40px outer cyan aura (#ff007a & #00f2fe).',
        correctSequence: ['box-shadow: 0 0 20px #ff007a, 0 0 40px #00f2fe;'],
        widgetPool: ['box-shadow: 0 0 20px #ff007a, 0 0 40px #00f2fe;', 'box-shadow: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, background: '#080206', border: '1px solid #ff007a', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#00f2fe' }}>⚡ DUAL GLOW M4</h3>
          </div>
        )
      },
      {
        problem: 'Assemble a master Cyberpunk Action Button: Combine a 135-degree neon gradient background with a 30px pink glowing shadow.',
        correctSequence: ['background: linear-gradient(135deg, #ff007a, #00f2fe);', 'box-shadow: 0 0 30px rgba(255, 0, 122, 0.8);'],
        widgetPool: ['background: linear-gradient(135deg, #ff007a, #00f2fe);', 'box-shadow: 0 0 30px rgba(255, 0, 122, 0.8);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: '18px 24px', borderRadius: 14, color: '#080206', textAlign: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
            🏆 MASTER NEON BUTTON M5
          </div>
        )
      }
    ]
  },
  {
    id: 6,
    title: '3D Perspective Card Transforms',
    topic: 'transform: perspective() rotateY()',
    missions: [
      {
        problem: 'Rotate the tile in 3D space: Apply a 25-degree Y-axis rotation transform.',
        correctSequence: ['transform: rotateY(25deg);'],
        widgetPool: ['transform: rotateY(25deg);', 'transform: rotate(180deg);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '75%', padding: 20, background: 'rgba(121, 40, 202, 0.3)', border: '2px solid #7928ca', borderRadius: 14, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#a855f7' }}>🧊 3D ROTATE M1</h3>
          </div>
        )
      },
      {
        problem: 'Add true 3D spatial vanishing depth: Set a 600px perspective viewport and rotate the card 25 degrees along the Y-axis.',
        correctSequence: ['transform: perspective(600px) rotateY(25deg);'],
        widgetPool: ['transform: perspective(600px) rotateY(25deg);', 'transform: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '75%', padding: 20, background: 'rgba(121, 40, 202, 0.3)', border: '2px solid #7928ca', borderRadius: 14, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#a855f7' }}>🧊 3D PERSPECTIVE M2</h3>
          </div>
        )
      },
      {
        problem: 'Preserve 3D depth rendering for nested child elements: Enable transform-style: preserve-3d.',
        correctSequence: ['transform-style: preserve-3d;'],
        widgetPool: ['transform-style: preserve-3d;', 'transform-style: flat;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '75%', padding: 20, background: 'rgba(121, 40, 202, 0.3)', border: '2px solid #7928ca', borderRadius: 14, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#a855f7' }}>🧊 PRESERVE 3D M3</h3>
          </div>
        )
      },
      {
        problem: 'Tilt the card forward toward the user: Apply a 20-degree X-axis rotation with 600px 3D perspective.',
        correctSequence: ['transform: perspective(600px) rotateX(20deg);'],
        widgetPool: ['transform: perspective(600px) rotateX(20deg);', 'transform: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '75%', padding: 20, background: 'rgba(121, 40, 202, 0.3)', border: '2px solid #7928ca', borderRadius: 14, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#a855f7' }}>🧊 3D TILT M4</h3>
          </div>
        )
      },
      {
        problem: 'Assemble a master 3D Spatial Hologram Tile: Apply 600px perspective with 25-degree Y-rotation and preserve 3D rendering context.',
        correctSequence: ['transform: perspective(600px) rotateY(25deg);', 'transform-style: preserve-3d;'],
        widgetPool: ['transform: perspective(600px) rotateY(25deg);', 'transform-style: preserve-3d;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '75%', padding: 20, background: 'rgba(121, 40, 202, 0.3)', border: '2px solid #7928ca', borderRadius: 14, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#a855f7' }}>🏆 MASTER 3D TILE M5</h3>
          </div>
        )
      }
    ]
  },
  {
    id: 7,
    title: 'CSS Micro-Animations & Scale',
    topic: 'transition: all & transform: scale()',
    missions: [
      {
        problem: 'Smooth out visual state changes: Enable CSS transition for all properties over 0.3 seconds with an ease timing function.',
        correctSequence: ['transition: all 0.3s ease;'],
        widgetPool: ['transition: all 0.3s ease;', 'transition: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '70%', padding: 18, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981' }}>🚀 TRANSITION M1</h3>
          </div>
        )
      },
      {
        problem: 'Enlarge the element for a hover pop effect: Apply a 1.15x scale transformation.',
        correctSequence: ['transform: scale(1.15);'],
        widgetPool: ['transform: scale(1.15);', 'transform: scale(0.5);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '70%', padding: 18, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981' }}>🚀 SCALE M2</h3>
          </div>
        )
      },
      {
        problem: 'Create a tactile hover lift effect: Translate the card 8px upward along the Y-axis.',
        correctSequence: ['transform: translateY(-8px);'],
        widgetPool: ['transform: translateY(-8px);', 'transform: translateY(50px);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '70%', padding: 18, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981' }}>🚀 HOVER LIFT M3</h3>
          </div>
        )
      },
      {
        problem: 'Fade the card opacity slightly for a subtle pulse: Set container opacity to 85%.',
        correctSequence: ['opacity: 0.85;'],
        widgetPool: ['opacity: 0.85;', 'opacity: 0.1;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '70%', padding: 18, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981' }}>🚀 OPACITY M4</h3>
          </div>
        )
      },
      {
        problem: 'Assemble a master Interactive Micro-Animation node: Combine 0.3s smooth property transitions with a 1.15x hover scale zoom transform.',
        correctSequence: ['transition: all 0.3s ease;', 'transform: scale(1.15);'],
        widgetPool: ['transition: all 0.3s ease;', 'transform: scale(1.15);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '70%', padding: 18, background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#10b981' }}>🏆 MASTER SCALE M5</h3>
          </div>
        )
      }
    ]
  },
  {
    id: 8,
    title: 'Responsive Flex Direction',
    topic: 'flex-direction: column & gap',
    missions: [
      {
        problem: 'Initialize flexible container layout mode: Enable display: flex.',
        correctSequence: ['display: flex;'],
        widgetPool: ['display: flex;', 'display: block;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: 12 }}>
            <div style={{ padding: 8, background: '#38bdf8', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>ITEM 1</div>
          </div>
        )
      },
      {
        problem: 'Switch layout direction for mobile viewport size: Set flex container direction to vertical column stacking.',
        correctSequence: ['display: flex;', 'flex-direction: column;'],
        widgetPool: ['display: flex;', 'flex-direction: column;', 'flex-direction: row;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: 12 }}>
            <div style={{ padding: 8, background: '#38bdf8', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>ITEM 1</div>
            <div style={{ padding: 8, background: '#00f2fe', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>ITEM 2</div>
          </div>
        )
      },
      {
        problem: 'Add clean separation between stacked mobile rows: Apply a 12px vertical flex gap.',
        correctSequence: ['display: flex;', 'flex-direction: column;', 'gap: 12px;'],
        widgetPool: ['display: flex;', 'flex-direction: column;', 'gap: 12px;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: 12 }}>
            <div style={{ padding: 8, background: '#38bdf8', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>ITEM 1</div>
            <div style={{ padding: 8, background: '#00f2fe', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>ITEM 2</div>
          </div>
        )
      },
      {
        problem: 'Ensure all vertical stacked rows expand to fill container width: Set flex cross-axis alignment to stretch.',
        correctSequence: ['display: flex;', 'flex-direction: column;', 'align-items: stretch;'],
        widgetPool: ['display: flex;', 'flex-direction: column;', 'align-items: stretch;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: 12 }}>
            <div style={{ padding: 8, background: '#38bdf8', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>FULL STRETCH</div>
          </div>
        )
      },
      {
        problem: 'Assemble a complete Responsive Mobile Column Layout: Activate flexbox container mode, switch direction to vertical column stacking, and add a 12px gap between rows.',
        correctSequence: ['display: flex;', 'flex-direction: column;', 'gap: 12px;'],
        widgetPool: ['display: flex;', 'flex-direction: column;', 'gap: 12px;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: 12 }}>
            <div style={{ padding: 8, background: '#38bdf8', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>HEADER ROW</div>
            <div style={{ padding: 8, background: '#00f2fe', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#080206' }}>CONTENT ROW</div>
          </div>
        )
      }
    ]
  },
  {
    id: 9,
    title: 'CSS Custom Variables',
    topic: 'var(--neon-cyan) & dynamic tokens',
    missions: [
      {
        problem: 'Theme the component text using a design token: Assign text color using custom variable var(--neon-cyan, #00f2fe).',
        correctSequence: ['color: var(--neon-cyan, #00f2fe);'],
        widgetPool: ['color: var(--neon-cyan, #00f2fe);', 'color: red;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, border: '2px solid #00f2fe', borderRadius: 12, textAlign: 'center', background: 'rgba(0, 242, 254, 0.05)' }}>
            <h3 style={{ margin: 0 }}>🎨 TEXT VARIABLE M1</h3>
          </div>
        )
      },
      {
        problem: 'Theme the card border using a design token: Assign border color using custom variable var(--neon-cyan, #00f2fe).',
        correctSequence: ['border-color: var(--neon-cyan, #00f2fe);'],
        widgetPool: ['border-color: var(--neon-cyan, #00f2fe);', 'border-color: transparent;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, color: '#00f2fe', border: '2px solid', borderRadius: 12, textAlign: 'center', background: 'rgba(0, 242, 254, 0.05)' }}>
            <h3 style={{ margin: 0 }}>🎨 BORDER VARIABLE M2</h3>
          </div>
        )
      },
      {
        problem: 'Theme the container background using a translucent glass token: Assign background using var(--glass-bg, rgba(255, 0, 122, 0.15)).',
        correctSequence: ['background: var(--glass-bg, rgba(255, 0, 122, 0.15));'],
        widgetPool: ['background: var(--glass-bg, rgba(255, 0, 122, 0.15));', 'background: green;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, border: '2px solid #ff007a', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#ff007a' }}>🎨 BG VARIABLE M3</h3>
          </div>
        )
      },
      {
        problem: 'Theme the ambient box glow shadow: Assign shadow aura using custom variable var(--neon-glow, 0 0 25px #00f2fe).',
        correctSequence: ['box-shadow: var(--neon-glow, 0 0 25px #00f2fe);'],
        widgetPool: ['box-shadow: var(--neon-glow, 0 0 25px #00f2fe);', 'box-shadow: none;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, background: '#080206', borderRadius: 12, textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#00f2fe' }}>🎨 GLOW VARIABLE M4</h3>
          </div>
        )
      },
      {
        problem: 'Assemble a master Dynamic Design Token Component: Apply custom CSS variable tokens for both text color and container border color.',
        correctSequence: ['color: var(--neon-cyan, #00f2fe);', 'border-color: var(--neon-cyan, #00f2fe);'],
        widgetPool: ['color: var(--neon-cyan, #00f2fe);', 'border-color: var(--neon-cyan, #00f2fe);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '80%', padding: 16, border: '2px solid', borderRadius: 12, textAlign: 'center', background: 'rgba(0, 242, 254, 0.05)' }}>
            <h3 style={{ margin: 0 }}>🏆 MASTER VARIABLE TOKEN M5</h3>
          </div>
        )
      }
    ]
  },
  {
    id: 10,
    title: 'Advanced Cyberpunk UI Dashboard',
    topic: 'clip-path & polygon styling',
    missions: [
      {
        problem: 'Sculpt a futuristic angled cyberpunk badge: Apply a 4-point polygon clipping path (clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%)).',
        correctSequence: ['clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);'],
        widgetPool: ['clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);', 'clip-path: circle(50%);'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', padding: '16px 24px', background: '#ff007a', color: '#f8fafc', fontWeight: 900, textAlign: 'center' }}>
            🏆 POLYGON CLIP M1
          </div>
        )
      },
      {
        problem: 'Paint the clipped badge with solid neon pink background: Set background to #ff007a.',
        correctSequence: ['background: #ff007a;'],
        widgetPool: ['background: #ff007a;', 'background: black;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', padding: '16px 24px', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)', color: '#f8fafc', fontWeight: 900, textAlign: 'center' }}>
            🏆 BADGE COLOR M2
          </div>
        )
      },
      {
        problem: 'Add wide character tracking for a high-tech UI header: Apply letter-spacing: 0.15em.',
        correctSequence: ['letter-spacing: 0.15em;'],
        widgetPool: ['letter-spacing: 0.15em;', 'letter-spacing: normal;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', padding: '16px 24px', background: '#ff007a', color: '#f8fafc', fontWeight: 900, textAlign: 'center' }}>
            TYPOGRAPHY M3
          </div>
        )
      },
      {
        problem: 'Capitalize all badge text automatically: Apply text-transform: uppercase.',
        correctSequence: ['text-transform: uppercase;'],
        widgetPool: ['text-transform: uppercase;', 'text-transform: lowercase;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', padding: '16px 24px', background: '#ff007a', color: '#f8fafc', fontWeight: 900, textAlign: 'center' }}>
            cyber text m4
          </div>
        )
      },
      {
        problem: 'Assemble a master Cyberpunk UI Dashboard Badge: Combine 4-point angled polygon clipping with a solid neon pink background.',
        correctSequence: ['clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);', 'background: #ff007a;'],
        widgetPool: ['clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);', 'background: #ff007a;'],
        previewHTML: (
          <div className="holo-preview-element" style={{ width: '85%', padding: '16px 24px', color: '#f8fafc', fontWeight: 900, textAlign: 'center', fontSize: '1rem' }}>
            🏆 CYBER DASHBOARD BADGE M5
          </div>
        )
      }
    ]
  }
];

export default function HTMLCSSCommandRoom({ onBack }) {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [placedChips, setPlacedChips] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executingLogs, setExecutingLogs] = useState([]);
  const [showVictory, setShowVictory] = useState(false);

  // Track Completed Levels
  const getInitialCompletedLevels = () => {
    try {
      const raw = localStorage.getItem('htmlcss_completed_levels');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const [completedLevelIds, setCompletedLevelIds] = useState(getInitialCompletedLevels);

  const getInitialMaxUnlocked = () => {
    try {
      const raw = parseInt(localStorage.getItem('htmlcss_max_unlocked_level') || '1', 10);
      const computedFromCompleted = getInitialCompletedLevels().length > 0
        ? Math.max(...getInitialCompletedLevels()) + 1
        : 1;
      return Math.max(1, isNaN(raw) ? 1 : raw, computedFromCompleted);
    } catch (e) {
      return 1;
    }
  };

  const [maxUnlockedLevelId, setMaxUnlockedLevelId] = useState(getInitialMaxUnlocked);

  const isLevelUnlocked = (lvlId) => {
    return lvlId === 1 || completedLevelIds.includes(lvlId) || lvlId <= maxUnlockedLevelId;
  };

  const level = HTML_CSS_LEVELS.find((l) => l.id === currentLevelId) || HTML_CSS_LEVELS[0];
  const missions = level?.missions || [];
  const currentMission = missions[currentMissionIdx] || missions[0];

  // Granular Real-time Inline Style Parser: parses EVERY chip in placedChips (even wrong/distractors!)
  const livePreviewStyle = useMemo(() => {
    return parseCSSRulesToStyle(placedChips);
  }, [placedChips]);

  // Scramble Widget Chips
  const shuffledPool = useMemo(() => {
    return shuffleArray(currentMission?.widgetPool || []);
  }, [currentLevelId, currentMissionIdx, currentMission]);

  useEffect(() => {
    try { soundManager.init(); soundManager.resume(); } catch (e) {}
    setPlacedChips([]);
    setExecutingLogs([`>>> Visual Cyber-DOM Engine Ready. Select CSS property chips to style Mission ${currentMissionIdx + 1}/5!`]);
    setShowVictory(false);
    setIsRunning(false);
  }, [currentLevelId, currentMissionIdx]);

  const handleAddChip = (chip) => {
    try { soundManager.playClick(); } catch (e) {}
    setPlacedChips((prev) => [...prev, chip]);
  };

  const handleRemoveChip = (idx) => {
    try { soundManager.playClick(); } catch (e) {}
    setPlacedChips((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAutoConnect = () => {
    try { soundManager.playCollect(); } catch (e) {}
    setPlacedChips(currentMission?.correctSequence || []);
  };

  const handleSelectLevel = (lvlId) => {
    if (!isLevelUnlocked(lvlId)) {
      try { soundManager.playWrong(); } catch (e) {}
      setExecutingLogs([`🔒 LEVEL ${lvlId} IS LOCKED! Complete Level ${lvlId - 1} first to unlock.`]);
      return;
    }
    try { soundManager.playClick(); } catch (e) {}
    setCurrentLevelId(lvlId);
    setCurrentMissionIdx(0);
  };

  const handleVerifyDesign = () => {
    if (isRunning) return;

    try {
      try { soundManager.init(); soundManager.resume(); } catch (e) {}

      const userSeq = (placedChips || []).join(' ').replace(/\s+/g, ' ').trim();
      const targetSeq = (currentMission?.correctSequence || []).join(' ').replace(/\s+/g, ' ').trim();

      const isCorrect = userSeq.length > 0 && userSeq === targetSeq;

      setIsRunning(true);
      try { soundManager.playNitro(); } catch (e) {}
      setExecutingLogs([`>>> 🎨 EVALUATING VISUAL CYBER-DOM STYLESHEET (MISSION ${currentMissionIdx + 1}/5)...`]);

      let logIdx = 0;
      const logsList = [
        '>>> [CSS Parser] Inspecting box model rules & layout dimensions...',
        '>>> [GPU Compositor] Rendering visual Holo-Canvas style matrix...',
        '>>> SUCCESS: Visual Design Matched 100% Perfectly!'
      ];

      const interval = setInterval(() => {
        try {
          if (logIdx < logsList.length) {
            const currentLog = logsList[logIdx];
            setExecutingLogs((prev) => [...prev, currentLog]);
            logIdx++;
          } else {
            clearInterval(interval);
            setIsRunning(false);

            if (isCorrect) {
              try { soundManager.playLevelComplete(); } catch (e) {}

              if (currentMissionIdx < missions.length - 1) {
                setTimeout(() => {
                  setCurrentMissionIdx((prev) => prev + 1);
                }, 800);
              } else {
                // All 5 missions completed for this level!
                if (!completedLevelIds.includes(currentLevelId)) {
                  const nextCompleted = [...completedLevelIds, currentLevelId];
                  setCompletedLevelIds(nextCompleted);
                  try { localStorage.setItem('htmlcss_completed_levels', JSON.stringify(nextCompleted)); } catch (e) {}
                }

                const nextUnlocked = Math.max(maxUnlockedLevelId, currentLevelId + 1);
                setMaxUnlockedLevelId(nextUnlocked);
                try { localStorage.setItem('htmlcss_max_unlocked_level', nextUnlocked.toString()); } catch (e) {}

                setShowVictory(true);
              }
            } else {
              try { soundManager.playWrong(); } catch (e) {}
              setExecutingLogs((prev) => [
                ...prev,
                '⚠️ STYLE MISMATCH: Check property order or remove distractor CSS chips!',
              ]);
            }
          }
        } catch (err) {
          clearInterval(interval);
          setIsRunning(false);
          setExecutingLogs((prev) => [...prev, `⚠️ ERROR: ${err?.message || 'Execution error'}`]);
        }
      }, 350);
    } catch (err) {
      setIsRunning(false);
      setExecutingLogs((prev) => [...prev, `⚠️ FATAL ERROR: ${err?.message || 'Fatal error'}`]);
    }
  };

  return (
    <div className="htmlcss-room-container">
      {/* ── Top Header ── */}
      <div className="htmlcss-header">
        <div className="htmlcss-title-group">
          <div className="htmlcss-subtitle" style={{ fontSize: '0.85rem', color: '#ff007a', fontWeight: 800 }}>
            Level {level?.id || 1} of 10: {level?.title || ''} — Mission {currentMissionIdx + 1} / 5
          </div>
        </div>

        <div className="htmlcss-header-controls">
          <button className="htmlcss-btn-back" onClick={onBack}>
            ← Back to Picker
          </button>

          <button className="htmlcss-btn-back" onClick={handleAutoConnect} style={{ color: '#00f2fe', borderColor: 'rgba(0, 242, 254, 0.4)' }}>
            ⚡ AUTO-SOLVE DESIGN
          </button>

          <button className="htmlcss-btn-run" onClick={handleVerifyDesign} disabled={isRunning}>
            {isRunning ? '⏳ RENDERING...' : '▶ VERIFY DESIGN ALIGNMENT'}
          </button>
        </div>
      </div>

      {/* ── Workspace ── */}
      <div className="htmlcss-workspace">
        {/* Left Sidebar */}
        <div className="htmlcss-sidebar">
          <div className="htmlcss-section-title">VISUAL DESIGN MISSIONS</div>
          <div className="htmlcss-level-pills">
            {(HTML_CSS_LEVELS || []).map((lvl) => {
              const isCompleted = completedLevelIds.includes(lvl.id);
              const isActive = currentLevelId === lvl.id;
              const unlocked = isLevelUnlocked(lvl.id);

              return (
                <div
                  key={lvl.id}
                  className={`htmlcss-level-pill ${isActive ? 'active' : isCompleted ? 'completed' : !unlocked ? 'locked' : ''}`}
                  onClick={() => handleSelectLevel(lvl.id)}
                  style={{ opacity: !unlocked ? 0.45 : 1 }}
                >
                  <span>L{lvl.id}: {lvl.title}</span>
                  <span>{isActive ? '⚡' : isCompleted ? '✅' : !unlocked ? '🔒' : '🔓'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Studio Area */}
        <div className="htmlcss-center-area">
          {/* Mission Objective Banner */}
          <div className="htmlcss-objective-banner">
            <div>
              <span style={{ color: '#ff007a', fontSize: '0.8rem', fontFamily: '"Fira Code", monospace', display: 'block', marginBottom: 2 }}>
                🎯 DESIGN MISSION {currentMissionIdx + 1} OF 5:
              </span>
              <span>📋 {currentMission?.problem || ''}</span>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255, 0, 122, 0.2)', color: '#ff007a', fontFamily: '"Fira Code", monospace', fontSize: '0.75rem' }}>
              {currentMissionIdx + 1}/5
            </div>
          </div>

          {/* Dual Panel Studio Grid */}
          <div className="htmlcss-studio-grid">
            {/* Left Panel: Live Holo-Canvas Interactive Preview */}
            <div className="htmlcss-preview-card">
              <div className="htmlcss-preview-header">
                <span>🖼️ LIVE HOLO-CANVAS PREVIEW</span>
                <span style={{ color: '#00f2fe', fontSize: '0.72rem' }}>Applied CSS Rules: {placedChips.length}</span>
              </div>

              <div className="htmlcss-preview-stage">
                {React.cloneElement(currentMission.previewHTML, {
                  style: { ...currentMission.previewHTML.props.style, ...livePreviewStyle }
                })}
              </div>
            </div>

            {/* Right Panel: CSS Property Pipeline & Chips Palette */}
            <div className="htmlcss-pipeline-card">
              <div className="htmlcss-preview-header">
                <span>🎨 CSS STYLE PIPELINE (CONNECTED RULES):</span>
                <button
                  onClick={() => setPlacedChips([])}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Clear Styles ✕
                </button>
              </div>

              <div className="htmlcss-pipeline-slots">
                {placedChips.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: '"Fira Code", monospace', padding: 8 }}>
                    👇 Click CSS property chips below to connect them into style pipeline...
                  </div>
                ) : (
                  placedChips.map((chip, idx) => (
                    <div key={idx} className="htmlcss-chip-item" onClick={() => handleRemoveChip(idx)}>
                      <span>{chip}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>✕</span>
                    </div>
                  ))
                )}
              </div>

              <div className="htmlcss-section-title" style={{ margin: '8px 0 0 0' }}>
                AVAILABLE CSS CHIPS (CLICK TO CONNECT):
              </div>
              <div className="htmlcss-widgets-grid">
                {shuffledPool.map((chip, idx) => {
                  const isUsed = placedChips.includes(chip);
                  return (
                    <div
                      key={idx}
                      className={`htmlcss-widget-chip ${isUsed ? 'used' : ''}`}
                      onClick={() => !isUsed && handleAddChip(chip)}
                    >
                      {chip}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Console Terminal Output ── */}
      <div className="htmlcss-terminal">
        <div className="htmlcss-logs-container">
          {executingLogs.map((log, idx) => (
            <div key={idx} className={`htmlcss-log-line ${log?.includes('SUCCESS') ? 'htmlcss-log-success' : ''}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* ── Victory Celebration Modal ── */}
      {showVictory && (
        <div className="htmlcss-modal-overlay">
          <div className="htmlcss-modal-card">
            <div style={{ fontSize: '3.5rem' }}>🎉 🎨⚡</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ff007a', margin: 0 }}>
              LEVEL {level?.id || 1} ALL 5 MISSIONS COMPLETED!
            </h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
              You successfully styled all 5 missions for <strong>{level?.title || ''}</strong>!
            </div>
            <div style={{ display: 'flex', gap: 6, fontSize: '1.5rem', margin: '8px 0' }}>
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>

            <button
              className="htmlcss-btn-run"
              onClick={() => {
                if (currentLevelId < HTML_CSS_LEVELS.length) {
                  setCurrentLevelId((prev) => prev + 1);
                  setCurrentMissionIdx(0);
                } else {
                  onBack();
                }
              }}
            >
              {currentLevelId < HTML_CSS_LEVELS.length ? 'NEXT DESIGN LEVEL ➔' : 'BACK TO MENU'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Code City Explorer — 2D/Pseudo-3D Cyberpunk City Canvas Renderer v3
   Renders curvy Bézier highways, entrance archways, living NPC traffic cars,
   tire drift marks, nitro flames, rain atmosphere, and Mini-Map Radar HUD!
   ========================================================================== */

import { CITY_MAP, CITY_PALETTE, DESTINATION_CATEGORIES, VEHICLES } from './gameConstants';
import { ROAD_PATHS } from './roadGeometry';

// ── Color Alpha Utility ───────────────────────────────────────────────────
export function toAlphaColor(color, alpha = 0.4) {
  if (!color) return `rgba(0, 242, 254, ${alpha})`;
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  if (color.startsWith('hsl')) {
    return color.replace(/hsla?\(([^)]+)\)/, (match, p1) => {
      const parts = p1.split(',').map((s) => s.trim());
      return `hsla(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
    });
  }
  return color;
}

// ── Render Skid Marks Layer ────────────────────────────────────────────────
function drawSkidMarks(ctx, skidMarks) {
  if (!skidMarks || skidMarks.length === 0) return;

  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineCap = 'round';

  for (const mark of skidMarks) {
    ctx.globalAlpha = mark.life;
    ctx.beginPath();
    ctx.moveTo(mark.x1, mark.y1);
    ctx.lineTo(mark.x2, mark.y2);
    ctx.stroke();
  }

  ctx.restore();
}

// ── Draw Curvy & Straight Road Network ────────────────────────────────────
function drawRoadNetwork(ctx, theme) {
  const accentColor = theme?.accent || CITY_PALETTE.roadDash;
  const borderStyle = theme?.roadBorder || CITY_PALETTE.roadBorder;

  // 1. Draw Road Asphalt Surface
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const path of ROAD_PATHS) {
    ctx.beginPath();
    if (path.type === 'line') {
      ctx.moveTo(path.p0.x, path.p0.y);
      ctx.lineTo(path.p1.x, path.p1.y);
    } else if (path.type === 'bezier') {
      ctx.moveTo(path.p0.x, path.p0.y);
      ctx.bezierCurveTo(path.p1.x, path.p1.y, path.p2.x, path.p2.y, path.p3.x, path.p3.y);
    }

    ctx.strokeStyle = path.isGate ? toAlphaColor(accentColor, 0.15) : CITY_PALETTE.road;
    ctx.lineWidth = path.width;
    ctx.stroke();

    // Road Border Glow Lines
    ctx.strokeStyle = path.isGate ? accentColor : borderStyle;
    ctx.lineWidth = path.width + 4;
    ctx.globalCompositeOperation = 'destination-over';
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  // 2. Draw Dashed Centerlines
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 14]);

  for (const path of ROAD_PATHS) {
    if (path.isGate) continue;

    ctx.beginPath();
    if (path.type === 'line') {
      ctx.moveTo(path.p0.x, path.p0.y);
      ctx.lineTo(path.p1.x, path.p1.y);
    } else if (path.type === 'bezier') {
      ctx.moveTo(path.p0.x, path.p0.y);
      ctx.bezierCurveTo(path.p1.x, path.p1.y, path.p2.x, path.p2.y, path.p3.x, path.p3.y);
    }
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

// ── Draw Entrance Archway Gates for Driveways ─────────────────────────────
function drawEntranceGates(ctx, time) {
  const gatePaths = ROAD_PATHS.filter((p) => p.isGate);

  for (const gatePath of gatePaths) {
    const entranceX = gatePath.p0.x;
    const entranceY = gatePath.p0.y;

    const pulse = 1 + Math.sin(time * 4 + entranceX) * 0.1;

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f2fe';

    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(entranceX - 22, entranceY, 6 * pulse, 0, Math.PI * 2);
    ctx.arc(entranceX + 22, entranceY, 6 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(entranceX - 22, entranceY);
    ctx.lineTo(entranceX + 22, entranceY);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}

// ── Draw Buildings with Pseudo-3D Heights & Neon Ads ──────────────────────
function drawBuildings(ctx, time, language = 'python') {
  const { ROAD_GRID_X, ROAD_GRID_Y, ROAD_WIDTH } = CITY_MAP;
  const rw = ROAD_WIDTH / 2 + 20;

  const langUpper = (language || 'python').toUpperCase();
  const langAd = langUpper === 'JAVASCRIPT' ? 'JS ES2024' : langUpper === 'CPP' ? 'C++20 GRID' : langUpper === 'C' ? 'C17 ENGINE' : langUpper === 'JAVA' ? 'JAVA 21 VM' : 'PYTHON 3.12';
  const ads = ['SYNTAX OK', 'CYBER CITY', langAd, 'DATA FLOW', 'NEON RUN'];
  let adIdx = 0;

  for (let i = 0; i < ROAD_GRID_X.length - 1; i++) {
    for (let j = 0; j < ROAD_GRID_Y.length - 1; j++) {
      const x1 = ROAD_GRID_X[i] + rw;
      const y1 = ROAD_GRID_Y[j] + rw;
      const x2 = ROAD_GRID_X[i + 1] - rw;
      const y2 = ROAD_GRID_Y[j + 1] - rw;
      const bw = x2 - x1;
      const bh = y2 - y1;

      if (bw <= 40 || bh <= 40) continue;

      ctx.fillStyle = CITY_PALETTE.grass;
      ctx.fillRect(x1, y1, bw, bh);

      const margin = 12;
      const houseW = (bw - margin * 3) / 2;
      const houseH = (bh - margin * 3) / 2;

      for (let hx = 0; hx < 2; hx++) {
        for (let hy = 0; hy < 2; hy++) {
          const bx = x1 + margin + hx * (houseW + margin);
          const by = y1 + margin + hy * (houseH + margin);

          // Pseudo 3D shadow depth
          ctx.fillStyle = 'rgba(4, 6, 18, 0.9)';
          ctx.fillRect(bx + 4, by + 4, houseW, houseH);

          // Main Building Base
          ctx.fillStyle = 'rgba(12, 16, 40, 0.92)';
          ctx.strokeStyle = 'rgba(121, 40, 202, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.fillRect(bx, by, houseW, houseH);
          ctx.strokeRect(bx, by, houseW, houseH);

          // Roof Bevel Inner Layer
          ctx.fillStyle = 'rgba(0, 242, 254, 0.04)';
          ctx.fillRect(bx + 4, by + 4, houseW - 8, houseH - 8);

          // Windows glowing
          ctx.fillStyle = Math.sin(time * 2 + bx) > 0 ? 'rgba(255, 212, 59, 0.75)' : 'rgba(0, 242, 254, 0.5)';
          ctx.fillRect(bx + 8, by + 8, 6, 6);
          ctx.fillRect(bx + houseW - 14, by + 8, 6, 6);
          ctx.fillRect(bx + 8, by + houseH - 14, 6, 6);
          ctx.fillRect(bx + houseW - 14, by + houseH - 14, 6, 6);

          // Animated Neon Rooftop Ads (every 3rd house)
          if ((hx + hy + i + j) % 3 === 0) {
            const adText = ads[adIdx % ads.length];
            adIdx++;
            ctx.font = 'bold 8px "Fira Code", monospace';
            ctx.fillStyle = '#00f2fe';
            ctx.textAlign = 'center';
            ctx.fillText(adText, bx + houseW / 2, by + houseH / 2);
          }
        }
      }
    }
  }
}

// ── Draw Cyber Traffic NPC Cars ───────────────────────────────────────────
function drawNPCs(ctx, npcs, time) {
  if (!npcs) return;

  for (const npc of npcs) {
    ctx.save();
    ctx.translate(npc.x, npc.y);
    ctx.rotate(npc.angle);

    // Headlight cone
    const lightGrad = ctx.createRadialGradient(20, 0, 2, 60, 0, 30);
    lightGrad.addColorStop(0, 'rgba(255, 212, 59, 0.35)');
    lightGrad.addColorStop(1, 'rgba(255, 212, 59, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(8, -8);
    ctx.lineTo(70, -25);
    ctx.lineTo(70, 25);
    ctx.lineTo(8, 8);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = npc.color || '#ff0055';
    roundRect(ctx, -14, -8, 28, 16, 4);
    ctx.fill();

    // Windshield
    ctx.fillStyle = '#05060f';
    roundRect(ctx, -4, -6, 12, 12, 2);
    ctx.fill();

    // Tail lights
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-14, -6, 2, 3);
    ctx.fillRect(-14, 3, 2, 3);

    ctx.restore();
  }
}

// ── Draw Destination Signboards ───────────────────────────────────────────
function drawDestinations(ctx, destinations, activeNearDestId, collectedDestIds, time) {
  for (const dest of destinations) {
    const isNear = dest.id === activeNearDestId;
    const isCollected = collectedDestIds.includes(dest.id);
    const cat = DESTINATION_CATEGORIES[dest.category] || DESTINATION_CATEGORIES.home;

    const pulse = isNear ? 1 + Math.sin(time * 6) * 0.15 : 1;

    // Ground Ring
    if (isNear) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#00f2fe';
      ctx.beginPath();
      ctx.arc(dest.x, dest.y, CITY_MAP.PROXIMITY_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    }

    // Destination Marker Post
    ctx.fillStyle = isCollected ? '#10b981' : cat.color;
    ctx.shadowBlur = isNear ? 20 : 10;
    ctx.shadowColor = isCollected ? '#10b981' : cat.color;

    ctx.beginPath();
    ctx.arc(dest.x, dest.y, 14 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isCollected ? '✓' : cat.icon, dest.x, dest.y);

    // Vintage/Neon Signboard
    const boardW = 210;
    const boardH = 62;
    const boardX = dest.x - boardW / 2;
    const boardY = dest.y - 78;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(dest.x, dest.y);
    ctx.lineTo(dest.x, boardY + boardH);
    ctx.stroke();

    ctx.shadowBlur = isNear ? 25 : 12;
    ctx.shadowColor = isCollected ? '#10b981' : isNear ? '#00f2fe' : cat.color;

    ctx.fillStyle = 'rgba(8, 10, 28, 0.95)';
    ctx.strokeStyle = isCollected ? '#10b981' : isNear ? '#00f2fe' : cat.color;
    ctx.lineWidth = isNear ? 2.5 : 1.5;

    roundRect(ctx, boardX, boardY, boardW, boardH, 10);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.fillStyle = isCollected ? '#10b981' : '#f0f4ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`${cat.icon} ${dest.name}`, dest.x, boardY + 6);

    ctx.font = 'bold 10px "Fira Code", monospace';
    ctx.fillStyle = isCollected ? '#64748b' : '#00f2fe';
    const displayCode = dest.code.length > 24 ? dest.code.substring(0, 22) + '...' : dest.code;
    ctx.fillText(displayCode, dest.x, boardY + 24);

    if (isCollected) {
      ctx.font = 'bold 9px "Outfit", sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText('COLLECTED IN DECK ✓', dest.x, boardY + 44);
    } else if (isNear) {
      ctx.font = 'bold 9px "Outfit", sans-serif';
      ctx.fillStyle = '#ffd43b';
      ctx.fillText('CLICK 📥 COLLECT IN POPUP!', dest.x, boardY + 44);
    } else {
      ctx.font = '9px "Outfit", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Drive through gate to collect', dest.x, boardY + 44);
    }
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

// ── Draw Player Car with Nitro Flame & Tail Lights ─────────────────────────
function drawCar(ctx, car, vehicleConfig, isNitro, time) {
  const { x, y, angle } = car;
  const vehicle = vehicleConfig || VEHICLES[0];
  const primaryColor = vehicle.color || '#00f2fe';

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Nitro Exhaust Thruster Flame
  if (isNitro) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00f2fe';
    const flameLen = 30 + Math.random() * 20;

    const flameGrad = ctx.createLinearGradient(-18, 0, -18 - flameLen, 0);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.4, '#00f2fe');
    flameGrad.addColorStop(1, 'rgba(121, 40, 202, 0)');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-18, -6);
    ctx.lineTo(-18 - flameLen, 0);
    ctx.lineTo(-18, 6);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Headlights beam
  const lightGrad = ctx.createRadialGradient(25, 0, 2, 90, 0, 45);
  lightGrad.addColorStop(0, toAlphaColor(primaryColor, 0.4));
  lightGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
  ctx.fillStyle = lightGrad;
  ctx.beginPath();
  ctx.moveTo(10, -10);
  ctx.lineTo(100, -40);
  ctx.lineTo(100, 40);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 18;
  ctx.shadowColor = primaryColor;

  // Car Body
  ctx.fillStyle = primaryColor;
  roundRect(ctx, -18, -10, 36, 20, 5);
  ctx.fill();

  // Glass Roof / Windshield
  ctx.fillStyle = '#05060f';
  roundRect(ctx, -6, -7, 16, 14, 3);
  ctx.fill();

  // Red Tail Lights
  ctx.fillStyle = '#ff0050';
  ctx.fillRect(-18, -8, 3, 4);
  ctx.fillRect(-18, 4, 3, 4);

  // Front Headlight bulbs
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(16, -8, 3, 3);
  ctx.fillRect(16, 5, 3, 3);

  ctx.restore();
  ctx.shadowBlur = 0;
}

// ── Draw Particles ───────────────────────────────────────────────────────
function drawParticles(ctx, particles) {
  for (const p of particles) {
    if (p.life <= 0) continue;
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color + Math.floor(alpha * 225).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Draw Cyberpunk Rain Atmosphere ────────────────────────────────────────
function drawRain(ctx, rainDrops, viewW, viewH) {
  if (!rainDrops) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  for (const r of rainDrops) {
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x - 4, r.y + r.len);
  }
  ctx.stroke();
  ctx.restore();
}

// ── Mini-Map Radar HUD Renderer (Top-Right Canvas Overlay) ────────────────
function drawMiniMap(ctx, state, viewW, viewH) {
  const size = 130;
  const padding = 16;
  const mx = viewW - size - padding;
  const my = padding + 60; // place below top score HUD

  ctx.save();
  // Radar background container
  ctx.fillStyle = 'rgba(8, 10, 28, 0.88)';
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, mx, my, size, size, 16);
  ctx.fill();
  ctx.stroke();

  // Clip content inside mini-map
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, mx, my, size, size, 16);
  ctx.clip();

  const mapScaleX = size / CITY_MAP.WIDTH;
  const mapScaleY = size / CITY_MAP.HEIGHT;

  // Draw scaled road grid lines
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
  ctx.lineWidth = 4;
  for (const rx of CITY_MAP.ROAD_GRID_X) {
    ctx.beginPath();
    ctx.moveTo(mx + rx * mapScaleX, my);
    ctx.lineTo(mx + rx * mapScaleX, my + size);
    ctx.stroke();
  }
  for (const ry of CITY_MAP.ROAD_GRID_Y) {
    ctx.beginPath();
    ctx.moveTo(mx, my + ry * mapScaleY);
    ctx.lineTo(mx + size, my + ry * mapScaleY);
    ctx.stroke();
  }

  // Destination dots
  for (const dest of state.destinations) {
    const isCol = state.collectedDestIds.includes(dest.id);
    ctx.fillStyle = isCol ? '#10b981' : '#ffd43b';
    ctx.beginPath();
    ctx.arc(mx + dest.x * mapScaleX, my + dest.y * mapScaleY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Player car blip
  const carMx = mx + state.car.x * mapScaleX;
  const carMy = my + state.car.y * mapScaleY;

  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00f2fe';
  ctx.fillStyle = '#00f2fe';
  ctx.beginPath();
  ctx.arc(carMx, carMy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore(); // end clip

  // Radar Scanner Sweep Line
  const sweepAngle = (performance.now() / 1000) * 2;
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mx + size / 2, my + size / 2);
  ctx.lineTo(
    mx + size / 2 + Math.cos(sweepAngle) * (size / 2),
    my + size / 2 + Math.sin(sweepAngle) * (size / 2)
  );
  ctx.stroke();

  // Radar Title
  ctx.font = 'bold 8px "Fira Code", monospace';
  ctx.fillStyle = '#00f2fe';
  ctx.textAlign = 'center';
  ctx.fillText('CYBER RADAR', mx + size / 2, my + size - 4);

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN RENDER FUNCTION
// ═══════════════════════════════════════════════════════════════════════════
export function renderCityFrame(ctx, state, viewWidth, viewHeight) {
  const time = performance.now() / 1000;

  ctx.fillStyle = CITY_PALETTE.bg;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  const camX = Math.max(viewWidth / 2, Math.min(CITY_MAP.WIDTH - viewWidth / 2, state.car.x));
  const camY = Math.max(viewHeight / 2, Math.min(CITY_MAP.HEIGHT - viewHeight / 2, state.car.y));

  ctx.save();
  ctx.translate(viewWidth / 2 - camX, viewHeight / 2 - camY);

  // 1. Draw Road Network (Curvy highways & straight avenues)
  drawRoadNetwork(ctx, state.theme);

  // 2. Draw Skid Marks
  drawSkidMarks(ctx, state.skidMarks);

  // 3. Draw Entrance Archway Gates
  drawEntranceGates(ctx, time);

  // 4. Draw Buildings
  drawBuildings(ctx, time, state.language);

  // 5. Draw Cyber Traffic NPC Cars
  drawNPCs(ctx, state.npcs, time);

  // 6. Draw Destinations & Signboards
  drawDestinations(ctx, state.destinations, state.activeNearDestId, state.collectedDestIds, time);

  // 7. Draw Particles
  drawParticles(ctx, state.particles);

  // 8. Draw Player Car
  drawCar(ctx, state.car, state.vehicleConfig, state.isNitro, time);

  ctx.restore();

  // 9. Screen space effects: Cyber Rain Atmosphere
  if (state.rainDrops) {
    drawRain(ctx, state.rainDrops, viewWidth, viewHeight);
  }

  // 10. Screen space overlay: Cyber Radar Mini-Map
  drawMiniMap(ctx, state, viewWidth, viewHeight);
}


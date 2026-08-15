/* ==========================================================================
   CodeFuel v2 — Canvas 2D Renderer
   Pseudo-3D road, code rain, game objects — pure Canvas drawing
   Zero WebGL, ultra lightweight, mobile friendly
   ========================================================================== */

import { ROAD, VISUAL, WALL_CODE, CODE_RAIN_CHARS } from './gameConstants';

// ── Projection: world coords → screen coords ────────────────────────────
function project(z, lane, w, h) {
  // z: distance from player (0=at player, MAX_Z=far)
  // lane: 0(left), 1(center), 2(right)
  const maxZ = ROAD.MAX_Z;
  const progress = 1 - Math.min(z / maxZ, 1); // 0=far, 1=close
  const t = Math.pow(progress, 1.6); // curve for perspective

  const vanishX = w * 0.5;
  const vanishY = h * ROAD.VANISH_Y;
  const bottomY = h * ROAD.BOTTOM_Y;
  const roadW = w * ROAD.WIDTH_FRACTION;

  // Lane X positions at the bottom of screen
  const laneOffset = (lane - 1) * (roadW * 0.30);
  const targetX = vanishX + laneOffset;

  const sx = vanishX + (targetX - vanishX) * t;
  const sy = vanishY + (bottomY - vanishY) * t;
  const scale = 0.05 + t * 0.95;

  return { sx, sy, scale };
}

// ── Draw Background + Code Rain ──────────────────────────────────────────
function drawBackground(ctx, w, h, state) {
  // Dark gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#020208');
  grad.addColorStop(0.4, '#050510');
  grad.addColorStop(1, '#0a0c1e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Code rain
  const cols = state.codeRain;
  if (!cols) return;
  ctx.font = '11px "Fira Code", monospace';
  for (let i = 0; i < cols.length; i++) {
    const col = cols[i];
    const x = col.x;
    for (let j = 0; j < col.chars.length; j++) {
      const y = ((col.offset + j * 18) % (h + 100)) - 50;
      const alpha = Math.max(0, 0.12 - j * 0.012);
      ctx.fillStyle = `rgba(55, 118, 171, ${alpha})`;
      ctx.fillText(col.chars[j], x, y);
    }
  }
}

// ── Draw Road (perspective trapezoid) ────────────────────────────────────
function drawRoad(ctx, w, h, state) {
  const vanishX = w * 0.5;
  const vanishY = h * ROAD.VANISH_Y;
  const bottomY = h * ROAD.BOTTOM_Y;
  const roadW = w * ROAD.WIDTH_FRACTION;
  const topW = roadW * 0.06;

  // Road surface
  ctx.beginPath();
  ctx.moveTo(vanishX - topW / 2, vanishY);
  ctx.lineTo(vanishX + topW / 2, vanishY);
  ctx.lineTo(vanishX + roadW / 2, bottomY);
  ctx.lineTo(vanishX - roadW / 2, bottomY);
  ctx.closePath();

  const roadGrad = ctx.createLinearGradient(0, vanishY, 0, bottomY);
  roadGrad.addColorStop(0, 'rgba(8, 10, 25, 0.9)');
  roadGrad.addColorStop(1, 'rgba(12, 14, 35, 0.95)');
  ctx.fillStyle = roadGrad;
  ctx.fill();

  // Road edges (glowing lines)
  ctx.strokeStyle = 'rgba(55, 118, 171, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(vanishX - topW / 2, vanishY);
  ctx.lineTo(vanishX - roadW / 2, bottomY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(vanishX + topW / 2, vanishY);
  ctx.lineTo(vanishX + roadW / 2, bottomY);
  ctx.stroke();

  // Lane dividers (dashed, perspective)
  const segments = 20;
  for (let s = 0; s < segments; s++) {
    const zNear = (s / segments);
    const zFar = ((s + 0.5) / segments);
    const tNear = Math.pow(1 - zNear, 1.6);
    const tFar = Math.pow(1 - zFar, 1.6);

    // Scroll effect
    const scrolledS = (s + (state.scrollOffset || 0) * segments * 0.5) % segments;
    if (scrolledS % 2 < 1) continue;

    for (let lane = 0; lane < 2; lane++) {
      const laneRatio = (lane + 1) / 3;
      const xNearL = vanishX + (-roadW / 2 + roadW * laneRatio) * tNear * (1 - zNear) + (vanishX - vanishX) * (1 - tNear);
      const xFarL = vanishX + (-roadW / 2 + roadW * laneRatio) * tFar * (1 - zFar) + (vanishX - vanishX) * (1 - tFar);

      // Simplified lane divider positioning
      const fNear = 1 - zNear;
      const fFar = 1 - zFar;
      const tN = Math.pow(fNear, 1.6);
      const tF = Math.pow(fFar, 1.6);
      const offset = (lane - 0.5) * roadW * 0.30;

      const x1 = vanishX + offset * tF;
      const y1 = vanishY + (bottomY - vanishY) * tF;
      const x2 = vanishX + offset * tN;
      const y2 = vanishY + (bottomY - vanishY) * tN;

      ctx.strokeStyle = `rgba(55, 118, 171, ${0.15 * tN})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // Terminal prompts on road (scrolling >>> markers)
  ctx.font = '10px "Fira Code", monospace';
  for (let d = 0; d < 8; d++) {
    const zPos = ((d * 25 + (state.scrollOffset || 0) * 80) % ROAD.MAX_Z);
    const { sx, sy, scale } = project(zPos, 1, w, h);
    if (scale < 0.15) continue;
    ctx.fillStyle = `rgba(55, 118, 171, ${0.08 * scale})`;
    ctx.fillText('>>>', sx - 10 * scale, sy + 2);
  }
  ctx.setLineDash([]);
}

// ── Draw Canyon Walls (scrolling code on sides) ──────────────────────────
function drawCanyonWalls(ctx, w, h, state) {
  const vanishY = h * ROAD.VANISH_Y;
  const bottomY = h * ROAD.BOTTOM_Y;
  const roadW = w * ROAD.WIDTH_FRACTION;
  const wallWidth = Math.max(60, (w - roadW) / 2 - 20);

  // Left wall
  const leftX = (w - roadW) / 2 - wallWidth + 10;
  // Right wall
  const rightX = (w + roadW) / 2 + 10;

  ctx.font = '9px "Fira Code", monospace';
  const lineHeight = 14;
  const scrollY = ((state.scrollOffset || 0) * 40) % lineHeight;

  const visibleLines = Math.floor((bottomY - vanishY) / lineHeight) + 2;
  const startIdx = Math.floor((state.scrollOffset || 0) * 2) % WALL_CODE.length;

  for (let i = 0; i < visibleLines; i++) {
    const y = vanishY + 20 + i * lineHeight - scrollY;
    if (y < vanishY || y > bottomY) continue;

    const progress = (y - vanishY) / (bottomY - vanishY);
    const alpha = 0.08 + progress * 0.12;
    const codeIdx = (startIdx + i) % WALL_CODE.length;
    const line = WALL_CODE[codeIdx];

    if (!line) continue;

    // Syntax-color the wall code (simplified)
    const isKeyword = /^(def|class|for|while|if|else|try|except|import|from|return|async|with)\b/.test(line.trim());
    const isDecorator = line.trim().startsWith('@');
    const hasString = /"[^"]*"|'[^']*'/.test(line);

    let color;
    if (isDecorator) color = `rgba(199, 146, 234, ${alpha})`;
    else if (isKeyword) color = `rgba(199, 146, 234, ${alpha})`;
    else if (hasString) color = `rgba(195, 232, 141, ${alpha})`;
    else color = `rgba(130, 170, 255, ${alpha * 0.7})`;

    ctx.fillStyle = color;

    // Left wall
    if (leftX > 0) {
      ctx.fillText(line.substring(0, 25), leftX, y);
    }
    // Right wall
    if (rightX + wallWidth < w) {
      ctx.fillText(line.substring(0, 25), rightX, y);
    }
  }
}

// ── Draw Code Gate ───────────────────────────────────────────────────────
function drawGate(ctx, gate, w, h, playerLane) {
  if (gate.z > ROAD.MAX_Z || gate.z < -5) return;

  for (let lane = 0; lane < 3; lane++) {
    const { sx, sy, scale } = project(gate.z, lane, w, h);
    if (scale < 0.08) continue;

    const opt = gate.options[lane];
    const gateW = 60 * scale;
    const gateH = 40 * scale;
    const x = sx - gateW / 2;
    const y = sy - gateH;

    // Gate frame
    let borderColor, bgColor, textColor;
    if (gate.passed) {
      if (opt.isCorrect) {
        borderColor = 'rgba(16, 185, 129, 0.8)';
        bgColor = 'rgba(16, 185, 129, 0.12)';
        textColor = '#10b981';
      } else if (gate.hitLane === lane) {
        borderColor = 'rgba(255, 0, 80, 0.8)';
        bgColor = 'rgba(255, 0, 80, 0.12)';
        textColor = '#ff4d6d';
      } else {
        borderColor = 'rgba(255, 255, 255, 0.08)';
        bgColor = 'rgba(10, 12, 30, 0.5)';
        textColor = '#64748b';
      }
    } else {
      borderColor = `rgba(0, 242, 254, ${0.3 + scale * 0.3})`;
      bgColor = `rgba(10, 12, 30, ${0.6 + scale * 0.2})`;
      textColor = '#e2e8f0';
    }

    // Draw gate box
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = Math.max(1, 1.5 * scale);
    roundRect(ctx, x, y, gateW, gateH, 4 * scale);
    ctx.fill();
    ctx.stroke();

    // Bracket decorations
    if (scale > 0.25) {
      ctx.fillStyle = `rgba(0, 242, 254, ${0.15 * scale})`;
      const bracketSize = Math.max(6, 10 * scale);
      ctx.font = `bold ${bracketSize}px "Fira Code", monospace`;
      ctx.fillText('[', x + 2 * scale, y + gateH * 0.65);
      ctx.fillText(']', x + gateW - bracketSize * 0.6, y + gateH * 0.65);
    }

    // Value text
    if (scale > 0.15) {
      const fontSize = Math.max(7, 13 * scale);
      ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(opt.value, sx, sy - gateH * 0.35);
      ctx.textAlign = 'left';
    }
  }

  // Expression banner (above gates)
  if (gate.z < ROAD.MAX_Z * 0.85) {
    const { sx: cx, sy: cy, scale: cs } = project(gate.z, 1, w, h);
    if (cs > 0.12) {
      const fontSize = Math.max(8, 11 * cs);
      ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(199, 146, 234, ${0.4 + cs * 0.5})`;
      ctx.fillText(gate.expr, cx, cy - 48 * cs);

      // Underline
      const textW = ctx.measureText(gate.expr).width;
      ctx.strokeStyle = `rgba(199, 146, 234, ${0.15 * cs})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - textW / 2, cy - 44 * cs);
      ctx.lineTo(cx + textW / 2, cy - 44 * cs);
      ctx.stroke();

      ctx.textAlign = 'left';
    }
  }
}

// ── Draw Token ───────────────────────────────────────────────────────────
function drawToken(ctx, token, w, h, time) {
  if (token.collected || token.z > ROAD.MAX_Z || token.z < -3) return;
  const { sx, sy, scale } = project(token.z, token.lane, w, h);
  if (scale < 0.1) return;

  const radius = Math.max(4, 14 * scale);
  const pulse = 1 + Math.sin(time * 4 + token.z) * 0.1;

  // Glow
  ctx.shadowBlur = 12 * scale;
  ctx.shadowColor = token.color;

  // Circle
  ctx.beginPath();
  ctx.arc(sx, sy - radius, radius * pulse, 0, Math.PI * 2);
  ctx.fillStyle = token.color + '25';
  ctx.fill();
  ctx.strokeStyle = token.color + 'aa';
  ctx.lineWidth = Math.max(1, 1.5 * scale);
  ctx.stroke();

  // Text
  if (scale > 0.2) {
    const fontSize = Math.max(6, 9 * scale);
    ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
    ctx.fillStyle = token.color;
    ctx.textAlign = 'center';
    ctx.fillText(token.text, sx, sy - radius + 1);
    ctx.textAlign = 'left';
  }

  ctx.shadowBlur = 0;
}

// ── Draw Bug ─────────────────────────────────────────────────────────────
function drawBug(ctx, bug, w, h, time) {
  if (bug.hit || bug.z > ROAD.MAX_Z || bug.z < -3) return;
  const { sx, sy, scale } = project(bug.z, bug.lane, w, h);
  if (scale < 0.1) return;

  const bw = Math.max(20, 55 * scale);
  const bh = Math.max(10, 22 * scale);
  const pulse = 1 + Math.sin(time * 6 + bug.z * 0.5) * 0.08;
  const x = sx - bw / 2;
  const y = sy - bh;

  // Red glow
  ctx.shadowBlur = 15 * scale;
  ctx.shadowColor = '#ff0050';

  // Bug body
  ctx.fillStyle = `rgba(255, 0, 80, ${0.08 + scale * 0.1})`;
  ctx.strokeStyle = `rgba(255, 0, 80, ${0.4 + scale * 0.4})`;
  ctx.lineWidth = Math.max(1, 1.5 * scale);
  roundRect(ctx, x, y, bw * pulse, bh, 3 * scale);
  ctx.fill();
  ctx.stroke();

  // Error text
  if (scale > 0.2) {
    const fontSize = Math.max(6, 8 * scale);
    ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
    ctx.fillStyle = '#ff4d6d';
    ctx.textAlign = 'center';
    ctx.fillText(`⚠ ${bug.type}`, sx, sy - bh * 0.35);
    ctx.textAlign = 'left';
  }

  ctx.shadowBlur = 0;
}

// ── Draw Power-up ────────────────────────────────────────────────────────
function drawPowerup(ctx, pu, w, h, time) {
  if (pu.collected || pu.z > ROAD.MAX_Z || pu.z < -3) return;
  const { sx, sy, scale } = project(pu.z, pu.lane, w, h);
  if (scale < 0.1) return;

  const size = Math.max(12, 28 * scale);
  const pulse = 1 + Math.sin(time * 3) * 0.1;
  const x = sx - size / 2;
  const y = sy - size;
  const rotation = time * 0.5;

  // Golden glow
  ctx.shadowBlur = 18 * scale;
  ctx.shadowColor = pu.color;

  // Crate (diamond shape)
  ctx.save();
  ctx.translate(sx, sy - size * 0.5);
  ctx.rotate(rotation);
  ctx.beginPath();
  const s = size * 0.5 * pulse;
  ctx.moveTo(0, -s);
  ctx.lineTo(s, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s, 0);
  ctx.closePath();
  ctx.fillStyle = pu.color + '20';
  ctx.fill();
  ctx.strokeStyle = pu.color + 'cc';
  ctx.lineWidth = Math.max(1, 2 * scale);
  ctx.stroke();
  ctx.restore();

  // Label
  if (scale > 0.25) {
    const fontSize = Math.max(6, 8 * scale);
    ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
    ctx.fillStyle = pu.color;
    ctx.textAlign = 'center';
    ctx.fillText(pu.desc, sx, sy + 6 * scale);
    ctx.textAlign = 'left';
  }

  ctx.shadowBlur = 0;
}

// ── Draw Player ──────────────────────────────────────────────────────────
function drawPlayer(ctx, state, w, h, time) {
  const { sx, sy } = project(0, 1, w, h); // base position
  const roadW = w * ROAD.WIDTH_FRACTION;
  const laneOffset = (state.player.smoothX) * (roadW * 0.30);
  const px = w / 2 + laneOffset;
  const py = h * ROAD.BOTTOM_Y - 10;

  const size = 16;

  // Ship body (triangle/arrow)
  ctx.save();
  ctx.translate(px, py);

  // Shield glow
  if (state.player.shield) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00f2fe';
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 242, 254, ${0.3 + Math.sin(time * 4) * 0.15})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Immunity glow
  if (state.player.immune) {
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#7928ca';
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.7, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(121, 40, 202, ${0.3 + Math.sin(time * 5) * 0.2})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Ship shape
  ctx.shadowBlur = 10;
  ctx.shadowColor = state.player.boosted ? '#f59e0b' : '#00f2fe';

  ctx.beginPath();
  ctx.moveTo(0, -size);       // tip
  ctx.lineTo(-size * 0.7, size * 0.5);  // bottom left
  ctx.lineTo(-size * 0.2, size * 0.3);  // inner left
  ctx.lineTo(0, size * 0.8);            // bottom center (engine)
  ctx.lineTo(size * 0.2, size * 0.3);   // inner right
  ctx.lineTo(size * 0.7, size * 0.5);   // bottom right
  ctx.closePath();

  const shipColor = state.player.boosted ? '#f59e0b' : '#00f2fe';
  ctx.fillStyle = shipColor + 'cc';
  ctx.fill();
  ctx.strokeStyle = shipColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Engine glow
  const engineSize = 4 + Math.sin(time * 10) * 2;
  ctx.beginPath();
  ctx.arc(0, size * 0.8 + engineSize, engineSize, 0, Math.PI * 2);
  ctx.fillStyle = state.player.boosted ? 'rgba(245, 158, 11, 0.6)' : 'rgba(0, 242, 254, 0.5)';
  ctx.fill();

  ctx.restore();
  ctx.shadowBlur = 0;
}

// ── Draw Particles ───────────────────────────────────────────────────────
function drawParticles(ctx, particles) {
  for (const p of particles) {
    if (p.life <= 0) continue;
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color + Math.floor(alpha * 200).toString(16).padStart(2, '0');
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size * alpha, p.size * alpha);
  }
}

// ── Draw Fuel Warning Vignette ───────────────────────────────────────────
function drawWarningOverlay(ctx, w, h, fuel) {
  if (fuel > VISUAL.FUEL_WARNING) return;

  const intensity = fuel <= VISUAL.FUEL_CRITICAL ? 0.25 : 0.12;
  const pulse = fuel <= VISUAL.FUEL_CRITICAL ? (Math.sin(Date.now() * 0.008) * 0.5 + 0.5) : 1;

  // Vignette from edges
  const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7);
  grad.addColorStop(0, 'rgba(255, 0, 0, 0)');
  grad.addColorStop(1, `rgba(255, 0, 50, ${intensity * pulse})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ── Draw Speed Lines ─────────────────────────────────────────────────────
function drawSpeedLines(ctx, w, h, speed, time) {
  if (speed < 80) return;
  const intensity = Math.min(1, (speed - 80) / 60);
  const count = Math.floor(intensity * 15);

  ctx.strokeStyle = `rgba(0, 242, 254, ${0.08 * intensity})`;
  ctx.lineWidth = 1;

  for (let i = 0; i < count; i++) {
    const seed = i * 1337 + Math.floor(time * 2);
    const x = ((seed * 7919) % w);
    const y = ((seed * 6271) % (h * 0.6)) + h * ROAD.VANISH_Y;
    const len = 15 + intensity * 30;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + len);
    ctx.stroke();
  }
}

// ── Utility: Rounded Rectangle ───────────────────────────────────────────
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
// MAIN RENDER FUNCTION — called every frame
// ═══════════════════════════════════════════════════════════════════════════
export function renderFrame(ctx, state, w, h) {
  const time = performance.now() / 1000;

  ctx.clearRect(0, 0, w, h);

  // 1. Background + code rain
  drawBackground(ctx, w, h, state);

  // 2. Road
  drawRoad(ctx, w, h, state);

  // 3. Canyon walls
  drawCanyonWalls(ctx, w, h, state);

  // 4. Speed lines
  drawSpeedLines(ctx, w, h, state.speed || 60, time);

  // 5. Game objects — sort by Z (far to near) so near objects draw on top
  const allObjects = [
    ...state.gates.map(o => ({ ...o, _type: 'gate' })),
    ...state.tokens.map(o => ({ ...o, _type: 'token' })),
    ...state.bugs.map(o => ({ ...o, _type: 'bug' })),
    ...state.powerups.map(o => ({ ...o, _type: 'powerup' })),
  ].sort((a, b) => b.z - a.z);

  for (const obj of allObjects) {
    switch (obj._type) {
      case 'gate': drawGate(ctx, obj, w, h, state.player.currentLane); break;
      case 'token': drawToken(ctx, obj, w, h, time); break;
      case 'bug': drawBug(ctx, obj, w, h, time); break;
      case 'powerup': drawPowerup(ctx, obj, w, h, time); break;
    }
  }

  // 6. Player
  drawPlayer(ctx, state, w, h, time);

  // 7. Particles
  drawParticles(ctx, state.particles);

  // 8. Warning overlay
  drawWarningOverlay(ctx, w, h, state.fuel);
}

// ── Initialize Code Rain Data ────────────────────────────────────────────
export function initCodeRain(w) {
  const cols = [];
  const count = Math.min(VISUAL.CODE_RAIN_COLUMNS, Math.floor(w / 45));
  for (let i = 0; i < count; i++) {
    const chars = [];
    const len = 8 + Math.floor(Math.random() * 12);
    for (let j = 0; j < len; j++) {
      chars.push(CODE_RAIN_CHARS[Math.floor(Math.random() * CODE_RAIN_CHARS.length)]);
    }
    cols.push({
      x: (i / count) * w + Math.random() * 20,
      chars,
      speed: 20 + Math.random() * 30,
      offset: Math.random() * 500,
    });
  }
  return cols;
}

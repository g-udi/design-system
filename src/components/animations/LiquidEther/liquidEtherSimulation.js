const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

function sample(values, width, height, x, y) {
  x = clamp(x, 0, width - 1.001);
  y = clamp(y, 0, height - 1.001);
  const left = Math.floor(x), bottom = Math.floor(y);
  const tx = x - left, ty = y - bottom;
  const index = bottom * width + left;
  const a = values[index] * (1 - tx) + values[index + 1] * tx;
  const b = values[index + width] * (1 - tx) + values[index + width + 1] * tx;
  return a * (1 - ty) + b * ty;
}

function splat(field, x, y, dx, dy, amount, phase, aspect) {
  const { width, height, velocityX, velocityY, dye } = field;
  const radiusY = height * 0.055;
  const radiusX = radiusY * width / height / aspect;
  const centerX = x * (width - 1), centerY = y * (height - 1);
  const left = Math.max(1, Math.floor(centerX - radiusX * 3));
  const right = Math.min(width - 2, Math.ceil(centerX + radiusX * 3));
  const bottom = Math.max(1, Math.floor(centerY - radiusY * 3));
  const top = Math.min(height - 2, Math.ceil(centerY + radiusY * 3));
  const colors = [0.5 + 0.5 * Math.sin(phase), 0.5 + 0.5 * Math.sin(phase + 2.1), 0.5 + 0.5 * Math.sin(phase + 4.2)];
  for (let row = bottom; row <= top; row += 1) {
    for (let column = left; column <= right; column += 1) {
      const rx = (column - centerX) / radiusX, ry = (row - centerY) / radiusY;
      const weight = Math.exp(-(rx * rx + ry * ry) * 0.8);
      const index = row * width + column;
      // Tangential force rolls the sides of each moving dye jet into small curls.
      velocityX[index] = clamp(velocityX[index] + (dx - ry * 6) * weight * 0.28, -90, 90);
      velocityY[index] = clamp(velocityY[index] + (dy + rx * 6) * weight * 0.28, -90, 90);
      for (let channel = 0; channel < 3; channel += 1) {
        dye[channel][index] = Math.min(1.3, dye[channel][index] + colors[channel] * weight * amount);
      }
    }
  }
}

/** Private retained velocity/dye model, also usable without a WebGL context in contract tests. */
export function createEtherField(width = 160, height = 96, seed = true) {
  const size = width * height;
  const field = {
    width, height,
    velocityX: new Float32Array(size), velocityY: new Float32Array(size),
    nextX: new Float32Array(size), nextY: new Float32Array(size),
    dye: Array.from({ length: 3 }, () => new Float32Array(size)),
    nextDye: Array.from({ length: 3 }, () => new Float32Array(size)),
    divergence: new Float32Array(size), pressure: new Float32Array(size), nextPressure: new Float32Array(size),
    curl: new Float32Array(size), autoPointer: null
  };
  if (seed) {
    for (let i = 0; i < 22; i += 1) {
      const angle = i * 0.16;
      splat(field, 0.46 + Math.cos(angle) * 0.16, 0.5 + Math.sin(angle) * 0.2,
        -Math.sin(angle) * 18, Math.cos(angle) * 18, 0.2, angle * 0.6, 1.8);
    }
  }
  return field;
}

export function advanceEtherField(field, { delta, time, pointer, previousPointer, pointerActive, pressed = 0, width: cssWidth, height: cssHeight }) {
  // Pausing, theme changes and resizing must never inject dye or advance the field.
  if (!(delta > 0)) return;
  const dt = Math.min(delta, 0.06);
  const { width, height, velocityX: u, velocityY: v, nextX, nextY, curl, divergence } = field;
  const aspect = Math.max(0.2, cssWidth / Math.max(cssHeight, 1));
  let source = pointer, previous = previousPointer;
  if (pointerActive < 0.05) {
    source = [0.5 + Math.sin(time * 0.41) * 0.29, 0.5 + Math.sin(time * 0.57 + 0.8) * 0.26];
    previous = field.autoPointer || source;
    field.autoPointer = source;
  } else {
    field.autoPointer = null;
  }
  const dx = (source[0] - previous[0]) * width;
  const dy = (source[1] - previous[1]) * height;
  const distance = Math.hypot(dx, dy);
  if (distance > 0.03) {
    const count = Math.min(24, Math.max(1, Math.ceil(distance / 2.5)));
    const forceX = clamp(dx / dt, -90, 90), forceY = clamp(dy / dt, -90, 90);
    for (let i = 1; i <= count; i += 1) {
      const fraction = i / count;
      splat(field, previous[0] + (source[0] - previous[0]) * fraction,
        previous[1] + (source[1] - previous[1]) * fraction,
        forceX / count, forceY / count, (0.18 + pressed * 0.1) / Math.sqrt(count), time * 0.35, aspect);
    }
  }

  const drag = Math.exp(-dt * 0.65);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      nextX[i] = sample(u, width, height, x - u[i] * dt, y - v[i] * dt) * drag;
      nextY[i] = sample(v, width, height, x - u[i] * dt, y - v[i] * dt) * drag;
    }
  }
  u.set(nextX); v.set(nextY);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      curl[i] = (v[i + 1] - v[i - 1] - u[i + width] + u[i - width]) * 0.5;
    }
  }
  for (let y = 2; y < height - 2; y += 1) {
    for (let x = 2; x < width - 2; x += 1) {
      const i = y * width + x;
      let gx = Math.abs(curl[i + 1]) - Math.abs(curl[i - 1]);
      let gy = Math.abs(curl[i + width]) - Math.abs(curl[i - width]);
      const length = Math.hypot(gx, gy) + 0.0001;
      gx /= length; gy /= length;
      u[i] = clamp(u[i] + gy * curl[i] * dt * 8, -90, 90);
      v[i] = clamp(v[i] - gx * curl[i] * dt * 8, -90, 90);
    }
  }
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      divergence[i] = -(u[i + 1] - u[i - 1] + v[i + width] - v[i - width]) * 0.5;
    }
  }
  field.pressure.fill(0);
  field.nextPressure.fill(0);
  for (let iteration = 0; iteration < 12; iteration += 1) {
    const p = field.pressure, next = field.nextPressure;
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const i = y * width + x;
        next[i] = (p[i - 1] + p[i + 1] + p[i - width] + p[i + width] + divergence[i]) * 0.25;
      }
    }
    field.pressure = next; field.nextPressure = p;
  }
  const pressure = field.pressure;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      u[i] -= (pressure[i + 1] - pressure[i - 1]) * 0.5;
      v[i] -= (pressure[i + width] - pressure[i - width]) * 0.5;
    }
  }
  const dissipation = Math.exp(-dt * 0.62);
  for (let channel = 0; channel < 3; channel += 1) {
    const dye = field.dye[channel], next = field.nextDye[channel];
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const i = y * width + x;
        next[i] = sample(dye, width, height, x - u[i] * dt, y - v[i] * dt) * dissipation;
      }
    }
    field.dye[channel] = next; field.nextDye[channel] = dye;
  }
}

/** RGBA8 upload keeps the retained field available on WebGL 1 without float texture extensions. */
export function createLiquidEtherSimulation(gl) {
  const field = createEtherField();
  const pixels = new Uint8Array(field.width * field.height * 4);
  const texture = gl.createTexture();
  if (!texture) throw new Error('Unable to create LiquidEther dye texture');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, field.width, field.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  return {
    texture,
    step(options) {
      advanceEtherField(field, options);
      for (let i = 0; i < field.width * field.height; i += 1) {
        for (let channel = 0; channel < 3; channel += 1) pixels[i * 4 + channel] = Math.round(Math.min(1, field.dye[channel][i]) * 255);
        pixels[i * 4 + 3] = 255;
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, field.width, field.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    },
    dispose() { gl.deleteTexture(texture); }
  };
}

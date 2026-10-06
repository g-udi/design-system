// A fixed, seeded mesh keeps server/client setup deterministic and bounds GPU work.
export const AERO_PARTICLE_COUNT = 1280;
export const AERO_VERTEX_STRIDE = 13;

export function createAeroGeometry() {
  let seed = 18347;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const particles = Array.from({ length: AERO_PARTICLE_COUNT }, () => ({
    phase: random(), depth: random(), size: random(), spin: random(),
    spread: (random() + random() + random() - 1.5) * 0.62,
    shape: [random(), random(), random(), random(), random(), random()]
  })).sort((a, b) => a.depth - b.depth);
  const vertices = new Float32Array(AERO_PARTICLE_COUNT * 12 * AERO_VERTEX_STRIDE);
  let offset = 0;
  for (const particle of particles) {
    const r = particle.shape;
    // The ridge is off-centre and raised: four genuinely non-coplanar triangles,
    // with unequal wings and tips, instead of a shaded diamond silhouette.
    const points = [
      [-1, -0.08 + r[0] * 0.16, 0],
      [-0.55 + r[1] * 0.95, 0.22 + r[2] * 0.52, -0.08],
      [0.7 + r[3] * 0.8, -0.16 + r[4] * 0.34, 0.02],
      [-0.65 + r[5] * 1.05, -0.18 - r[0] * 0.48, -0.12],
      [-0.3 + r[2] * 0.6, -0.08 + r[4] * 0.16, 0.18 + r[1] * 0.36]
    ];
    for (let face = 0; face < 4; face++) {
      const a = points[4];
      const b = points[face];
      const c = points[(face + 1) % 4];
      const ab = b.map((value, axis) => value - a[axis]);
      const ac = c.map((value, axis) => value - a[axis]);
      const normal = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
      const length = Math.hypot(...normal);
      for (const point of [a, b, c]) {
        vertices.set([...point, ...normal.map(value => value / length), particle.phase,
          particle.depth, particle.size, particle.spin, particle.spread, face / 3, r[5]], offset);
        offset += AERO_VERTEX_STRIDE;
      }
    }
  }
  return vertices;
}

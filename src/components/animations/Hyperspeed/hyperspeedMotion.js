// Integrate the extra travel rather than multiplying absolute time on press,
// so acceleration and release never jump the lights to another position.
export function createHyperspeedMotion(gl) {
  const program = gl.getParameter(gl.CURRENT_PROGRAM);
  const location = gl.getUniformLocation(program, 'uTravel');
  let extraTravel = 0;
  return {
    step({ delta, time, pressed }) {
      extraTravel += delta * pressed * 32;
      gl.uniform1f(location, time * 12 + extraTravel);
    }
  };
}

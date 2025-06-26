function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function scale(v, s) {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function length(v) {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

function normalize(v) {
  const len = length(v);
  return scale(v, 1 / len);
}

function project(A, B) {
  const B_hat = normalize(B);
  const factor = dot(A, B_hat);
  return scale(B_hat, factor);
}

function to2D(vector, u, v) {
  return {
    x: dot(vector, u),
    y: dot(vector, v)
  };
}

// ========== Main Function ==========

function decomposeVector(A, B) {
  const A_parallel = project(A, B);
  const A_perpendicular = subtract(A, A_parallel);

  const B_hat = normalize(B);
  const arbitrary = Math.abs(B_hat.x) < 0.9 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  const u = normalize(cross(arbitrary, B_hat));
  const v = cross(B_hat, u);

  const A_perp_2D = to2D(A_perpendicular, u, v);

  return {
    A_parallel,
    A_perpendicular,
    A_perp_2D
  };
}

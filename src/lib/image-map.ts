// lib/imageMap.ts

export const IMAGE_MAP: Record<string, string> = {
  a1b2c: "/images/questions/117.jpeg",
  d3e4f: "/images/questions/118.jpeg",
  g5h6i: "/images/questions/119.jpeg",
  j7k8l: "/images/questions/120.jpeg",
  m9n0o: "/images/questions/121.jpeg",
  p1q2r: "/images/questions/122.jpeg",
  s3t4u: "/images/questions/123.jpeg",
  v5w6x: "/images/questions/124.jpeg",
  y7z8a: "/images/questions/125.jpeg",
  b9c0d: "/images/questions/126.jpeg",
  e1f2g: "/images/questions/127.jpeg",
  h3i4j: "/images/questions/128.jpeg",
  k5l6m: "/images/questions/129.jpeg",
  n7o8p: "/images/questions/130.jpeg",
  q9r0s: "/images/questions/131.jpeg",
  t1u2v: "/images/questions/132.jpeg",
  w3x4y: "/images/questions/133.jpeg",
  z5a6b: "/images/questions/134.jpeg",
  c7d8e: "/images/questions/135.jpeg",
  f9g0h: "/images/questions/136.jpeg",
  i1j2k: "/images/questions/137.jpeg",
  l3m4n: "/images/questions/138.jpeg",
  o5p6q: "/images/questions/139.jpeg",
  r7s8t: "/images/questions/140.jpeg",
  u9v0w: "/images/questions/141.jpeg",
  x1y2z: "/images/questions/142.jpeg",
  a3b4c: "/images/questions/143.jpeg",
  d5e6f: "/images/questions/144.jpeg",
  g7h8i: "/images/questions/145.jpeg",
  j9k0l: "/images/questions/146.jpeg",
  m1n2o: "/images/questions/147.jpeg",
  p3q4r: "/images/questions/148.jpeg",
  s5t6u: "/images/questions/149.jpeg",
  v7w8x: "/images/questions/150.jpeg",
  y9z0a: "/images/questions/151.jpeg",
  b1c2d: "/images/questions/152.jpeg",
  e3f4g: "/images/questions/153.jpeg",
  h5i6j: "/images/questions/154.jpeg",
  k7l8m: "/images/questions/155.jpeg",
  n9o0p: "/images/questions/156.jpeg",
};
export function getImageKeyByValue(value: string): string | undefined {
  for (const [key, val] of Object.entries(IMAGE_MAP)) {
    if (val === value) {
      return key;
    }
  }
  return undefined; // not found
}

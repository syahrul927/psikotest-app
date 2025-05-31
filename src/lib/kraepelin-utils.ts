export function validateAnswer(a: number, b: number, answer: number) {
  const c = plusKraepelin(a, b);
  return answer === c;
}
export function plusKraepelin(a: number, b: number) {
  return Math.floor((a + b) % 10);
}

export const getAvatarName = (name?: string | null) => {
  if (!name) {
    name = "unknown";
  }
  return name
    .toUpperCase()
    .split(" ")
    .map((n) => n.slice(0, 2))
    .join("")
    .slice(0, 2);
};

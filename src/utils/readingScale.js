export const initReadingScale = () => {
  const saved = localStorage.getItem("readingScale") || "1";
  document.documentElement.style.setProperty("--reading-scale", saved);
};

export const changeReadingScale = (delta) => {
  const current =
    Number(localStorage.getItem("readingScale")) || 1;

  const next = Math.min(1.6, Math.max(0.85, current + delta));

  localStorage.setItem("readingScale", next);
  document.documentElement.style.setProperty(
    "--reading-scale",
    next
  );
};

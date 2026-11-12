// Выполняется в head: сохранённая тема применяется до появления страницы.
(function () {
  const root = document.documentElement;
  let theme = "light";
  try {
    if (localStorage.getItem("lapki-theme") === "dark") theme = "dark";
  } catch (error) {
    // Светлая тема остаётся доступной и без localStorage.
  }
  root.setAttribute("data-bs-theme", theme);

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("themeToggle");
    if (!button) return;
    let animationTimer;

    function updateButton() {
      button.setAttribute("aria-pressed", root.getAttribute("data-bs-theme") === "dark");
    }
    updateButton();

    button.addEventListener("click", function () {
      const nextTheme = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      root.classList.add("theme-animating");
      root.setAttribute("data-bs-theme", nextTheme);
      updateButton();
      try { localStorage.setItem("lapki-theme", nextTheme); } catch (error) {}
      clearTimeout(animationTimer);
      animationTimer = setTimeout(function () {
        root.classList.remove("theme-animating");
      }, 400);
    });
  });
})();

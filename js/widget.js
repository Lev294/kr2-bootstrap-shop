(function () {
  const panel = document.getElementById("helpPanel");
  const toggle = document.getElementById("helpToggle");
  const close = document.getElementById("helpClose");
  if (!panel || !toggle || !close) return;

  function markSeen() {
    try { sessionStorage.setItem("lapki-help-seen", "1"); } catch (error) {}
  }
  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    markSeen();
  }
  function closePanel() {
    const restoreFocus = panel.contains(document.activeElement);
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    markSeen();
    if (restoreFocus) toggle.focus();
  }

  let seen = false;
  try { seen = sessionStorage.getItem("lapki-help-seen") === "1"; } catch (error) {}
  const timer = seen ? null : setTimeout(openPanel, 4000);

  toggle.addEventListener("click", function () {
    clearTimeout(timer);
    if (panel.hidden) openPanel(); else closePanel();
  });
  close.addEventListener("click", function () {
    clearTimeout(timer);
    closePanel();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) {
      clearTimeout(timer);
      closePanel();
    }
  });
})();

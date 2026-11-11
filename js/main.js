// Bootstrap сам управляет мобильным меню и раскрывающимся FAQ.

// После выбора ссылки закрываем мобильное меню.
const navbar = document.getElementById("mainNavbar");
if (navbar && window.bootstrap) {
  navbar.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (!navbar.classList.contains("show")) return;
      const target = document.getElementById(link.hash.slice(1));
      if (target) {
        navbar.addEventListener("hidden.bs.collapse", function () {
          target.scrollIntoView();
        }, { once: true });
      }
      bootstrap.Collapse.getOrCreateInstance(navbar, { toggle: false }).hide();
    });
  });
}

// Ссылка из карточки открывает вкладку выбранного номера.
const selectedRoom = new URLSearchParams(window.location.search).get("room") || window.location.hash.slice(1);
const roomTab = document.getElementById("room-" + selectedRoom + "-tab");
if (roomTab && window.bootstrap) {
  bootstrap.Tab.getOrCreateInstance(roomTab).show();
}

// Отзыв добавляется только на открытую страницу, без базы данных.
const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const card = document.createElement("article");
    card.className = "card card-body";
    const name = document.createElement("h3");
    name.className = "h5";
    name.textContent = document.getElementById("review-name").value.trim();
    const text = document.createElement("p");
    text.className = "mb-0 review-text";
    text.textContent = document.getElementById("review-text").value.trim();
    card.append(name, text);
    document.getElementById("noReviews").hidden = true;
    document.getElementById("reviewList").append(card);
    reviewForm.reset();
  });
}

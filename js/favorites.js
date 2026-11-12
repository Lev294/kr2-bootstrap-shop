(function () {
  let favorites = lapkiLoadIds("lapki-favorites");
  const list = document.getElementById("favoriteList");
  const empty = document.getElementById("favoritesEmpty");
  const clearButton = document.getElementById("clearFavorites");

  function updateButtons() {
    document.querySelectorAll("[data-favorite]").forEach(function (button) {
      const place = lapkiPlaces.find(function (item) { return item.id === button.dataset.favorite; });
      if (!place) return;
      const selected = favorites.includes(place.id);
      button.setAttribute("aria-pressed", selected);
      button.setAttribute("aria-label", (selected ? "Убрать «" : "Добавить «") +
        place.name + (selected ? "» из избранного" : "» в избранное"));
      button.classList.toggle("active", selected);
      button.querySelector("span").textContent = selected ? "В избранном" : "В избранное";
    });
    document.querySelectorAll("[data-favorites-count]").forEach(function (counter) {
      counter.textContent = favorites.length;
    });
    if (clearButton) clearButton.disabled = favorites.length === 0;
  }

  function renderFavorites() {
    if (!list) return;
    list.replaceChildren();
    empty.hidden = favorites.length > 0;
    favorites.forEach(function (id) {
      const place = lapkiPlaces.find(function (item) { return item.id === id; });
      const column = document.createElement("div");
      column.className = "col-12 col-md-6 col-lg-4";
      // В шаблоне только постоянные данные из data.js, пользовательского HTML нет.
      column.innerHTML = `
        <article class="card h-100 shadow-sm">
          <img class="card-img-top room-image" src="${place.image}" alt="Передержка «${place.name}»" width="640" height="400">
          <div class="card-body d-flex flex-column">
            <span class="badge text-bg-success align-self-start mb-2">${place.pet}</span>
            <h2 class="h4">${place.name}</h2>
            <p class="text-body-secondary">${place.description}</p>
            <p class="fs-5 fw-bold mt-auto">${lapkiMoney(place.price)} / сутки</p>
            <a class="btn btn-outline-success align-self-start" href="product.html?place=${place.id}">Подробнее о передержке</a>
            <div class="d-flex flex-wrap align-items-center gap-3 mt-3">
              <button class="favorite-button btn btn-outline-success btn-sm d-inline-flex align-items-center gap-2" type="button" data-favorite="${place.id}" aria-pressed="false">
                <svg width="18" height="18" aria-hidden="true"><use href="images/icons.svg#heart"></use></svg><span>В избранное</span>
              </button>
              <label class="d-flex align-items-center gap-2 small"><input class="form-check-input mt-0" type="checkbox" data-compare="${place.id}">В сравнение</label>
            </div>
          </div>
        </article>`;
      list.append(column);
    });
    document.dispatchEvent(new Event("favoriteschange"));
  }

  function saveAndUpdate(message) {
    lapkiSaveIds("lapki-favorites", favorites);
    renderFavorites();
    updateButtons();
    const status = document.getElementById("siteStatus");
    if (status) status.textContent = message;
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    const id = button.dataset.favorite;
    const place = lapkiPlaces.find(function (item) { return item.id === id; });
    if (!place) return;
    const removed = favorites.includes(id);
    if (removed) {
      favorites = favorites.filter(function (value) { return value !== id; });
    } else {
      favorites.push(id);
    }
    const restoreFocus = list && list.contains(button);
    saveAndUpdate("Передержка «" + place.name + "» " +
      (removed ? "убрана из избранного." : "добавлена в избранное."));
    if (restoreFocus) {
      const nextButton = list.querySelector("[data-favorite]");
      (nextButton || document.getElementById("favorites-title")).focus();
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      favorites = [];
      saveAndUpdate("Избранное очищено.");
      document.getElementById("favorites-title").focus();
    });
  }

  renderFavorites();
  updateButtons();
})();

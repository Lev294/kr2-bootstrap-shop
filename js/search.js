(function () {
  const results = document.getElementById("searchResults");
  if (!results) return;
  const status = document.getElementById("searchStatus");
  const query = (new URLSearchParams(window.location.search).get("q") || "").trim().slice(0, 120);
  document.querySelectorAll('input[name="q"]').forEach(function (input) { input.value = query; });

  function normalize(text) {
    return text.toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  }
  const words = normalize(query).split(" ").filter(Boolean);
  if (words.length === 0) {
    status.textContent = "Введите слово или несколько слов, например «груминг» или «Простор».";
    return;
  }

  // Индекс берётся из HTML страниц: при изменении текста поиск обновляется сам.
  const pages = ["index.html", "catalog.html", "product.html", "about.html", "favorites.html"];
  status.textContent = "Ищем по сайту…";
  Promise.allSettled(pages.map(async function (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Страница недоступна");
    const doc = new DOMParser().parseFromString(await response.text(), "text/html");
    const main = doc.querySelector("main");
    let sections = Array.from(main.querySelectorAll(":scope > section, .tab-pane"));
    if (sections.length === 0) sections = [main];
    return sections.filter(function (section) {
      return !section.querySelector(".tab-pane");
    }).map(function (section) {
      const heading = section.querySelector("h1, h2, h3");
      let title = heading ? heading.textContent.trim() : doc.title;
      let target = url;
      if (section.classList.contains("tab-pane")) {
        target += "?place=" + section.id;
        const tab = doc.getElementById(section.getAttribute("aria-labelledby"));
        if (tab) title += " — " + tab.textContent.trim();
      } else {
        const id = section.id || (heading && heading.id);
        if (id) target += "#" + id;
      }
      return { title: title, url: target, text: section.textContent.replace(/\s+/g, " ").trim() };
    });
  })).then(function (responses) {
    let matches = [];
    let failed = 0;
    responses.forEach(function (response) {
      if (response.status === "rejected") { failed++; return; }
      response.value.forEach(function (entry) {
        const content = normalize(entry.title + " " + entry.text);
        if (words.every(function (word) { return content.includes(word); })) {
          entry.score = words.filter(function (word) { return normalize(entry.title).includes(word); }).length;
          matches.push(entry);
        }
      });
    });
    matches.sort(function (a, b) { return b.score - a.score; });
    results.replaceChildren();
    matches.forEach(function (entry) {
      const article = document.createElement("article");
      article.className = "card card-body";
      const heading = document.createElement("h2");
      heading.className = "h5";
      const link = document.createElement("a");
      link.className = "link-success";
      link.href = entry.url;
      link.textContent = entry.title;
      heading.append(link);
      const text = document.createElement("p");
      text.className = "text-body-secondary mb-0";
      // Запрос и найденные тексты не вставляются через innerHTML.
      const firstMatch = entry.text.toLowerCase().replace(/ё/g, "е").indexOf(words[0]);
      const start = Math.max(0, firstMatch - 50);
      text.textContent = (start > 0 ? "…" : "") + entry.text.slice(start, start + 220) +
        (entry.text.length > start + 220 ? "…" : "");
      article.append(heading, text);
      results.append(article);
    });
    status.textContent = matches.length ? "Найдено разделов: " + matches.length + "." :
      "Ничего не найдено. Попробуйте другое слово, например «уход» или «цены».";
    if (failed) status.textContent += " Часть страниц не удалось загрузить. Повторите поиск позже.";
  });
})();

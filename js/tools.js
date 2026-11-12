(function () {
  let comparison = lapkiLoadIds("lapki-comparison");
  const form = document.getElementById("calculatorForm");
  const clearButton = document.getElementById("clearComparison");

  function updateSelection() {
    document.querySelectorAll("[data-compare]").forEach(function (checkbox) {
      checkbox.checked = comparison.includes(checkbox.dataset.compare);
    });
    document.querySelectorAll("[data-compare-count]").forEach(function (counter) {
      counter.textContent = comparison.length;
    });
    if (clearButton) clearButton.disabled = comparison.length === 0;
  }

  function updateCalculation() {
    updateSelection();
    if (!form) return;
    const days = form.elements.days.valueAsNumber;
    const options = {
      grooming: form.elements.grooming.checked,
      care: form.elements.care.checked,
      walks: form.elements.walks.valueAsNumber
    };
    const place = lapkiPlaces.find(function (item) { return item.id === form.elements.place.value; });
    const cost = lapkiCalculate(place, days, options);
    document.getElementById("calculatorError").hidden = cost !== null;
    document.getElementById("calcBase").textContent = cost ? lapkiMoney(cost.base) : "—";
    document.getElementById("calcExtras").textContent = cost ? lapkiMoney(cost.extras) : "—";
    document.getElementById("calcTotal").textContent = cost ? lapkiMoney(cost.total) : "—";
    form.elements.days.setAttribute("aria-invalid", !form.elements.days.validity.valid);
    form.elements.walks.setAttribute("aria-invalid", !form.elements.walks.validity.valid);

    const table = document.getElementById("comparisonTable");
    const empty = document.getElementById("comparisonEmpty");
    table.replaceChildren();
    table.hidden = comparison.length < 2;
    empty.hidden = comparison.length >= 2;
    if (comparison.length < 2) return;

    const selected = lapkiPlaces.filter(function (item) { return comparison.includes(item.id); });
    const head = document.createElement("thead");
    head.className = "table-light";
    head.innerHTML = "<tr><th scope='col'>Условия</th>" + selected.map(function (item) {
      return '<th scope="col"><a class="link-success" href="product.html?place=' + item.id +
        '">' + item.name + '</a><br><button class="btn btn-sm btn-outline-secondary mt-2" type="button" data-remove-compare="' +
        item.id + '" aria-label="Убрать «' + item.name + '» из сравнения">Убрать</button></th>';
    }).join("") + "</tr>";
    table.append(head);
    const rows = [
      ["Для кого", function (item) { return item.pet; }],
      ["Стоимость суток", function (item) { return lapkiMoney(item.price); }],
      ["Размещение", function (item) { return item.space; }],
      ["Прогулки в тарифе", function (item) { return item.walks; }],
      ["Кормление", function (item) { return item.feeding; }],
      ["Размещение за период", function (item) {
        const value = lapkiCalculate(item, days, options);
        return value ? lapkiMoney(value.base) : "—";
      }],
      ["Дополнительные услуги", function (item) {
        const value = lapkiCalculate(item, days, options);
        return value ? lapkiMoney(value.extras) : "—";
      }],
      ["Итого за период", function (item) {
        const value = lapkiCalculate(item, days, options);
        return value ? lapkiMoney(value.total) : "—";
      }]
    ];
    const body = document.createElement("tbody");
    rows.forEach(function (row) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = row[0];
      tr.append(th);
      selected.forEach(function (item) {
        const td = document.createElement("td");
        td.textContent = row[1](item);
        tr.append(td);
      });
      body.append(tr);
    });
    table.append(body);
  }

  function saveSelection() {
    lapkiSaveIds("lapki-comparison", comparison);
    updateCalculation();
  }

  document.addEventListener("change", function (event) {
    const checkbox = event.target.closest("[data-compare]");
    if (!checkbox) return;
    const id = checkbox.dataset.compare;
    if (!lapkiPlaces.some(function (place) { return place.id === id; })) return;
    if (checkbox.checked && !comparison.includes(id)) comparison.push(id);
    if (!checkbox.checked) comparison = comparison.filter(function (value) { return value !== id; });
    saveSelection();
  });

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-remove-compare]");
    if (!button) return;
    comparison = comparison.filter(function (id) { return id !== button.dataset.removeCompare; });
    saveSelection();
    document.getElementById("comparison-title").focus();
  });

  document.addEventListener("favoriteschange", updateSelection);

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      comparison = [];
      saveSelection();
    });
  }
  if (form) {
    const initialPlace = new URLSearchParams(window.location.search).get("place");
    if (lapkiPlaces.some(function (place) { return place.id === initialPlace; })) {
      form.elements.place.value = initialPlace;
    }
    form.addEventListener("input", updateCalculation);
    form.addEventListener("submit", function (event) { event.preventDefault(); });
  }
  updateCalculation();
})();

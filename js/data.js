// Общие данные для избранного, калькулятора и сравнения.
const lapkiPlaces = [
  {
    id: "cat", name: "Уют", pet: "Для кошек", price: 800,
    image: "images/room-cat.svg",
    description: "Отдельный номер с лежанкой, когтеточкой и полками для отдыха. Спокойное пространство для уединения и игр.",
    space: "Индивидуальный номер, лежанка и полки",
    walks: "Не входят", feeding: "По привычному расписанию"
  },
  {
    id: "dog", name: "Простор", pet: "Для собак", price: 1200,
    image: "images/room-dog.svg",
    description: "Просторный номер с мягкой лежанкой. В тариф включены две прогулки в день, привычное кормление и фотоотчёт.",
    space: "Просторный номер с мягкой лежанкой",
    walks: "Две прогулки в день", feeding: "По привычному расписанию"
  },
  {
    id: "small", name: "Мини", pet: "Для небольших питомцев", price: 500,
    image: "images/room-small.svg",
    description: "Тихая зона для кроликов и морских свинок. Размещение в знакомой клетке или вольере с привычным кормом.",
    space: "Знакомая клетка или вольер в тихой зоне",
    walks: "Не входят", feeding: "По инструкции владельца"
  }
];

function lapkiMoney(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "RUB", maximumFractionDigits: 0
  }).format(value);
}

// В хранилище принимаем только существующие и неповторяющиеся id.
function lapkiLoadIds(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(function (id, index) {
      return lapkiPlaces.some(function (place) { return place.id === id; }) &&
        value.indexOf(id) === index;
    });
  } catch (error) {
    return [];
  }
}

function lapkiSaveIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch (error) {
    // При недоступном хранилище выбор продолжает работать на текущей странице.
  }
}

// Груминг оплачивается один раз, уход и дополнительные прогулки — за сутки.
function lapkiCalculate(place, days, options) {
  if (!place || !Number.isInteger(days) || days < 1 || days > 365 ||
      !Number.isInteger(options.walks) || options.walks < 0 || options.walks > 3) {
    return null;
  }
  const base = place.price * days;
  const grooming = options.grooming ? 900 : 0;
  const care = options.care ? 350 * days : 0;
  const walks = place.id === "dog" ? options.walks * 200 * days : 0;
  return { base: base, extras: grooming + care + walks,
    grooming: grooming, care: care, walks: walks,
    total: base + grooming + care + walks };
}

// Bootstrap сам управляет мобильным меню и раскрывающимся FAQ.

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

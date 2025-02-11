// Загальні вимоги
// При відкритті сторінки одразу можна побачити тільки логотип та копірайт.
// В файлі index.html подана вся потрібна розмітка проєкту. Напряму змінювати структуру в файлі index.html не можна.
// Дозволяється за потреби додавати стилі та атрибути елементам, використовуючи javascript.
// Проєкт повинен працювати у всіх сучаних браузеерах без помилок.
// Код проєкту написаний з використанням суворого режиму в javascript.

//                                КАРТКИ ТРЕНЕРІВ
// При завантаженні сторінки вивести картки тренерів на сторінку в середину елементу з
// класом trainers-cards__container.
// Дані для заповнення карток тренерів знаходяться в змінній DATA в файлі index.js.
// В якості зразка розмітки картки тренера брати темплейт з id trainer-card.
// Після виведення всіх карток на екран - ппоказати блоки фільтрів та сортування.
// Щоб показати блок фільтрів та блок сортування треба видалити в них атрибут hidden.
import DATA from "./index.js";

document.addEventListener("DOMContentLoaded", function () {
  const trainerList = document.querySelector(".trainers-cards__container");
  const trainerCard = document.getElementById("trainer-card");

  ////////////////////////////////////////////
  let currentDirection = "всі";
  let currentCategory = "всі";
  let currentSortCategory = "default";
  ////////////////////////////////////////////

  const renderTrainers = (sortedData) => {
    trainerList.innerHTML = "";
    sortedData.forEach((trainerInfo) => {
      const trainerItem = trainerCard.content.cloneNode(true);
      // Заповнюю контент карточки
      const img = trainerItem.querySelector(".trainer__img");
      const name = trainerItem.querySelector(".trainer__name");
      img.setAttribute("src", trainerInfo.photo);
      name.textContent = `${trainerInfo["last name"]} ${trainerInfo["first name"]}`;
      trainerList.append(trainerItem);
    });
    showModaleWindow(sortedData);
  };

  const sortingSection = document.querySelector(".sorting");
  sortingSection.removeAttribute("hidden");

  const sidebar = document.querySelector(".sidebar");
  sidebar.removeAttribute("hidden");

  //                СОРТУВАННЯ КАРТОК ТРЕНЕРІВ

  // При завантаженні сторінки картики виводяться в тому порядку,
  // в якому вони записані в змінній DATA.
  // При натисканні на кнопку сортування за прізвищем картки на
  //  сторінці повинні відсортуватися по призвищу від А до Я.
  // При натисканні на кнопку сортування за досвідом картки на
  //  сторінці повинні відсортуватися за досвідом від більшого до меншого.
  // Коли будь-яка кнопка сортування стає активною - до неї додається
  // клас sorting__btn--active. З інших кнопок цей клас повинен прибратися.
  // Одночасно може бути тільки один вид сортування.
  // import DATA from "./index.js";

  const sortBy = (category, data) => {
    let sortedData;
    if (category === "default") {
      sortedData = [...data];
    } else if (category === "last name") {
      sortedData = [...data].sort((a, b) => {
        return a["last name"].localeCompare(b["last name"], "uk", { sensitivity: "base" });
      });
    } else if (category === "experience") {
      sortedData = [...data].sort((a, b) => {
        return b.experience.slice(0, 2).trim() - a.experience.slice(0, 2).trim();
      });
    }
    return sortedData;
  };

  const sortButtons = document.querySelectorAll(".sorting__btn");
  sortButtons[0].setAttribute("data-sort", "default");
  sortButtons[1].setAttribute("data-sort", "last name");
  sortButtons[2].setAttribute("data-sort", "experience");

  sortButtons.forEach((sortBtn) => {
    sortBtn.addEventListener("click", function (event) {
      sortButtons.forEach((btn) => btn.classList.remove("sorting__btn--active"));
      event.target.classList.add("sorting__btn--active");

      currentSortCategory = event.target.getAttribute("data-sort"); // Збереження поточної категорії сортування

      const sortedData = sortBy(currentSortCategory, filterData());
      renderTrainers(sortedData);
    });
  });

  //                 МОДАЛЬНЕ ВІКНО

  // Модальне вікно з даними про конкретного тренера з'являється при натисканні на кнопку ПОКАЗАТИ.
  // При показі модального вікна заборонити скрол сторінки.
  // Інформація для заповнення знаходиться в об'єкті з інформацією про тренера.
  // Шаблон модального вікна знаходиться в темплейті modal-template.
  // Клік по хрестику в модальному вікні повинен видаляти модальне вікно з DOM.
  // Одночасно в DOM повиннен знаходитись тільки один екземпляр модального вікна.
  // Після закриття модального вікна скрол сторінки зному має бути доступним.

  function createModal(trainerData) {
    const modalTemplate = document.getElementById("modal-template");
    const modalTemplateContent = modalTemplate.content.cloneNode(true);

    // Заповнюю контент модального вікна
    const modalImg = modalTemplateContent.querySelector(".modal__img");
    modalImg.setAttribute("src", trainerData.photo);

    const modalDescription = modalTemplateContent.querySelector(".modal__description");
    const DescriptionParagraphs = modalDescription.children;

    DescriptionParagraphs[0].textContent = `${trainerData["last name"]} ${trainerData["first name"]}`;
    DescriptionParagraphs[1].textContent = trainerData.category;
    DescriptionParagraphs[2].textContent = trainerData.experience;
    DescriptionParagraphs[3].textContent = trainerData.specialization;
    DescriptionParagraphs[4].textContent = trainerData.description;

    //////////////////////////////////////////////////////////////////////////////////////////
    // Обробка кнопки закриття модального вікна
    const btnModalClose = modalTemplateContent.querySelector(".modal__close");
    const modalWrapper = modalTemplateContent.querySelector(".modal");
    btnModalClose.addEventListener("click", () => {
      modalWrapper.remove();
      document.body.style.overflow = "visible";
    });
    ////////////////////////////////////////////////////////////////////////////////////////////
    return modalTemplateContent;
  }

  //Кнопка "ПОКАЗАТИ", що відкриває модальне вікно тренера
  function showModaleWindow(sortedData) {
    document.querySelectorAll(".trainer__show-more").forEach((button, index) => {
      button.addEventListener("click", function (event) {
        const trainerData = sortedData[index];
        const modal = createModal(trainerData);
        trainerList.append(modal);
        event.stopImmediatePropagation();
        document.body.style.overflow = "hidden";
      });
    });
  }

  renderTrainers(DATA);

  //               ФІЛЬТРАЦІЯ КАРТОК ТРЕНЕРІВ

  // При завантаженні сторінки виводяться всі картки. В блоках НАПРЯМИ та КАТЕГОРІЇ вибрано пункти ВСІ.
  // Фільтарція повинна спрацьовувати при натисканні кнопки ПОКАЗАТИ.
  // При виборі будь-якого напряму, крім ВСІ, масив карток повинен фільтруватися
  // і на сторінці повинні бути показані лише ті тренери, що відносяться до даного напряму.
  // При виборі будь-якої категорії, крім ВСІ, масив карток повинен фільтруватися
  //  і на сторінці повинні бути показані лише ті тренери, що відносяться до даної категорії.
  // Якщо змінюється і напрям і категорія, на сторінці повинні показатися картки тільки тих тренерів,
  // що відповідають і вибраному напряму, і вибраній категорії одночасно.
  // При фільтрації сторінка не повинна перезавантажуватись.

  const directionUa = {
    all: "всі",
    gym: "тренажерний зал",
    "fight club": "бійцівський клуб",
    "kids club": "дитячий клуб",
    "swimming pool": "басейн",
  };

  const categoriesUa = {
    all: "всі",
    master: "майстер",
    specialist: "спеціаліст",
    instructor: "інструктор",
  };

  //////////////////////////////////////////////////////////////////////
  const filterData = () => {
    let filteredData = DATA;

    if (currentDirection !== "всі") {
      filteredData = filteredData.filter(
        (trainer) => trainer.specialization.toLowerCase() === currentDirection
      );
    }

    if (currentCategory !== "всі") {
      filteredData = filteredData.filter(
        (trainer) => trainer.category.toLowerCase() === currentCategory
      );
    }

    return filteredData;
  };

  ////////////////////////////////////////////////////////////////////////
  const form = document.querySelector(".filters");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const direction = form.elements["direction"].value;
    currentDirection = directionUa[direction.toLowerCase()];

    const category = form.elements["category"].value;
    currentCategory = categoriesUa[category.toLowerCase()];

    const sortedAndFilteredData = sortBy(currentSortCategory, filterData());
    renderTrainers(sortedAndFilteredData);
  });
});

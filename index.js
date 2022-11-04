const API = "  http://localhost:8000/products";
console.log(API);


//переменные для инпутов: добавление товара
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let descr = document.querySelector("#descr");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");
//переменные для инпутов: редактирования товара
let ediitTitle = document.querySelector("#edit-title");
let editPrice = document.querySelector("#edit-price");
let editDecr = document.querySelector("#edit-descr");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let emaxpleModel = document.querySelector("#exampleModal");

let search = document.querySelector("#search");

let searchValue = "";
let curentPage = 1; //текущая страница
let pageTotalcount = 1; //общее кол
let paginList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

let list = document.querySelector("#products-list");
btnAdd.addEventListener("click", async function () {
  let obj = {
    title: title.value,
    price: price.value,
    descr: descr.value,
    image: image.value,
  }; //проверкка на заполненость
  render();
  if (
    !obj.title.trim() ||
    !obj.price.trim() ||
    !obj.descr.trim() ||
    !obj.image.trim()
  ) {
    alert("заполните все поля");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }, //кодировка
    body: JSON.stringify(obj),
  });

  //очишение после нажатия на enter
  title.value = "";
  price.value = "";
  descr.value = "";
  image.value = "";
});

// отображение карточек товаров
async function render() {
  let products = await fetch(
    `${API}/?q=${searchValue}&_page=${curentPage}&_limit=6`
  ) //Отправка get запроса
    .then((res) => res.json()) //переводим всё в json формат
    .catch((err) => console.log(err)); //в случае ошибки
  //   console.log(products);

  drawPaginationButtons();

  list.innerHTML = "";
  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card m-5"  style="width: 18rem;">
    <img src=${element.image} class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      <p class="card-text">${element.descr}</p>
      <p class="card-text">$ ${element.price}</p>
      <a href="#"  id='${element.id}' 
      onclick= 'deleteProoduct(${element.id})' class="btn btn-danger btn-delete">Delete</a>
      <a href="#" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary btn-edit">Edit</a>
    </div>
  </div>`;
    list.append(newElem);
  });
}
render();

//pagination

function drawPaginationButtons() {
  fetch(`${API}/?q=${searchValue}`) ///запрос на сервер, чтобы узнать общее кол продуктов
    .then((res) => res.json())
    .then((data) => {
      pageTotalcount = Math.ceil(data.length / 6); ///общее кол продуктов делим на кол продуктов которое отоброжается на одной странице pageTotalcount = кол-во страниц
      paginList.innerHTML = "";
      for (let i = 1; i <= pageTotalcount; i++) {
        if (curentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item active">
            <a class="page-link page_number" href="#">${i}</a>
            </li>`;
          paginList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item ">
              <a class="page-link page_number" href="#">${i}</a>
              </li>`;
          paginList.append(page1);
        }
      }
      //? prev/next
      if (curentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }
      if (curentPage == pageTotalcount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}
// кнопкi переключение стараниц

prev.addEventListener("click", () => {
  if (curentPage <= 1) {
    return;
  }
  curentPage--;
  render();
});
next.addEventListener("click", () => {
  if (curentPage >= pageTotalcount) {
    return;
  }
  curentPage++;
  render();
});
// кнопачки 1/2/3
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page_number")) {
    curentPage = e.target.innerText;
    render();
  }
});

//delete
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then(() => render());
  }
});
// function deleteProoduct() {
//   fetch(`${API}/${id}`, {
//     method: "DELETE",
//   }).then(() => render());
// }

//edit
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        ediitTitle.value = data.title;
        editPrice.value = data.price;
        editDecr.value = data.descr;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener("click", function () {
  let id = this.id; /// вытаскиваем из кнопки id и ложим его в переменную

  let title = ediitTitle.value;
  let price = editPrice.value;
  let descr = editDecr.value;
  let img = editImage.value;

  if (!title || !price || !descr || !img) return; //проверка на заполненость полей модального окна

  let editProduct = {
    title: title,
    price: price,
    descr: descr,
    image: img,
  };
  saveEdit(editProduct, id);
});

function saveEdit(edittedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(edittedProduct),
  }).then(() => {
    render();
  });
  let modal = bootstrap.Modal.getInstance(emaxpleModel);
  modal.hide();
}
//search input
search.addEventListener("input", () => {
  searchValue = search.value;
  render();
});



// вудн;



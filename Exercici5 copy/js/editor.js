$(function() {
  // Hacer los elementos de la toolbox arrastrables
  $(".tool").draggable({
    helper: "clone",
    revert: "invalid"
  });

  function initializeDroppable() {
    $(".column").droppable({
      accept: ".tool",
      drop: function(event, ui) {
        const type = ui.draggable.data("type");
        if ($(this).children().length >= 2 && $(this).hasClass("half")) {
          alert("Solo se permiten dos elementos por columna.");
          return;
        }
        if ($(this).children().length >= 1 && !$(this).hasClass("half")) {
          alert("Solo se permite un elemento en esta columna.");
          return;
        }

        let newElement;
        if (type === "paragraph") {
          newElement = $(
            `<div class="element">
              <p class="editable" onclick="editParagraph(this)">Escribe aquí tu texto...</p>
            </div>`
          );
        } else if (type === "image") {
          newElement = $(
            `<div class="element">
              <input type="file" accept="image/*" onchange="loadImage(event)" />
              <img src="" alt="Imagen" style="display: none;">
            </div>`
          );
        }

        $(this).append(newElement);
        makeElementsDraggable();
      }
    });
  }

  function makeElementsDraggable() {
    $(".element").draggable({
      helper: "original",
      revert: "invalid"
    });
  }

  $("#add-row").on("click", function() {
    const columnCount = $("#column-choice").val();
    let newRow = '<div class="row">';
    
    if (columnCount === "1") {
      newRow += `<div class="column"></div>`;
    } else {
      newRow += `
        <div class="column half"></div>
        <div class="column half"></div>`;
    }

    newRow += `
      <button class="delete-row-btn">Eliminar fila</button>
      </div>`;
    $("#builder .row-container").append(newRow);

    initializeDroppable();
    initializeDeleteButtons();
  });

  function initializeDeleteButtons() {
    $(".delete-row-btn").off("click").on("click", function() {
      $(this).closest(".row").remove();
    });
  }

  // Guardar configuración
  $("#save-config").on("click", function() {
    const rows = [];
    $(".row").each(function() {
      const row = [];
      $(this).find(".column").each(function() {
        const column = [];
        $(this).children(".element").each(function() {
          if ($(this).find("p").length) {
            column.push({
              type: "paragraph",
              content: $(this).find("p").text()
            });
          } else if ($(this).find("img").length) {
            column.push({
              type: "image",
              src: $(this).find("img").attr("src")
            });
          }
        });
        row.push(column);
      });
      rows.push(row);
    });

    let storedNews = JSON.parse(localStorage.getItem("whaleNews")) ?? [];
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get("id");
    let existingNews = storedNews.find(news => news.id == newsId);

    if (existingNews) {
      // Update existing news
      existingNews.titol = $("#newsTitle").val();
      existingNews.rows = rows;
    } else {
      // Create new news
      const newsCount = storedNews.length;
      const newNews = {
        id: newsCount + 1,
        titol: $("#newsTitle").val(),
        autor: "Peri",
        date: dataDeAvui(),
        rows: rows,
        status: 0
      };
      storedNews.unshift(newNews);
    }

    localStorage.setItem("whaleNews", JSON.stringify(storedNews));
    alert("Configuración guardada en el navegador.");
  });



  $("#publicarNoticia").on("click", ()=>{
    const rows = [];
    $(".row").each(function() {
      const row = [];
      $(this).find(".column").each(function() {
        const column = [];
        $(this).children(".element").each(function() {
          if ($(this).find("p").length) {
            column.push({
              type: "paragraph",
              content: $(this).find("p").text()
            });
          } else if ($(this).find("img").length) {
            column.push({
              type: "image",
              src: $(this).find("img").attr("src")
            });
          }
        });
        row.push(column);
      });
      rows.push(row);
    });

    let whaleNews = JSON.parse(localStorage.getItem("whaleNews")) ?? [];
    let cont = whaleNews.length;

    const config = {
      id: cont + 1,
      titol: $("#newsTitle").text(),
      autor: "Peri" ,
      date: dataDeAvui(),
      rows: rows,
      status: 1
    };

    whaleNews.unshift(config);
    localStorage.setItem("whaleNews", JSON.stringify(whaleNews));
    alert("Configuración guardada en el navegador.");
  });
  

  $("#load-config").on("click", function() {
    const config = localStorage.getItem("postBuilderConfig");
    if (!config) {
      alert("No hay configuración guardada.");
      return;
    }

    const rows = JSON.parse(config);
    $(".row-container").empty(); 
    rows.forEach(row => {
      let newRow = '<div class="row">';
      row.forEach(column => {
        newRow += column.length > 1 ? `<div class="column half">` : `<div class="column">`;
        column.forEach(element => {
          if (element.type === "paragraph") {
            newRow += `
              <div class="element">
                <p class="editable" onclick="editParagraph(this)">${element.content}</p>
              </div>`;
          } else if (element.type === "image") {
            newRow += `
              <div class="element">
                <img src="${element.src}" alt="Imagen">
              </div>`;
          }
        });
        newRow += `</div>`;
      });
      newRow += `<button class="delete-row-btn">Eliminar fila</button></div>`;
      $(".row-container").append(newRow);
    });

    initializeDroppable();
    initializeDeleteButtons();
  });

  initializeDroppable();
});

function loadImage(event) {
  const input = event.target;
  const reader = new FileReader();
  reader.onload = function() {
    const img = $(input).siblings("img");
    img.attr("src", reader.result);
    img.show();
    $(input).hide();
  };
  reader.readAsDataURL(input.files[0]);
}

function editParagraph(paragraph) {
  const $p = $(paragraph);
  const currentText = $p.text();
  const input = $(`<input type="text" value="${currentText}" />`);

  input.on("blur", function() {
    const newText = $(this).val();
    $p.text(newText);
    $p.show();
    $(this).remove();
  });

  $p.hide();
  $p.after(input);
  input.focus();
}

function dataDeAvui() {
  return new Date().toISOString().split('T')[0];
}

function editarTitol(title) {
  const $h2 = $(title);
  const input = $(`<input class="input-edit-news-title" type="text" value="${$h2.text()}" />`);

  input.on("blur", function() {
    const newText = $(this).val();
    if (newText) $h2.text(newText);
    $h2.show();
    $(this).remove();
  });

  $h2.hide().after(input);
  input.focus();
}

$(document).ready(() => {

  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get("id");

  let whaleNews = JSON.parse(localStorage.getItem("whaleNews")) ?? [];

  // Cargar la noticia si existe
  if (newsId) {
    const noticia = whaleNews.find(news => news.id == newsId);

    if (noticia) {
      $("#newsTitle").val(noticia.titol);
      $("#newsAuthor").text(noticia.autor); 
      $(".row-container").empty();

      // Renderizar contenido
      noticia.rows.forEach(row => {
        let newRow = '<div class="row">';
        row.forEach(column => {
          newRow += column.length > 1 ? `<div class="column half">` : `<div class="column">`;
          column.forEach(element => {
            if (element.type === "paragraph") {
              newRow += `
                <div class="element">
                  <p class="editable" onclick="editParagraph(this)">${element.content}</p>
                </div>`;
            } else if (element.type === "image") {
              newRow += `
                <div class="element">
                  <img src="${element.src}" alt="Imagen">
                </div>`;
            }
          });
          newRow += `</div>`;
        });
        newRow += `<button class="delete-row-btn">Eliminar fila</button></div>`;
        $(".row-container").append(newRow);
      });

      initializeDroppable();
      initializeDeleteButtons();
    }
  }

  $("#save-config").on("click", () => {
    const rows = [];
    $(".row").each(function () {
      const row = [];
      $(this).find(".column").each(function () {
        const column = [];
        $(this).children(".element").each(function () {
          if ($(this).find("p").length) {
            column.push({
              type: "paragraph",
              content: $(this).find("p").text()
            });
          } else if ($(this).find("img").length) {
            column.push({
              type: "image",
              src: $(this).find("img").attr("src")
            });
          }
        });
        row.push(column);
      });
      rows.push(row);
    });

    const updatedNews = {
      ...noticia,
      titol: $("#newsTitle").val(),
      rows: rows
    };

    const index = whaleNews.findIndex(news => news.id == newsId);
    if (index !== -1) {
      whaleNews[index] = updatedNews;
      localStorage.setItem("whaleNews", JSON.stringify(whaleNews));
      alert("Noticia actualizada correctamente.");
    }
  });

  $("#publicarNoticia").on("click", () => {
    const index = whaleNews.findIndex(news => news.id == newsId);
    if (index !== -1) {
      whaleNews[index].status = 1; // Cambiar el estado a "publicada"
      localStorage.setItem("whaleNews", JSON.stringify(whaleNews));
      alert("Noticia publicada correctamente.");
    } else {
      alert("Error: no se encontró la noticia.");
    }
  });
});




import { createNews, updateNews, deleteNews, getNews, getAuth } from './firebase.js';


// Al inicio del archivo, después de los imports
const auth = getAuth();

// Define functions in global scope
window.loadImage = function(event) {
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

window.editParagraph = function(paragraph) {
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

window.editarTitol = function(title) {
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

window.initializeDroppable = function() {
  $(".column").droppable({
    accept: ".tool",
    drop: function(event, ui) {
      const type = ui.draggable.data("type");
      if ($(this).children().length >= 2 && $(this).hasClass("half")) {
        return;
      }
      if ($(this).children().length >= 1 && !$(this).hasClass("half")) {
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
      window.makeElementsDraggable();
    }
  });
};

window.makeElementsDraggable = function() {
  $(".element").draggable({
    helper: "original",
    revert: "invalid"
  });
};

window.initializeDeleteButtons = function() {
  $(".delete-row-btn").off("click").on("click", function() {
    $(this).closest(".row").remove();
  });
};

$(function() {
  // Hacer los elementos de la toolbox arrastrables
  $(".tool").draggable({
    helper: "clone",
    revert: "invalid"
  });

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

    window.initializeDroppable();
    window.initializeDeleteButtons();
  });

  // Guardar configuración
  $("#save-config").on("click", async function() {
    try {
        const sections = [];
        $(".row").each(function() {
            $(this).find(".column").each(function() {
                $(this).children(".element").each(function() {
                    if ($(this).find("p").length) {
                        sections.push({
                            type: "paragraph",
                            content: $(this).find("p").text(),
                            columnType: $(this).closest('.column').hasClass('half') ? 'half' : 'full'
                        });
                    } else if ($(this).find("img").length) {
                        sections.push({
                            type: "image",
                            src: $(this).find("img").attr("src"),
                            columnType: $(this).closest('.column').hasClass('half') ? 'half' : 'full'
                        });
                    }
                });
            });
        });

        const newsData = {
            titol: $("#newsTitle").text(),
            autor: auth.currentUser ? auth.currentUser.name : "Anònim",
            date: new Date().toISOString(),
            sections: sections,
            status: 0  // Guardar como borrador
        };

        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get("id");

        if (newsId) {
            await updateNews(newsId, newsData);
            console.log("Noticia guardada como borrador con ID:", newsId);
        } else {
            const newNewsId = await createNews(newsData);
            console.log("Nueva noticia creada como borrador con ID:", newNewsId);
        }

        alert('Noticia guardada com a borrador correctament');
        window.location.href = "../pages/admin.html";
    } catch (error) {
        console.error("Error al guardar:", error);
        alert('Error al guardar la noticia: ' + error.message);
    }
});

  // Guardar como borrador
  // $("#save-draft").on("click", function() {
  //   const rows = [];
  //   $(".row").each(function() {
  //     const row = [];
  //     $(this).find(".column").each(function() {
  //       const column = [];
  //       $(this).children(".element").each(function() {
  //         if ($(this).find("p").length) {
  //           column.push({
  //             type: "paragraph",
  //             content: $(this).find("p").text()
  //           });
  //         } else if ($(this).find("img").length) {
  //           column.push({
  //             type: "image",
  //             src: $(this).find("img").attr("src")
  //           });
  //         }
  //       });
  //       row.push(column);
  //     });
  //     rows.push(row);
  //   });

  //   let storedNews = JSON.parse(localStorage.getItem("whaleNews")) ?? [];
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const newsId = urlParams.get("id");
  //   let existingNews = storedNews.find(news => news.id == newsId);

  //   if (existingNews) {
  //     // Update existing news
  //     existingNews.titol = $("#newsTitle").val();
  //     existingNews.rows = rows;
  //     existingNews.status = 0; // Set status to draft
  //   } else {
  //     // Create new news
  //     const newsCount = storedNews.length;
  //     const newNews = {
  //       id: newsCount + 1,
  //       titol: $("#newsTitle").val(),
  //       autor: "Peri",
  //       date: dataDeAvui(),
  //       rows: rows,
  //       status: 0
  //     };
  //     storedNews.unshift(newNews);
  //   }

  //   localStorage.setItem("whaleNews", JSON.stringify(storedNews));
  // });

  // Eliminar noticia
  $("#delete-news").on("click", async function() {
    if (!confirm('¿Estás seguro de que deseas eliminar esta noticia?')) return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const newsId = urlParams.get("id");
      
      if (newsId) {
        await deleteNews(newsId);
        alert('Noticia eliminada correctament');
        window.location.href = "./index.html";
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert('Error al eliminar la noticia');
    }
  });

  // Publicar noticia
  $("#publicarNoticia").on("click", async function() {
    try {
        const sections = [];
        $(".row").each(function() {
            $(this).find(".column").each(function() {
                $(this).children(".element").each(function() {
                    if ($(this).find("p").length) {
                        sections.push({
                            type: "paragraph",
                            content: $(this).find("p").text(),
                            columnType: $(this).closest('.column').hasClass('half') ? 'half' : 'full'
                        });
                    } else if ($(this).find("img").length) {
                        sections.push({
                            type: "image",
                            src: $(this).find("img").attr("src"),
                            columnType: $(this).closest('.column').hasClass('half') ? 'half' : 'full'
                        });
                    }
                });
            });
        });

        const newsData = {
            titol: $("#newsTitle").text(),
            autor: auth.currentUser ? auth.currentUser.displayName : 'Anònim',
            date: new Date().toISOString(),
            sections: sections,
            status: 1  // Publicar directamente
        };

        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get("id");

        if (newsId) {
            await updateNews(newsId, newsData);
            console.log("Noticia publicada con ID:", newsId);
        } else {
            const newNewsId = await createNews(newsData);
            console.log("Nueva noticia creada y publicada con ID:", newNewsId);
        }

        alert('Noticia publicada correctamente');
        window.location.href = "../pages/admin.html";
    } catch (error) {
        console.error("Error al publicar:", error);
        alert('Error al publicar la noticia: ' + error.message);
    }
});

  $("#load-config").on("click", function() {
    const config = localStorage.getItem("postBuilderConfig");
    if (!config) {
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

    window.initializeDroppable();
    window.initializeDeleteButtons();
  });

  window.initializeDroppable();
});

// Cargar noticia inicial
$(document).ready(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get("id");

  if (newsId) {
    try {
      const noticia = await getNews(newsId);
      if (noticia) {
        $("#newsTitle").text(noticia.titol);
        $("#newsAuthor").text(noticia.autor);
        $(".row-container").empty();

        let currentRow = null;
        noticia.sections.forEach((section, index) => {
          if (index % 2 === 0 || section.columnType === 'full') {
            currentRow = $('<div class="row"></div>');
            $(".row-container").append(currentRow);
          }

          const columnClass = section.columnType === 'half' ? 'column half' : 'column';
          const column = $(`<div class="${columnClass}"></div>`);
          
          if (section.type === "paragraph") {
            column.append(`
              <div class="element">
                <p class="editable" onclick="editParagraph(this)">${section.content}</p>
              </div>`);
          } else if (section.type === "image") {
            column.append(`
              <div class="element">
                <img src="${section.src}" alt="Imagen">
              </div>`);
          }
          
          currentRow.append(column);
        });

        window.initializeDroppable();
        window.initializeDeleteButtons();
      }
    } catch (error) {
      console.error("Error al cargar la noticia:", error);
      alert('Error al cargar la noticia');
    }
  }
});

function dataDeAvui() {
  return new Date().toISOString().split('T')[0];
}




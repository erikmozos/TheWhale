let storedNews = JSON.parse(localStorage.getItem("whaleNews"));

$(() => {
    if (storedNews) {
        $.each(storedNews, function (index, newsItem) {
            if (newsItem.status === 1) {
                function generateNewsContent(rows) {
                    let htmlContent = '';
                    rows.forEach(row => {
                        if (Array.isArray(row)) {
                            let newRowHtml = '<div class="flex flex-col">';
                            row.forEach(column => {
                                newRowHtml += column.length > 1 ? `<div class="column half">` : `<div class="column">`;
                                column.forEach(element => {
                                    if (element.type === "paragraph") {
                                        newRowHtml += `
                                            <div class="element">
                                                <p class="text-gray-700">${element.content}</p>
                                            </div>
                                        `;
                                    } else if (element.type === "image") {
                                        newRowHtml += `
                                            <div class="element w-12">
                                                <img class="w-8 h-12 object-cover rounded-md" src="${element.src}" alt="Imagen">
                                            </div>
                                        `;
                                    }
                                });
                                newRowHtml += `</div>`;
                            });
                            htmlContent += newRowHtml;
                        }
                    });
                    return htmlContent;
                }

                let newsHtml = `
                    <article class="col-span-1 lg:col-span-2 xl:col-span-2 card bg-white shadow-md rounded-lg overflow-hidden mb-6" id="${newsItem.id}"> 
                        <div class="p-4 bg-blue-50">
                            <h2 class="text-lg font-bold text-blue-600">${newsItem.titol}</h2>
                        </div>
                        <div class="card-content p-4">
                            <div class="news_content text-pretty bg-gray-100 p-3 rounded-md">
                                ${generateNewsContent(newsItem.rows)}           
                            </div>
                            <div class="flex justify-between mt-4">
                                <a href="./dins_noticia.html?id=${newsItem.id}"><button class="btn bg-blue-500 text-white py-2 px-4 rounded-md">Llegir Mes</button></a>
                                <a href="./creadorNoticies.html?id=${newsItem.id}">
                                <button class="btn bg-yellow-500 text-white py-2 px-4 rounded-md">Editar noticia</button>
                                </a>
                                <button class="btn bg-red-500 text-white py-2 px-4 rounded-md delete-news-btn" data-id="${newsItem.id}">Eliminar noticia</button>
                            </div>  
                        </div>
                        <div class="flex justify-between text-lg items-center p-4">
                            <i class="fa fa-user-circle-o text-gray-600" aria-hidden="true"> ${newsItem.autor}</i>
                        </div>
                    </article>
                `;

                $("#contenedor-noticias").append(newsHtml);
            }
        });

        // Add event listener for delete buttons
        $(".delete-news-btn").on("click", function() {
            const newsId = $(this).data("id");
            storedNews = storedNews.filter(news => news.id != newsId);
            localStorage.setItem("whaleNews", JSON.stringify(storedNews));
            $(`#${newsId}`).remove();
            alert("Noticia eliminada correctamente.");
        });
    } else {
        console.log("storedNews empty");
    }
});

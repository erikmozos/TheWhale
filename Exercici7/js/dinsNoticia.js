$(() => {
    // Recuperar el parámetro `id` de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get("id");

    if (newsId) {
        // Obtener las noticias del localStorage
        const whaleNews = JSON.parse(localStorage.getItem("whaleNews"));
        const selectedNews = whaleNews.find(news => news.id == newsId);

        if (selectedNews) {
            let html = `
                <article class="w-full bg-white border rounded-lg shadow-md overflow-hidden mb-10">
                 <div class="p-8">
                        <h1 class="text-5xl font-extrabold text-center mb-8 text-blue-800">${selectedNews.titol}</h1>
                        <div class="text-gray-700 leading-relaxed space-y-6">
            `;

            // Renderizar contenido dinámico
            selectedNews.rows.forEach(row => {
                if (Array.isArray(row)) {
                    row.forEach(column => {
                        column.forEach(element => {
                            if (element.type === "paragraph") {
                                html += `<p class="text-lg">${element.content}</p>`;
                            } else if (element.type === "image") {
                                html += `
                                    <img class="w-full h-auto object-cover rounded-md my-6" src="${element.src}" alt="Imagen">
                                `;
                            }
                        });
                    });
                }
            });

            html += `
                        </div>
                    </div>
                    <!-- Pie de la noticia -->
                    <div class="flex justify-between items-center p-6 bg-gray-100 text-sm text-gray-600 border-t">
                        <span class="flex items-center">
                            <i class="fas fa-user-circle mr-2"></i>${selectedNews.autor}
                        </span>
                        <span>${selectedNews.date}</span>
                    </div>
                </article>
            `;

            $("#noticia-detalle").html(html);
        } else {
            $("#noticia-detalle").html("<p class='text-red-600 font-bold'>No se encontró la noticia.</p>");
        }
    } else {
        $("#noticia-detalle").html("<p class='text-red-600 font-bold'>Id de noticia no válido.</p>");
    }
});

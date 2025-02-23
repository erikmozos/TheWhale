import { getNews } from './firebase.js';

$(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get("id");

    if (newsId) {
        try {
            const selectedNews = await getNews(newsId);

            if (selectedNews) {
                let html = `
                    <article class="w-full bg-white border rounded-lg shadow-md overflow-hidden mb-10">
                        <div class="p-8">
                            <h1 class="text-5xl font-extrabold text-center mb-8 text-blue-800">${selectedNews.titol}</h1>
                            <div class="text-gray-700 leading-relaxed space-y-6">
                `;

                selectedNews.sections.forEach(section => {
                    if (section.type === "paragraph") {
                        html += `<p class="text-lg">${section.content}</p>`;
                    } else if (section.type === "image") {
                        html += `
                            <img class="w-full h-auto object-cover rounded-md my-6" 
                                 src="${section.src}" 
                                 alt="Imagen">
                        `;
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
                            <span>${new Date(selectedNews.date).toLocaleDateString()}</span>
                        </div>
                    </article>
                `;

                $("#noticia-detalle").html(html);
            } else {
                $("#noticia-detalle").html(`
                    <div class="text-center p-8">
                        <p class='text-red-600 font-bold'>No se encontró la noticia.</p>
                    </div>
                `);
            }
        } catch (error) {
            console.error("Error al cargar la noticia:", error);
            $("#noticia-detalle").html(`
                <div class="text-center p-8">
                    <p class='text-red-600 font-bold'>Error al cargar la noticia: ${error.message}</p>
                </div>
            `);
        }
    } else {
        $("#noticia-detalle").html(`
            <div class="text-center p-8">
                <p class='text-red-600 font-bold'>Id de noticia no válido.</p>
            </div>
        `);
    }
});
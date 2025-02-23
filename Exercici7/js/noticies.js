import { getAllNews, deleteNews } from './firebase.js';
import { getAuth } from './firebase.js';
import { doc, getDoc, getFirestore } from './firebase.js';

const db = getFirestore();
const auth = getAuth();

// Función para verificar permisos
async function checkUserPermissions() {
    try {
        const user = auth.currentUser;
        if (!user) return false;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) return false;

        const userData = userDoc.data();
        console.log(userData.edit_news);
        return userData.rol === 'admin' || userData.edit_news === true;
    } catch (error) {
        console.error("Error al verificar permisos:", error);
        return false;
    }
}

$(async () => {
    const hasPermissions = await checkUserPermissions();
    

    // Ocultar/mostrar botones de navegación según permisos
    if (hasPermissions) {
        $(".admin-controls").show();
    } else {
        $(".admin-controls").hide();
    }

    try {
        const news = await getAllNews();
        
        if (news && news.length > 0) {
            const publishedNews = news.filter(newsItem => newsItem.status === 1);

            publishedNews.forEach(newsItem => {
                function generateNewsContent(sections) {
                    let htmlContent = '';
                    let currentRow = '<div class="flex flex-col">';
                    
                    sections.forEach((section, index) => {
                        const columnClass = section.columnType === 'half' ? 'column half' : 'column';
                        
                        if (section.type === "paragraph") {
                            currentRow += `
                                <div class="${columnClass}">
                                    <div class="element">
                                        <p class="text-gray-700">${section.content}</p>
                                    </div>
                                </div>
                            `;
                        } else if (section.type === "image") {
                            currentRow += `
                                <div class="${columnClass}">
                                    <div class="element">
                                        <img class="w-full h-auto object-cover rounded-md" 
                                             src="${section.src}" 
                                             alt="Imagen">
                                    </div>
                                </div>
                            `;
                        }
                    });

                    htmlContent += currentRow + '</div>';
                    return htmlContent;
                }

                let newsHtml = `
                    <article class="col-span-1 lg:col-span-2 xl:col-span-2 card bg-white shadow-md rounded-lg overflow-hidden mb-6" id="${newsItem.id}"> 
                        <div class="p-4 bg-blue-50">
                            <h2 class="text-lg font-bold text-blue-600">${newsItem.titol}</h2>
                        </div>
                        <div class="card-content p-4">
                            <div class="news_content text-pretty bg-gray-100 p-3 rounded-md">
                                ${generateNewsContent(newsItem.sections)}           
                            </div>
                            <div class="flex justify-between mt-4">
                                <a href="./dins_noticia.html?id=${newsItem.id}">
                                    <button class="btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                                        Llegir Mes
                                    </button>
                                </a>
                                ${hasPermissions && newsItem.autorId === auth.currentUser?.uid ? `
                                    <a href="./creadorNoticies.html?id=${newsItem.id}">
                                        <button class="btn bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">
                                            Editar noticia
                                        </button>
                                    </a>
                                    <button class="btn bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 delete-news-btn" 
                                            data-id="${newsItem.id}">
                                        Eliminar noticia
                                    </button>
                                ` : ''}
                            </div>  
                        </div>
                        <div class="flex justify-between text-lg items-center p-4">
                            <i class="fa fa-user-circle-o text-gray-600" aria-hidden="true"> ${newsItem.autor}</i>
                            <span class="text-gray-500">${new Date(newsItem.date).toLocaleDateString()}</span>
                        </div>
                    </article>
                `;

                $("#contenedor-noticias").append(newsHtml);
            });

            // Solo añadir event listeners si tiene permisos
            if (hasPermissions) {
                $(".delete-news-btn").on("click", async function() {
                    // ... código existente de eliminación ...
                });
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
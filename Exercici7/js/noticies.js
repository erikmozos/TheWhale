import { getAllNews, deleteNews } from './firebase.js';
import { getAuth, onAuthStateChanged } from './firebase.js';
import { doc, getDoc, getFirestore } from './firebase.js';

const db = getFirestore();
const auth = getAuth();

async function checkUserPermissions() {
    try {
        const user = auth.currentUser;
        if (!user) return false;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) return false;
        const userData = userDoc.data();
        return userData.role === 'admin' || userData.edit_news === true;
    } catch (error) {
        return false;
    }
}

function generateNewsContent(sections) {
    let htmlContent = '';
    let currentRow = '<div class="flex flex-col">';
    
    sections.forEach((section) => {
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

$(document).ready(function() {
    $(".admin-controls").hide();
    
    onAuthStateChanged(auth, async (user) => {
        let hasPermissions = false;
        let userData = null;
        
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                
                if (userDoc.exists()) {
                    userData = userDoc.data();
                    hasPermissions = userData.role === 'admin' || userData.edit_news === true;
                    localStorage.setItem("user", JSON.stringify({
                        ...userData,
                        uid: user.uid
                    }));
                }
            } catch (error) {
            }
        } else {
            localStorage.removeItem("user");
        }
        
        if (hasPermissions) {
            $(".admin-controls").show();
        } else {
            $(".admin-controls").hide();
        }
        
        loadNews(hasPermissions, userData);
    });
});

async function loadNews(hasPermissions, userData) {
    try {
        const news = await getAllNews();
        
        if (news && news.length > 0) {
            $("#contenedor-noticias").empty();
            const publishedNews = news.filter(newsItem => newsItem.status === 1);

            publishedNews.forEach(newsItem => {
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
                                ${hasPermissions && (userData?.role === "admin" || newsItem.autorId === auth.currentUser?.uid) ? `
                                    <div class="admin-buttons">
                                        <a href="./creadorNoticies.html?id=${newsItem.id}">
                                            <button class="btn bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">
                                                Editar notícia
                                            </button>
                                        </a>
                                        <button class="btn bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 delete-news-btn" 
                                                data-id="${newsItem.id}">
                                            Eliminar notícia
                                        </button>
                                    </div>
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

            if (hasPermissions) {
                $(".delete-news-btn").on("click", async function() {
                    const newsId = $(this).data("id");
                    if (confirm("¿Estàs segur que vols eliminar aquesta notícia?")) {
                        try {
                            await deleteNews(newsId);
                            $(`#${newsId}`).remove();
                            alert("Notícia eliminada correctament");
                        } catch (error) {
                            alert("Error al eliminar la notícia");
                        }
                    }
                });
            }
        } else {
            $("#contenedor-noticias").html('<p class="text-center w-full p-4">No hi ha notícies disponibles</p>');
        }
    } catch (error) {
        $("#contenedor-noticias").html('<p class="text-center text-red-500 w-full p-4">Error al carregar ses notícies</p>');
    }
}
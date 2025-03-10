import { getAllNews, deleteNews, updateNews } from './firebase.js';
import { getAuth, onAuthStateChanged } from './firebase.js';

const auth = getAuth();

$(document).ready(function() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "../pages/logIn.html";
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser || (!currentUser.edit_news && currentUser.role !== 'admin')) {
        window.location.href = '../index.html';
    }
        
        try {
            const news = await getAllNews();
            $("#loading-message").hide();
            const drafts = news.filter(newsItem => newsItem.status === 0);

            if (drafts.length > 0) {
                drafts.forEach(draft => {
                    const previewContent = draft.sections
                        .filter(section => section.type === "paragraph")
                        .slice(0, 1)
                        .map(section => section.content)
                        .join(" ")
                        .substring(0, 150) + "...";

                    const draftHtml = `
                        <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200" id="draft-${draft.id}">
                            <h2 class="text-xl font-semibold mb-2">${draft.titol}</h2>
                            <p class="text-gray-600 mb-4">${previewContent}</p>
                            <div class="text-sm text-gray-500 mb-4">
                                <span>Autor: ${draft.autor}</span>
                                <span class="ml-4">Fecha: ${new Date(draft.date).toLocaleDateString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <button class="edit-draft bg-blue-500 text-dark px-4 py-2 rounded hover:bg-blue-600"
                                        data-id="${draft.id}">
                                    Editar
                                </button>
                                <button class="publish-draft bg-green-500 text-dark px-4 py-2 rounded hover:bg-green-600"
                                        data-id="${draft.id}">
                                    Publicar
                                </button>
                                <button class="delete-draft bg-red-500 text-dark px-4 py-2 rounded hover:bg-red-600"
                                        data-id="${draft.id}">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    `;

                    $("#borradores-container").append(draftHtml);
                });

                $(".edit-draft").on("click", function() {
                    const draftId = $(this).data("id");
                    window.location.href = `./creadorNoticies.html?id=${draftId}`;
                });

                $(".publish-draft").on("click", async function() {
                    const draftId = $(this).data("id");
                    if (confirm("¿Estás seguro de que quieres publicar este borrador?")) {
                        try {
                            await updateNews(draftId, { status: 1 });
                            alert("Borrador publicat correctament");
                            $(`#draft-${draftId}`).remove();
                            
                            if ($("#borradores-container").children().length === 0) {
                                $("#borradores-container").html(
                                    '<p class="text-center text-gray-500 text-lg col-span-3">No hay borradores disponibles.</p>'
                                );
                            }
                        } catch (error) {
                            console.error("Error al publicar:", error);
                            alert("Error al publicar el borrador");
                        }
                    }
                });

                $(".delete-draft").on("click", async function() {
                    const draftId = $(this).data("id");
                    if (confirm("¿Estás seguro de que quieres eliminar este borrador?")) {
                        try {
                            await deleteNews(draftId);
                            alert("Borrador eliminat correctament");
                            $(`#draft-${draftId}`).remove();
                            
                            if ($("#borradores-container").children().length === 0) {
                                $("#borradores-container").html(
                                    '<p class="text-center text-gray-500 text-lg col-span-3">No hay borradores disponibles.</p>'
                                );
                            }
                        } catch (error) {
                            console.error("Error al eliminar:", error);
                            alert("Error al eliminar el borrador");
                        }
                    }
                });
            } else {
                $("#borradores-container").html(
                    '<p class="text-center text-gray-500 text-lg col-span-3">No hay borradores disponibles.</p>'
                );
            }
        } catch (error) {
            console.error("Error al cargar los borradores:", error);
            $("#loading-message").hide();
            $("#borradores-container").html(
                '<p class="text-center text-red-500 text-lg col-span-3">Error al cargar los borradores.</p>'
            );
        }
    });
});
$(document).ready(function () {
    const users = JSON.parse(localStorage.getItem("users"));

    function renderUsers() {
        const table = $("<table>").addClass(
            "min-w-full bg-white border-collapse rounded-lg shadow-md overflow-hidden"
        );
        const headerRow = `
            <thead>
                <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th class="py-3 px-6 text-left">ID</th>
                    <th class="py-3 px-6 text-left">Nom</th>
                    <th class="py-3 px-6 text-left">Email</th>
                    <th class="py-3 px-6 text-center">Editar Noticies</th>
                    <th class="py-3 px-6 text-center">Editar Usuaris</th>
                    <th class="py-3 px-6 text-center">Editar Arxius</th>
                    <th class="py-3 px-6 text-center">Editar</th>
                    <th class="py-3 px-6 text-center">Eliminar</th>
                </tr>
            </thead>`;
        table.append(headerRow);

        const tbody = $("<tbody>");
        users.forEach((user) => {
            const isAdmin = user.name.toLowerCase() === "admin";
            const row = `
            <tr class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 text-left">${user.id}</td>
                <td class="py-3 px-6 text-left">${user.name}</td>
                <td class="py-3 px-6 text-left">${user.email}</td>
                <td class="py-3 px-6 text-center">${user.edit_news ? "✅" : "❌"}</td>
                <td class="py-3 px-6 text-center">${user.edit_users ? "✅" : "❌"}</td>
                <td class="py-3 px-6 text-center">${user.edit_bone_files ? "✅" : "❌"}</td>
                <td class="py-3 px-6 text-center">
                    <button class="bg-gray-300 text-gray-500 py-1 px-3 rounded-full text-sm cursor-not-allowed">
                        Editar
                    </button>
                </td>
                <td class="py-3 px-6 text-center">
                    ${
                        isAdmin
                            ? '<span class="text-gray-400 italic">No permitido</span>'
                            : `<button class="delete-user-btn bg-red-500 text-white py-1 px-3 rounded-full text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400" data-id="${user.id}">
                                Eliminar
                              </button>`
                    }
                </td>
            </tr>`;
            tbody.append(row);
        });

        table.append(tbody);
        $("#edit-users-container").empty().append(
            $("<div>")
                .addClass("overflow-x-auto")
                .append(table)
        );
    }

    renderUsers();

    $(document).on("click", ".delete-user-btn", function () {
        const userId = $(this).data("id");
        const index = users.findIndex((u) => u.id === userId);

        if (index !== -1) {
            users.splice(index, 1);
            localStorage.setItem("users", JSON.stringify(users));
            renderUsers();
        }
    });
});

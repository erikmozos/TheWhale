import { createUser, getUsers, deleteUser, updateUser } from './firebase.js';

$(document).ready(async function () {

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || (!currentUser.edit_users && currentUser.role !== 'admin')) {
        window.location.href = '../index.html';
        return;
    }
    // Cargar usuarios iniciales
    let users = await getUsers() || [];

    function renderUsers(usersList) {
        // Contenedor responsive para la tabla
        const tableWrapper = $("<div>").addClass(
            "w-full overflow-x-auto rounded-lg shadow-md"
        );
        
        const table = $("<table>").addClass(
            "min-w-full bg-white border-collapse"
        );
        
        const headerRow = `
            <thead>
                <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th class="py-3 px-4 text-left whitespace-nowrap">Nom</th>
                    <th class="py-3 px-4 text-left whitespace-nowrap">Email</th>
                    <th class="py-3 px-4 text-center whitespace-nowrap">Editar Noticies</th>
                    <th class="py-3 px-4 text-center whitespace-nowrap">Editar Usuaris</th>
                    <th class="py-3 px-4 text-center whitespace-nowrap">Editar Arxius</th>
                    <th class="py-3 px-4 text-center whitespace-nowrap">Editar</th>
                    <th class="py-3 px-4 text-center whitespace-nowrap">Eliminar</th>
                </tr>
            </thead>`;
        table.append(headerRow);
    
        const tbody = $("<tbody>");
        usersList.forEach((user) => {
            const isAdmin = user.name.toLowerCase() === "admin";
            const row = `
                <tr class="border-b border-gray-200 hover:bg-gray-100">
                    <td class="py-3 px-4 text-left whitespace-nowrap">${user.name}</td>
                    <td class="py-3 px-4 text-left whitespace-nowrap">${user.email}</td>
                    <td class="py-3 px-4 text-center whitespace-nowrap">${user.edit_news ? "✅" : "❌"}</td>
                    <td class="py-3 px-4 text-center whitespace-nowrap">${user.edit_users ? "✅" : "❌"}</td>
                    <td class="py-3 px-4 text-center whitespace-nowrap">${user.edit_bone_files ? "✅" : "❌"}</td>
                    <td class="py-3 px-4 text-center whitespace-nowrap">
                        <button class="edit-user-btn bg-yellow-500 text-white py-1 px-3 rounded-full text-sm hover:bg-yellow-600" data-id="${user.id}">
                            Editar
                        </button>
                    </td>
                    <td class="py-3 px-4 text-center whitespace-nowrap">
                        ${isAdmin 
                            ? '<span class="text-gray-400 italic">No permés</span>'
                            : `<button class="delete-user-btn bg-red-500 text-white py-1 px-3 rounded-full text-sm hover:bg-red-600" data-id="${user.id}">
                                Eliminar
                               </button>`
                        }
                    </td>
                </tr>`;
            tbody.append(row);
        });
    
        table.append(tbody);
        tableWrapper.append(table);
        $("#edit-users-container").empty().append(tableWrapper);
    }

    $('#generateInputs').on('click', function() {
        const numUsers = parseInt($('#numUsers').val());
        const container = $('#emailInputsContainer');
        container.empty();

        if (numUsers > 0) {
            for (let i = 1; i <= numUsers; i++) {
                container.append(`
                    <div class="email-input-group mb-4">
                        <label for="email${i}" class="block text-sm font-medium text-gray-700">Email usuari ${i}</label>
                        <input type="email" 
                               id="email${i}" 
                               name="email${i}" 
                               required
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                               placeholder="exemple@iesjoanramis.org">
                    </div>
                `);
            }
        } else {
            alert('Introduir nombre d\'usuaris');
        }
    });

    $('#createUsersForm').on('submit', async function(e) {
        e.preventDefault();
        
        const defaultPassword = $('#defaultPassword').val();
        const emails = [];
    
        $('.email-input-group input[type="email"]').each(function() {
            const email = $(this).val().trim();
            if (email) emails.push(email);
        });
    
        if (emails.length === 0) {
            alert('Introduir email vàlid');
            return;
        }
    
        try {
            // Crear usuarios uno por uno
            for (const [index, email] of emails.entries()) {
                const userData = {
                    email: email,
                    password: defaultPassword,
                    name: `Usuario ${index + 1}`,
                    edit_users: false,
                    edit_news: false,
                    edit_bone_files: false,
                    active: true,
                    is_first_login: true,
                    role: 'user'
                };
    
                await createUser('users', JSON.stringify(userData));
            }
    
            alert(`${emails.length} usuarios creados correctamente`);
            $('#createUsersForm')[0].reset();
            $('#emailInputsContainer').empty();
            
            // Actualizar lista de usuarios
            users = await getUsers();
            renderUsers(users);
        } catch (error) {
            console.error('Error al crear usuarios:', error);
            alert('Error al crear usuaris: ' + error.message);
        }
    });

    // Cargar usuarios iniciales
    renderUsers(users);

    $(document).on('click', '.edit-user-btn', function() {
        const userId = $(this).data('id');
        const user = users.find(u => u.id === userId);
        
        // Crear y mostrar el formulario de edición
        const editForm = `
            <div id="editUserForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div class="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h3 class="text-xl font-bold mb-4">Editar Usuari</h3>
                    <form class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" id="editName" value="${user.name}"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Permisos</label>
                            <div class="space-y-2">
                                <div>
                                    <input type="checkbox" id="editNews" ${user.edit_news ? 'checked' : ''}>
                                    <label>Editar Notícies</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="editUsers" ${user.edit_users ? 'checked' : ''}>
                                    <label>Editar Usuaris</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="editFiles" ${user.edit_bone_files ? 'checked' : ''}>
                                    <label>Editar Arxius</label>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" class="cancel-edit-btn bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                                Cancelar
                            </button>
                            <button type="submit" class="save-edit-btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>`;

        $('body').append(editForm);

        // Manejar el guardado de cambios
        $('#editUserForm form').on('submit', async function(e) {
            e.preventDefault();
            
            const updatedUserData = {
                name: $('#editName').val(),
                edit_news: $('#editNews').is(':checked'),
                edit_users: $('#editUsers').is(':checked'),
                edit_bone_files: $('#editFiles').is(':checked')
            };

            try {
                await updateUser(userId, updatedUserData);
                users = await getUsers();
                renderUsers(users);
                $('#editUserForm').remove();
                alert('Usuari actualizat correctament');
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
                alert('Error al actualizar usuari: ' + error.message);
            }
        });

        // Manejar el botón de cancelar
        $('.cancel-edit-btn').on('click', function() {
            $('#editUserForm').remove();
        });
    });

    // Manejador para el botón de eliminar
    $(document).on('click', '.delete-user-btn', async function() {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            const userId = $(this).data('id');
            try {
                await deleteUser(userId);
                users = await getUsers();
                renderUsers(users);
                alert('Usuari eliminat correctament');
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                alert('Error al eliminar usuari: ' + error.message);
            }
        }
    });
});
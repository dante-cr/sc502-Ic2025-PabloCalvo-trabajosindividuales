document.addEventListener('DOMContentLoaded', function () {
    const API_URL = "backend/tasks.php";
    let isEditMode = false;
    let edittingId;
    let tasks = [];

    async function loadTasks() {
        try {
            const response = await fetch(API_URL, { method: 'GET', credentials: 'include' });
            if (response.ok) {
                tasks = await response.json();
                renderTasks(tasks);
            } else {
                if (response.status == 401) {
                    window.location.href = "index.html";
                }
                console.error("Error loading tasks");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasks.forEach(function (task) {
            let commentsPlaceholder = `
                <div id="comments-${task.id}" class="mt-2 text-muted">
                    <em>Loading comments...</em>
                </div>
            `;

            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small></p>
                        ${commentsPlaceholder}
                        <button type="button" class="btn btn-sm btn-link add-comment" data-id="${task.id}">Add Comment</button>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);

            loadComments(task.id);
        });

        document.querySelectorAll('.edit-task').forEach(button => {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(button => {
            button.addEventListener('click', function (e) {
                document.getElementById("comment-task-id").value = e.target.dataset.id;
                document.getElementById("task-comment").value = '';
                document.getElementById('comment-id')?.remove(); // limpiar si existe
                const modal = new bootstrap.Modal(document.getElementById("commentModal"));
                modal.show();
            });
        });
    }

    function loadComments(taskId) {
        const container = document.getElementById(`comments-${taskId}`);
        if (!container) return;

        fetch(`backend/comments.php?task_id=${taskId}`, { credentials: 'include' })
            .then(res => res.json())
            .then(comments => {
                if (!Array.isArray(comments)) {
                    container.innerHTML = "<small class='text-danger'>Error loading comments.</small>";
                    return;
                }

                if (comments.length === 0) {
                    container.innerHTML = "<small class='text-muted'>No comments yet.</small>";
                    return;
                }

                container.innerHTML = '';
                const ul = document.createElement('ul');
                ul.className = 'list-group list-group-flush';

                comments.forEach(comment => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';

                    const span = document.createElement('span');
                    span.textContent = comment.comment;

                    const btnGroup = document.createElement('div');
                    btnGroup.innerHTML = `
                        <button class="btn btn-sm btn-outline-secondary me-2 edit-comment" 
                                data-id="${comment.id}" 
                                data-taskid="${taskId}" 
                                data-comment="${encodeURIComponent(comment.comment)}">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete-comment" 
                                data-id="${comment.id}" 
                                data-taskid="${taskId}">Delete</button>
                    `;

                    li.appendChild(span);
                    li.appendChild(btnGroup);
                    ul.appendChild(li);
                });

                container.appendChild(ul);
            })
            .catch(() => {
                container.innerHTML = "<small class='text-danger'>Error fetching comments.</small>";
            });
    }

    function handleEditTask(event) {
        try {
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.due_date;
            isEditMode = true;
            edittingId = taskId;
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();
        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }

    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        try {
            const response = await fetch(`${API_URL}?id=${id}`, { credentials: 'include', method: 'DELETE' });
            if (response.ok) {
                loadTasks();
            } else {
                console.error("Error deleting task");
            }
        } catch (err) {
            console.error(err);
        }
    }

    // ✅ CRUD de comentarios desde botones internos
    document.addEventListener('click', function (e) {
        // Edit
        if (e.target.classList.contains('edit-comment')) {
            const commentId = e.target.dataset.id;
            const taskId = e.target.dataset.taskid;
            const commentText = decodeURIComponent(e.target.dataset.comment);

            document.getElementById('comment-task-id').value = taskId;
            document.getElementById('task-comment').value = commentText;
            document.getElementById('comment-id')?.remove();

            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = 'comment-id';
            hiddenInput.value = commentId;
            document.getElementById('comment-form').appendChild(hiddenInput);

            const modal = new bootstrap.Modal(document.getElementById("commentModal"));
            modal.show();
        }

        // Delete
        if (e.target.classList.contains('delete-comment')) {
            const commentId = e.target.dataset.id;
            const taskId = e.target.dataset.taskid;

            if (confirm("Are you sure you want to delete this comment?")) {
                fetch('backend/comments.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    credentials: 'include',
                    body: `id=${commentId}`
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        loadComments(taskId);
                    } else {
                        alert("Error deleting comment.");
                    }
                });
            }
        }
    });

    document.getElementById('comment-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const comment = document.getElementById('task-comment').value;
        const taskId = parseInt(document.getElementById('comment-task-id').value);
        const commentIdField = document.getElementById('comment-id');
        const isEditing = commentIdField !== null;

        if (isEditing) {
            const commentId = parseInt(commentIdField.value);

            fetch('backend/comments.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: commentId,
                    comment: comment
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
                    modal.hide();
                    loadComments(taskId);
                } else {
                    alert("Error updating comment.");
                }
            });

        } else {
            fetch('backend/comments.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    task_id: taskId,
                    comment: comment
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
                    modal.hide();
                    loadComments(taskId);
                } else {
                    alert("Error saving comment.");
                }
            });
        }
    });

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            const response = await fetch(`${API_URL}?id=${edittingId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, due_date: dueDate })
            });
            if (!response.ok) {
                console.error("Error updating task");
            }
        } else {
            const newTask = { title, description, due_date: dueDate };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });
            if (!response.ok) {
                console.error("Error adding task");
            }
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('commentModal').addEventListener('show.bs.modal', function () {
        document.getElementById('comment-form').reset();
        document.getElementById('comment-id')?.remove();
    });

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    loadTasks();
});

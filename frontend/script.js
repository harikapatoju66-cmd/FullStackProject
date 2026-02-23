const API_URL = "http://127.0.0.1:5000";

async function fetchTasks() {
    const pendingRes = await fetch(`${API_URL}/tasks?status=pending`);
    const completedRes = await fetch(`${API_URL}/tasks?status=completed`);

    const pendingTasks = await pendingRes.json();
    const completedTasks = await completedRes.json();

    displayTasks(pendingTasks, "pendingTasks", false);
    displayTasks(completedTasks, "completedTasks", true);
}

function displayTasks(tasks, elementId, isCompleted) {
    const ul = document.getElementById(elementId);
    ul.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = `${task.title} - ${task.description}`;

        if (!isCompleted) {
            const btn = document.createElement("button");
            btn.textContent = "Complete";
            btn.onclick = () => markComplete(task.id);
            li.appendChild(btn);
        }

        ul.appendChild(li);
    });
}

async function addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    fetchTasks();
}

async function markComplete(id) {
    await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: "PUT"
    });

    fetchTasks();
}

fetchTasks();
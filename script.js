let forum = JSON.parse(localStorage.getItem("forumData")) || [];

function addTopic() {
    const title = document.getElementById("topicTitle").value.trim();
    const message = document.getElementById("topicMessage").value.trim();

    if (!title || !message) return alert("Заповніть всі поля");

    forum.push({
        id: Date.now(),
        title,
        messages: [{ id: Date.now(), text: message }]
    });

    saveForum();
    renderForum();

    document.getElementById("topicTitle").value = "";
    document.getElementById("topicMessage").value = "";
}

function addReply(topicId, input) {
    const text = input.value.trim();
    if (!text) return;

    const topic = forum.find(t => t.id === topicId);
    topic.messages.push({ id: Date.now(), text });

    saveForum();
    renderForum();
}

function deleteMessage(topicId, messageId) {
    const topic = forum.find(t => t.id === topicId);
    topic.messages = topic.messages.filter(m => m.id !== messageId);

    if (topic.messages.length === 0) {
        forum = forum.filter(t => t.id !== topicId);
    }

    saveForum();
    renderForum();
}

function editMessage(topicId, messageId) {
    const topic = forum.find(t => t.id === topicId);
    const message = topic.messages.find(m => m.id === messageId);

    const newText = prompt("Редагувати повідомлення:", message.text);
    if (newText !== null) {
        message.text = newText;
        saveForum();
        renderForum();
    }
}

function renderForum() {
    const forumDiv = document.getElementById("forum");
    forumDiv.innerHTML = "";

    forum.forEach(topic => {
        const topicDiv = document.createElement("div");
        topicDiv.className = "topic";

        topicDiv.innerHTML = `<h3>${topic.title}</h3>`;

        topic.messages.forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.className = "message";

            msgDiv.innerHTML = `
                <p>${msg.text}</p>
                <button onclick="editMessage(${topic.id}, ${msg.id})">Редагувати</button>
                <button onclick="deleteMessage(${topic.id}, ${msg.id})">Видалити</button>
            `;

            topicDiv.appendChild(msgDiv);
        });

        const replyBox = document.createElement("div");
        replyBox.className = "reply-box";

        replyBox.innerHTML = `
            <input type="text" placeholder="Ваша відповідь">
            <button>Відповісти</button>
        `;

        const input = replyBox.querySelector("input");
        replyBox.querySelector("button").onclick = () => addReply(topic.id, input);

        topicDiv.appendChild(replyBox);
        forumDiv.appendChild(topicDiv);
    });
}

function saveForum() {
    localStorage.setItem("forumData", JSON.stringify(forum));
}

renderForum();

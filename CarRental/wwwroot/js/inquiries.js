
document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.querySelector(".search-box");
    const messageItems = document.querySelectorAll(".message-list li");

    searchBox.addEventListener("input", function () {
        const query = searchBox.value.toLowerCase().trim();

        messageItems.forEach((item) => {
            const name = item.querySelector("strong").textContent.toLowerCase();

            if (name.includes(query)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});


function loadMessages(id, name, message) {

    document.querySelector('.chat-header').textContent = name;


    let chatBox = document.getElementById('chatMessages');


    chatBox.innerHTML = `<div class="message received"><strong>${name}:</strong> ${message}</div>`;
}

function sendMessage() {
    let message = document.getElementById('messageInput').value;
    if (message.trim() !== "") {
        let chatBox = document.getElementById('chatMessages');
        let msgElement = document.createElement('div');
        msgElement.className = 'message sent';
        msgElement.textContent = message;
        chatBox.appendChild(msgElement);
        document.getElementById('messageInput').value = "";
    }
}



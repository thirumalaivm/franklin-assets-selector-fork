export default function template() {
  return `
    <div class="chat-container">
        <div id="chat-history" class="chat-history"></div>
        <div class="input-container">
            <input type="text" id="message-input" placeholder="Type a message..." autofocus>
            <button id="send-button">Send</button>
        </div>
    </div>
    `;
}

export default function template() {
  return `
    <h3>Spellweaver</h3>
    <h6>(A Franklin Copilot)</h6>
    <div class="content-wrapper">
        <div class="chat-container">
            <div id="chat-history" class="chat-history"></div>
            <div class="input-container">
                <input type="text" id="message-input" placeholder="Type a message..." autofocus>
                <button id="send-button"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
            </div>
        </div>
        <div class="preview-container">
            <div class="preview-stage">
                <div class="placeholder-animation">
                </div>
            </div>
            <button id="copy-button">Copy to Clipboard</button>
        </div>
    </div>
    `;
}

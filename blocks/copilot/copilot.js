export default function decorate(block) {
    block.innerHTML = `
    <h1>Franklin Authoring Copilot</h1>

    <form id="myForm">
      <label for="textInput">Enter Prompt:</label>
      <input type="text" id="textInput" required>

      <label for="apiKeyInput">API Key:</label>
      <input type="text" id="apiKeyInput" required>

      <label for="tokenInput">Token:</label>
      <input type="text" id="tokenInput" required>

      <button type="submit">Submit</button>
    </form>

    <div id="result"></div>
    `;

    document.getElementById('myForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get the input values
        var textInput = document.getElementById('textInput').value;
        var apiKeyInput = document.getElementById('apiKeyInput').value;
        var tokenInput = document.getElementById('tokenInput').value;

        // Make the API call
        fetch('https://api.example.com/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-Key': apiKeyInput,
                'Token': tokenInput
            },
            body: JSON.stringify({ text: textInput })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Display the API response
                document.getElementById('result').innerHTML = 'API response: ' + JSON.stringify(data);
            })
            .catch(function (error) {
                console.log('Error:', error);
            });
    });

}
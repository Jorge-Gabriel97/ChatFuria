const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


function sendMessage() {
    const message = document.getElementById('message-input');
    if (!message.value) {
        message.style.border = '1px solid red';
        return;
    }
    message.style.border = 'none';

    const status = document.getElementById('status');
    const btnSubmit = document.getElementById('btn-submit');

    status.style.display = 'block';
    status.innerHTML = 'Carregando...';
    btnSubmit.disabled = true;
    btnSubmit.style.cursor = 'not-allowed';
    message.disabled = true;

    fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: message.value }
            ],
            max_tokens: 2048,
            temperature: 0.5
        })
    })
    //Busca de dados
    .then((response) => response.json())
    .then((response) => {
        if (response.choices && response.choices.length > 0) {
            const r = response.choices[0].message.content;
            status.style.display = 'none';
            showHistory(message.value, r);
        } else {
            status.innerHTML = 'Erro na resposta da API.';
            console.error('Resposta inesperada:', response);
        }
    })
    //Erro na requisição
    .catch((e) => {
        console.log(`Error -> ${e}`);
        status.innerHTML = 'Erro, tente novamente mais tarde...';
    })
    //Desabilita o botão de enviar e habilita novamente independente do resultado
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.style.cursor = 'pointer';
        message.disabled = false;
        message.value = '';
    });
}
// Envio de mensagem ao pressionar Enter
function showHistory(message, response) {
    const historyBox = document.getElementById('history');

    // Minha mensagem
    const boxMyMessage = document.createElement('div');
    boxMyMessage.className = 'box-my-message';

    const myMessage = document.createElement('p');
    myMessage.className = 'my-message';
    myMessage.innerHTML = message;

    boxMyMessage.appendChild(myMessage);
    historyBox.appendChild(boxMyMessage);

    // Resposta
    const boxResponseMessage = document.createElement('div');
    boxResponseMessage.className = 'box-response-message';

    const chatResponse = document.createElement('p');
    chatResponse.className = 'response-message';
    chatResponse.innerHTML = response;

    boxResponseMessage.appendChild(chatResponse);
    historyBox.appendChild(boxResponseMessage);

    // Scroll para o final
    historyBox.scrollTop = historyBox.scrollHeight;
}

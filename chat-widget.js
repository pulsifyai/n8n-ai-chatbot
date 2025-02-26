// Na função startRecording (linha 560), modifique para especificar o formato correto:

function startRecording() {
    if (isRecording) return;
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Configure o MediaRecorder com opções para MP3
            const options = { mimeType: 'audio/webm' }; // Usamos webm porque MP3 não é suportado diretamente
            mediaRecorder = new MediaRecorder(stream, options);
            audioChunks = [];
            
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });
            
            mediaRecorder.addEventListener("stop", async () => {
                // Cria um blob com os chunks de áudio
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                
                // Converte para MP3 se necessário (requer biblioteca adicional)
                // Nota: Para MP3 real, você precisaria de uma biblioteca como lamejs
                // Por enquanto enviamos como webm que é mais compatível com navegadores
                
                sendAudioMessage(audioBlob);
                
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
                
                micButton.classList.remove('recording');
                isRecording = false;
            });
            
            // Define intervalo para coletar dados a cada 500ms
            mediaRecorder.start(500);
            micButton.classList.add('recording');
            isRecording = true;
        })
        .catch(error => {
            console.error("Error accessing microphone:", error);
            alert("Could not access your microphone. Please check your permissions and try again.");
        });
}

// Modifique a função sendAudioMessage (linha 511) para enviar corretamente para o webhook:

async function sendAudioMessage(audioBlob) {
    // Criar URL para preview do áudio (opcional)
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Criar um elemento de áudio para mostrar que o áudio foi gravado (opcional)
    const audioElement = document.createElement('audio');
    audioElement.src = audioUrl;
    audioElement.controls = true;
    
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.innerHTML = "🎤 <span>Mensagem de áudio enviada</span>";
    userMessageDiv.appendChild(audioElement);
    messagesContainer.appendChild(userMessageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Criar FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm'); // Nome do arquivo com extensão correta
    
    // Adicionar os mesmos dados que seriam enviados em uma mensagem de texto
    const messageData = {
        action: "sendMessage",
        sessionId: currentSessionId,
        route: config.webhook.route,
        metadata: {
            userId: "",
            isAudio: true // Indicador de que é uma mensagem de áudio
        }
    };
    
    // Adicionar os dados como um campo JSON
    formData.append('messageData', JSON.stringify(messageData));
    
    try {
        // Mostrar indicador de carregamento
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message bot';
        loadingDiv.textContent = "Processando sua mensagem de áudio...";
        messagesContainer.appendChild(loadingDiv);
        
        const response = await fetch(config.webhook.url, {
            method: 'POST',
            body: formData
        });
        
        // Remover mensagem de carregamento
        messagesContainer.removeChild(loadingDiv);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error('Error sending audio:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message bot';
        errorDiv.textContent = "Desculpe, não consegui processar sua mensagem de áudio. Por favor, tente novamente ou envie uma mensagem de texto.";
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } finally {
        // Liberar URL criada
        URL.revokeObjectURL(audioUrl);
    }
}

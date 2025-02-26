// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .pulsifyai-chat-widget {
            --chat--color-primary: var(--pulsifyai-chat-primary-color, #854fff);
            --chat--color-secondary: var(--pulsifyai-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--pulsifyai-chat-background-color, #ffffff);
            --chat--color-font: var(--pulsifyai-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .pulsifyai-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .pulsifyai-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .pulsifyai-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .pulsifyai-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .pulsifyai-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .pulsifyai-chat-widget .close-button:hover {
            opacity: 1;
        }

        .pulsifyai-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }

        .pulsifyai-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .pulsifyai-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .pulsifyai-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .pulsifyai-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .pulsifyai-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .pulsifyai-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .pulsifyai-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .pulsifyai-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .pulsifyai-chat-widget .chat-interface.active {
            display: flex;
        }

        .pulsifyai-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .pulsifyai-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .pulsifyai-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .pulsifyai-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .pulsifyai-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .pulsifyai-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .pulsifyai-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .pulsifyai-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .pulsifyai-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .pulsifyai-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .pulsifyai-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .pulsifyai-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .pulsifyai-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .pulsifyai-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .pulsifyai-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .pulsifyai-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        .pulsifyai-chat-widget .audio-button {
            background: none;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .pulsifyai-chat-widget .audio-button:hover {
            background-color: rgba(133, 79, 255, 0.1);
        }

        .pulsifyai-chat-widget .audio-button svg {
            width: 20px;
            height: 20px;
            fill: var(--chat--color-primary);
        }

        .pulsifyai-chat-widget .audio-button.recording svg {
            fill: #ff4545;
        }

        .pulsifyai-chat-widget .audio-message {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: rgba(133, 79, 255, 0.1);
            border-radius: 8px;
            margin: 8px 0;
        }

        .pulsifyai-chat-widget .audio-message span {
            font-size: 14px;
            color: var(--chat--color-font);
        }

        .pulsifyai-chat-widget .audio-message audio {
            max-width: 100%;
            height: 32px;
        }

        .pulsifyai-chat-widget .recording-status {
            display: none;
            font-size: 14px;
            color: #ff4545;
            margin-left: 8px;
            animation: blink 1s infinite;
        }

        .pulsifyai-chat-widget .recording-status.active {
            display: inline;
        }

        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by PulsifyAI',
                link: 'https://www.pulsifyai.com'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.PulsifyAIChatWidgetInitialized) return;
    window.PulsifyAIChatWidgetInitialized = true;

    let currentSessionId = '';
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'pulsifyai-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--pulsifyai-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--pulsifyai-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--pulsifyai-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--pulsifyai-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Send us a message
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <button class="audio-button" title="Record audio message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                </button>
                <span class="recording-status">Recording...</span>
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const audioButton = chatContainer.querySelector('.audio-button');
    const recordingStatus = chatContainer.querySelector('.recording-status');

    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function sendAudioMessage(audioBlob) {
        // Create a FormData object to send the audio file
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.mp3');
        formData.append('sessionId', currentSessionId);
        formData.append('route', config.webhook.route);
        formData.append('action', 'sendAudio');
        formData.append('metadata', JSON.stringify({ userId: "" }));

        // Create an audio element to display in the chat
        const audioURL = URL.createObjectURL(audioBlob);
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = audioURL;

        // Create a message container for the audio
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.appendChild(audioElement);
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error sending audio:', error);
            
            // Show error message in chat
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chat-message bot';
            errorDiv.textContent = 'Sorry, there was an error sending your audio message. Please try again.';
            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function startRecording() {
        if (isRecording) return;
        
        // Check if browser supports MediaRecorder API
        if (!navigator.mediaDevices || !window.MediaRecorder) {
            alert('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Edge.');
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                audioButton.classList.add('recording');
                recordingStatus.classList.add('active');
                isRecording = true;
                
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.addEventListener('dataavailable', event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                });
                
                mediaRecorder.addEventListener('stop', () => {
                    // Stop all tracks from the stream to release microphone
                    stream.getTracks().forEach(track => track.stop());
                    
                    // Create the audio blob with MP3 mime type
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    
                    // Only send if recording has actual content
                    if (audioBlob.size > 100) { // Check if blob has meaningful content
                        sendAudioMessage(audioBlob);
                    } else {
                        console.error('Audio recording was empty or too small');
                    }
                    
                    // Reset recording UI
                    audioButton.classList.remove('recording');
                    recordingStatus.classList.remove('active');
                    isRecording = false;
                });
                
                // Start recording
                mediaRecorder.start();
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                alert('Could not access your microphone. Please check permissions and try again.');
            });
    }

    function stopRecording() {
        if (!isRecording || !mediaRecorder) return;
        
        mediaRecorder.stop();
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    audioButton.addEventListener('click', () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
            
            // Stop recording if active when chat is closed
            if (isRecording) {
                stopRecording();
            }
        });
    });
})();

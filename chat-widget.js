[
  {
    "name": "Chat Trigger",
    "type": "n8n-nodes-base.webhook",
    "position": [100, 300],
    "parameters": {
      "path": "chat",
      "responseMode": "lastNode",
      "options": {
        "rawBody": true,
        "bodyParameterName": "payload"
      }
    }
  },
  {
    "name": "Determinar Tipo de Mensagem",
    "type": "n8n-nodes-base.switch",
    "position": [300, 300],
    "parameters": {
      "conditions": [
        {
          "name": "É Áudio",
          "conditions": [
            {
              "value1": "={{ $request.headers['content-type'] }}",
              "operation": "regex",
              "value2": "multipart/form-data"
            }
          ]
        },
        {
          "name": "É Texto",
          "conditions": [
            {
              "value1": "={{ $request.headers['content-type'] }}",
              "operation": "regex",
              "value2": "application/json"
            }
          ]
        }
      ]
    }
  },
  {
    "name": "Processar Áudio",
    "type": "n8n-nodes-base.httpRequest",
    "position": [500, 200],
    "parameters": {
      "url": "https://api.openai.com/v1/audio/transcriptions",
      "method": "POST",
      "authentication": "headerAuth",
      "headerParameters": {
        "parameters": [
          {
            "name": "Authorization",
            "value": "Bearer {{$node[\"Credenciais\"].json[\"openai_key\"]}}"
          }
        ]
      },
      "options": {
        "formData": true
      },
      "formDataBinaryProperty": "audio",
      "additionalFields": {
        "model": "whisper-1",
        "language": "pt",
        "response_format": "json"
      }
    }
  },
  {
    "name": "Extrair Transcrição",
    "type": "n8n-nodes-base.set",
    "position": [700, 200],
    "parameters": {
      "fields": {
        "values": [
          {
            "name": "transcription",
            "value": "={{ $json.text }}"
          },
          {
            "name": "sessionId",
            "value": "={{ $json.messageData.sessionId }}"
          },
          {
            "name": "route",
            "value": "={{ $json.messageData.route }}"
          }
        ]
      }
    }
  },
  {
    "name": "Processar Texto",
    "type": "n8n-nodes-base.set",
    "position": [500, 400],
    "parameters": {
      "fields": {
        "values": [
          {
            "name": "chatInput",
            "value": "={{ $json.chatInput }}"
          },
          {
            "name": "sessionId",
            "value": "={{ $json.sessionId }}"
          },
          {
            "name": "route",
            "value": "={{ $json.route }}"
          }
        ]
      }
    }
  },
  {
    "name": "Enviar para ChatGPT",
    "type": "n8n-nodes-base.openAi",
    "position": [900, 300],
    "parameters": {
      "authentication": "apiKey",
      "operation": "completion",
      "model": "gpt-4",
      "options": {
        "temperature": 0.7,
        "maxTokens": 500
      },
      "prompt": "={{ $node[\"Formar Prompt\"].json[\"prompt\"] }}"
    }
  },
  {
    "name": "Formar Prompt",
    "type": "n8n-nodes-base.function",
    "position": [700, 300],
    "parameters": {
      "functionCode": "// Determinar se o input vem de texto ou transcrição de áudio\nconst userInput = $input.transcription ? $input.transcription : $input.chatInput;\n\n// Construir o prompt para o ChatGPT\nconst prompt = `Usuário: ${userInput}\\n\\nResponda de forma concisa e útil.`;\n\n// Retornar o prompt formatado\nreturn { prompt };"
    }
  },
  {
    "name": "Formatar Resposta",
    "type": "n8n-nodes-base.set",
    "position": [1100, 300],
    "parameters": {
      "fields": {
        "values": [
          {
            "name": "output",
            "value": "={{ $json.text }}"
          }
        ]
      }
    }
  }
]

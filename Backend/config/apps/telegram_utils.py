import requests

def enviar_mensaje_telegram(chat_id, mensaje):
    token = '7456990493:AAG3CxhiKJ0mcwbAiVch8aeaBUrAFaBfq-Y'
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = {
        'chat_id': chat_id,
        'text': mensaje
    }
    response = requests.post(url, data=data)
    return response.json()

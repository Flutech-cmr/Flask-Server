import json
import telebot


def sendtelegrammessage(message):
    message = json.loads(message)
    message = message['message']
    with open('bot.json') as json_file:
        data = json.load(json_file)
        token = data['API_KEY']
        chat_id = data['Chat_ID']
        bot = telebot.TeleBot(token)
        bot.send_message(chat_id, message)


def sendfileontelegram(file):
    with open('bot.json') as json_file:
        data = json.load(json_file)
        token = data['API_KEY']
        chat_id = data['Chat_ID']
        bot = telebot.TeleBot(token)
        bot.send_document(chat_id, file)


def createcredentials(credentials):
    credentials=json.loads(credentials)
    filename=credentials['file']
    credentials=credentials['credentials']
    with open(filename, 'w+') as outfile:
        json.dump(credentials, outfile)
    return {'success': True}
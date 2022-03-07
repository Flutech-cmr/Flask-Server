import json
import requests
import telebot

# testing sending this file through wget


def readjsonfiles(filename):
    with open(filename) as json_file:
        data = json.load(json_file)
        return data


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
        filetosend = r"static\\files\\recieved\\+"+file
        filebytes = open(filetosend, 'rb')
        bot.send_document(chat_id, filebytes)


def createcredentials(credentials):
    credentials = json.loads(credentials)
    filename = credentials['file']
    credentials = credentials['credentials']
    with open(filename, 'w+') as outfile:
        json.dump(credentials, outfile)
    return {'success': True}


def getchatid(data):
    data = readjsonfiles('telegramapi.json')
    if(data['ok'] == True):
        result = data['result']
        my_chat_member = result[0]['my_chat_member']
        chat = my_chat_member['chat']
        if(chat['title'] == 'FlutechCMR'):
            chat_id = chat['id']
            return chat_id


def telegramdebug():
    data = readjsonfiles('message.json')
    if(data['message'] == True):
        sendtelegrammessage(
            '{"message": "Flask Server was either started or restarted on the cloud"}')


def getfromtelegram():
    prefix = 'https://api.telegram.org/bot'
    APIkey = ''

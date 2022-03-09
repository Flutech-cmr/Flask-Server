import json
import telebot
from modules import get_os_and_version

# testing sending this file through wget


def readjsonfiles(filename):
    with open(filename) as json_file:
        data = json.load(json_file)
        return data


def sendtelegrammessage(message):
    message = json.loads(message)
    message = message['message']
    with open('parameters.json') as json_file:
        data = json.load(json_file)
        token = data['API_KEY']
        chat_id = data['Chat_ID']
        bot = telebot.TeleBot(token)
        bot.send_message(chat_id, message)


def sendfileontelegram(file):
    with open('parameters.json') as json_file:
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
    data = readjsonfiles('parameters.json')
    if(data['ok'] == True):
        result = data['result']
        my_chat_member = result[0]['my_chat_member']
        chat = my_chat_member['chat']
        if(chat['title'] == 'FlutechCMR'):
            chat_id = chat['id']
            return chat_id

# This function has been written with the intention of sending a mesage on the telegram channel everytime the debugger restarts the application


def telegramdebug():
    data = readjsonfiles('parameters.json')
    platformdata = get_os_and_version()
    if(platformdata[0] != 'Windows'):
        if(data['message'] == True):
            sendtelegrammessage(
                '{"message": "Flask Server was either started or restarted on the cloud"}')

# This function has been written to find the chat id from the telegram api since the chat id can change on the basis of wether the group is a normal group or a super group


def getfromtelegram():
    prefix = 'https://api.telegram.org/bot'
    APIkey = ''

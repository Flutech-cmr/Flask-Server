import os
import cv2
import sqlite3
import json
import base64
import random
import sys
import platform
import subprocess


def screensizelogger(data):
    data = data.decode('utf-8')
    data = json.loads(data)
    screen_width = data['screen_width']
    screen_height = data['screen_height']
    with open('screen_sizes.csv', 'a+') as f:
        f.write(f'{screen_width},{screen_height} \n')


def get_base64_from_request(request):
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
    base64_string = data['image']
    convert_base64_to_jpeg(base64_string)


def convert_base64_to_jpeg(base64_string):
    print(base64_string)
    base64_string = base64_string.split(',')[1]
    randomstring = str(random.randint(0, 100000))
    with open(f'{randomstring}.jpeg', 'wb') as f:
        f.write(base64.b64decode(base64_string))


def check_credentials(request):
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
    username = data['username']
    password = data['password']
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=? AND password=?",
              (username, password))
    if c.fetchone():
        return True
    else:
        return False


def performgit(to_terminal):
    to_terminal = to_terminal.decode('utf-8')
    to_terminal = json.loads(to_terminal)
    try:
        to_terminal = to_terminal['to_terminal']
    except:
        return {'response': "Please address the command to the key 'to_terminal'"}
    if(not to_terminal.startswith('git')):
        return {'response': "Only git based commands are supported via this route"}
    else:
        sp = subprocess.Popen(to_terminal, shell=True, stdout=subprocess.PIPE)
        subprocess_return = sp.stdout.read()
        subprocess_return = subprocess_return.decode('utf-8')
        response = {'response': subprocess_return}
        return response


def runonterminal(to_terminal):
    to_terminal = to_terminal.decode('utf-8')
    to_terminal = json.loads(to_terminal)
    try:
        to_terminal = to_terminal['to_terminal']
    except:
        return {'response': "Please address the command to the key 'to_terminal'"}
    sp = subprocess.Popen(to_terminal, shell=True, stdout=subprocess.PIPE)
    subprocess_return = sp.stdout.read()
    subprocess_return = subprocess_return.decode('utf-8')
    response = {'response': subprocess_return}
    return response


def get_os_and_version():
    current_os=platform.system()
    current_os_version=platform.release()
    print(current_os, current_os_version)


if __name__ == "__main__":
    get_os_and_version()

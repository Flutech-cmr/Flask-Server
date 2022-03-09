import cv2
import sqlite3
import json
import base64
import random
import platform
import subprocess
from mongoatlas import *

# This function logs the screensize of the machine thats requesting a specific page on the frontend
def screensizelogger(data):
    data = data.decode('utf-8')
    data = json.loads(data)
    post_to_mongo(data, "Screen SIzes", "FlutechERP")

# This function recieves a base64 image from the frontend and sends it to the conversion function
def get_base64_from_request(request):
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
    base64_string = data['image']
    convert_base64_to_jpeg(base64_string)

# This function converts base64 image to jpeg for storage
def convert_base64_to_jpeg(base64_string):
    print(base64_string)
    base64_string = base64_string.split(',')[1]
    randomstring = str(random.randint(0, 100000))
    with open(f'{randomstring}.jpeg', 'wb') as f:
        f.write(base64.b64decode(base64_string))

# This function checks the credential of the user to allow access to the db
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

# This function has been written with the intention of performing git operation inside the docker container which runs on the server through postman
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

# This function is a ripoff of the previous function but without any filters. It must contain credentials in the long run
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

# This function has been written to return the platform details of the current system. to decide if its running in debug or production mode.
def get_os_and_version():
    current_os=platform.system()
    current_os_version=platform.release()
    return [current_os, current_os_version]

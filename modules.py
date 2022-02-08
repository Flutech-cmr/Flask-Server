import os
import json


def screensizelogger(data):
    data = data.decode('utf-8')
    data = json.loads(data)
    screen_width = data['screen_width']
    screen_height = data['screen_height']
    with open('screen_sizes.csv', 'a+') as f:
        f.write(f'{screen_width},{screen_height}\n')

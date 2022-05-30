import configparser

f=open('config.ini','w+')
config=configparser.ConfigParser()
config.read('config.ini')
config['DEFAULT'] = {"name":"test","age":"18"}

# write file
config.write(f)
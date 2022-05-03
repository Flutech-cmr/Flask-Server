from fileinput import filename
import json
import os

def file_exists():
    filename=os.path.join(os.path.dirname(__file__), 'static/recievedlocation.json')
    if(os.path.isfile(filename)):
        return True
    else:
        # create file
        with open(filename, 'w+') as f:
            f.write('{}')
        return False

def GetLocation(request):
    if(file_exists()):
        print("file exists")
    else:
        print("file created")
    if request.method == 'POST':
        data = request.data
        data = json.loads(data)
        previousdata = None
        with open('static/recievedlocation.json', 'r+') as f:
            previousdata = json.load(f)
            num = str(len(previousdata)+1)
            previousdata[num] = data
            f.seek(0)
            json.dump(previousdata, f, indent=4)
        return str(len(previousdata))
    elif request.method == 'GET':
        with open('static/recievedlocation.json', 'r+') as f:
            previousdata = json.load(f)
            return previousdata

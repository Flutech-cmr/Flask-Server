import json


def GetLocation(request):
    if request.method == 'POST':
        data = request.data
        data = json.loads(data)
        previousdata = None
        with open('static/location.json', 'r+') as f:
            previousdata = json.load(f)
            num = str(len(previousdata)+1)
            previousdata[num] = data
            f.seek(0)
            json.dump(previousdata, f, indent=4)
        return str(len(previousdata))
    elif request.method == 'GET':
        with open('static/location.json', 'r+') as f:
            previousdata = json.load(f)
            return previousdata

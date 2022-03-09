from pymongo import MongoClient
import json

def readjsonfiles(filename):
    with open(filename) as json_file:
        data = json.load(json_file)
        return data

def get_mongopass():
    data = readjsonfiles('parameters.json')
    return data["mongo_atlas"]


def post_to_mongo(data, to_collection, to_db):
    cluster = MongoClient("mongodb+srv://manand881:"+get_mongopass() +
                          "@cluster0.9reop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.insert_one(data)
    print(results)

post_to_mongo({"name": "John", "age": 30}, "Screen SIzes", "FlutechERP")
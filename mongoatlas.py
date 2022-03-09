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


def delete_many_from_mongo(data, to_collection, to_db):
    cluster = MongoClient("mongodb+srv://manand881:"+get_mongopass() +
                          "@cluster0.9reop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.delete_many(data)
    print("{} Records Deleted".format(results.deleted_count))
    return results.deleted_count



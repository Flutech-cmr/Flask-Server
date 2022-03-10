from unittest import result
from pymongo import MongoClient
import json

# (data, "Screen SIzes", "FlutechERP") for screensizes


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
    return results.inserted_id


def delete_many_from_mongo(data, to_collection, to_db):
    cluster = MongoClient("mongodb+srv://manand881:"+get_mongopass() +
                          "@cluster0.9reop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.delete_many(data)
    print("{} Records Deleted".format(results.deleted_count))
    return results.deleted_count


def find_in_mongo(data, to_collection, to_db):
    cluster = MongoClient("mongodb+srv://manand881:"+get_mongopass() +
                          "@cluster0.9reop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.find(data)
    return results

def update_in_mongo(data, to_collection, to_db):
    cluster = MongoClient("mongodb+srv://manand881:"+get_mongopass() +
                          "@cluster0.9reop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.update_one(data)
    return results
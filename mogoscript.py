import pymongo
from pymongo import MongoClient
from bot import *
import random
import string

def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


def get_mongopass():
    data = readjsonfiles('passwords.json')
    return data["mongo_atlas"]


cluster = MongoClient("mongodb+srv://manand881:"+get_mongopass() +
                      "@cluster0.9reop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = cluster["cluster0"]
collection = db["anand"]
results=collection.insert_one({"name":generate_random_string(10)})
respo=collection.find_one({"name":"anand_mahesh"})
for x in respo:
    print(x["name"])
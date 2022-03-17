from pymongo import MongoClient
from bson import ObjectId
import json


# (data, "Screen SIzes", "FlutechERP") for screensizes


def readjsonfiles(filename):
    with open(filename) as json_file:
        data = json.load(json_file)
        return data


def get_mongopass():
    data = readjsonfiles('parameters.json')
    return data["mongo_atlas"]


def return_cluster():
    return MongoClient("mongodb+srv://manand881:"+get_mongopass() +
                       "@cluster0.9reop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")


def post_to_mongo(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.insert_one(data)
    return results.inserted_id


def delete_many_from_mongo(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.delete_many(data)
    print("{} Records Deleted".format(results.deleted_count))
    return results.deleted_count


def find_in_mongo(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.find(data)
    return results


def update_in_mongo(data, to_collection, to_db, append_data, Flag):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = None
    if(Flag):
        results = collection.update_one(
            data, {'$set': append_data}, upsert=True)
    else:
        results = collection.update_one(data, {'$set': append_data})
    return results


def add_employee(data):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db["EmployeeDetails"]
    results = collection.insert_one(data)
    return results.inserted_id

# This function is used to fetch distinct values from the database


def get_distict_values(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.distinct(data)
    return results

# This function is used to validate the user credentials upon entry to the application


def validate_user(data):
    print("[INFO] Requesting User Validation")
    data = data.decode('utf-8')
    data = json.loads(data)
    empid = data["username"]
    password = data["password"]
    login_requesting_page = data["currentpage"]
    login_requesting_page = login_requesting_page.split("/")[-1]
    login_requesting_page = login_requesting_page.replace("?", "")
    data_to_find = {"Employee ID": empid, "Password": password}
    results_of_find = find_in_mongo(
        data_to_find, "EmployeeDetails", "FlutechERP")
    print("[INFO] Results Count {}".format(results_of_find.count()))
    if(results_of_find.count() == 0):
        print("[INFO] Invalid Creditentials")
        return {"message": "received", "status": "failed"}
    for x in results_of_find:
        access_level = x["App Privileges"]
        if(login_requesting_page == "login" and access_level >= 0):
            print("[INFO] User Validated for login page")
            return {"message": "received", "status": "success", "redirect": "choose-function", "access_level": access_level}
        elif(login_requesting_page == "master"):
            if (access_level == 1):
                print("[INFO] User Validated for master page")
                return {"message": "received", "status": "success", "redirect": "masterpanel", "access_level": access_level}
            else:
                print("[INFO] User not authorized for master page")
                return {"message": "received", "status": "notauthorized"}
        else:
            print("[INFO] Something is broken")
            return {"message": "received", "status": "failed"}


def load_projects():
    print("retriving all projects")
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db["ProjectDetails"]
    results = collection.find({})
    all_projects={}
    iter=0
    for x in results:
        # use bson to conver objectid to string
        x["_id"] = str(x["_id"])
        all_projects[iter]=x
        iter+=1
    print(all_projects)
    return all_projects
    
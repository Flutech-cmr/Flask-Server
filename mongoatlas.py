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


def get_distict_values(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.distinct(data)
    return results


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
            return {"message": "received", "status": "success", "redirect": "choose-function"}
        elif(login_requesting_page == "master"):
            if (access_level == 1):
                print("[INFO] User Validated for master page")
                return {"message": "received", "status": "success", "redirect": "masterpanel"}
            else:
                print("[INFO] User not authorized for master page")
                return {"message": "received", "status": "notauthorized"}
        else:
            print("[INFO] Something is broken")
            return {"message": "received", "status": "failed"}

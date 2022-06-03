import os
import sys
from datetime import datetime, timedelta
import threading
from sqlalchemy import null
from workbookgen import *

print("[INFO] Loading Mongo Atlas Modules")
try:
    import json
    from bson import ObjectId
    from pymongo import MongoClient
except ImportError:
    print("\n[INFO] One or more modules are missing.\n")
    os.system("pip3 install -r requirements.txt")


# (data, "Screen SIzes", "FlutechERP") for screensizes


def readjsonfiles(filename):
    with open(filename) as json_file:
        data = json.load(json_file)
        return data


def get_mongopass():
    try:
        data = readjsonfiles('parameters.json')
    except:
        print("[ERROR] Unable to read parameters.json. File not found.")
        sys.exit()
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


def delete_one_from_mongo(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.delete_one(data)
    print("{} Records Deleted".format(results.deleted_count))
    return results.deleted_count


def find_in_mongo(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.find(data)
    print("[INFO] Results Count {}".format(results.count()))
    return results


def find_one_in_mongo(data, to_collection, to_db):
    cluster = return_cluster()
    db = cluster[to_db]
    collection = db[to_collection]
    results = collection.find_one(data)
    return results

# keep flag as true to insert new data field


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
    data["App Privileges"] = int(data["App Privileges"])
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


def update_last_login(data):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db["EmployeeDetails"]
    now = datetime.utcnow()
    now = now+timedelta(hours=5, minutes=30)
    current_time = now.strftime("%H:%M:%S")
    today = now.strftime("%d-%m-%Y")
    update_time = current_time+" "+today
    results = collection.update_one(
        data, {"$set": {"Last Login": update_time}})


def validate_user(data):
    print("[INFO] Requesting User Validation")
    data = data.decode('utf-8')
    data = json.loads(data)
    print(data)
    if(data["status"] == "PreviousLogin"):
        return previous_login_exists(data)
    else:
        del data["status"]
        print(data)
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
            if(type(access_level) != int):
                return {"message": "received", "status": "failed", "error": "Invalid Access Level in database"}
            if(login_requesting_page == "login" and access_level >= 0):
                print("[INFO] User Validated for login page")
                t1 = threading.Thread(
                    target=update_last_login, args=(data_to_find,))
                t1.start()
                return {"message": "received", "status": "success", "redirect": "choose-function", "access_level": access_level}
            elif(login_requesting_page == "master"):
                if (access_level == 1):
                    print("[INFO] User Validated for master page")
                    t1 = threading.Thread(
                        target=update_last_login, args=(data_to_find,))
                    t1.start()
                    return {"message": "received", "status": "success", "redirect": "masterpanel", "access_level": access_level}
                else:
                    print("[INFO] User not authorized for master page")
                    return {"message": "received", "status": "notauthorized"}
            else:
                print("[INFO] Something is broken")
                return {"message": "received", "status": "failed"}


def previous_login_exists(data):
    print("[INFO] Checking for previous login")
    current_page = data["currentpage"]
    del data["status"]
    results_of_find = find_in_mongo(
        {"Employee ID": data["username"], "App Privileges": int(data["access_level"])}, "EmployeeDetails", "FlutechERP")
    if(results_of_find.count() == 0):
        print("[INFO] Invalid Creditentials")
        return {"message": "received", "status": "failed"}
    for x in results_of_find:
        access_level = x["App Privileges"]
        if(access_level >= 0):
            print("[INFO] User Validated for login page")
            return {"message": "received", "status": "success", "redirect": "choose-function", "access_level": access_level}
        else:
            print("[INFO] User not authorized for login page")
            return {"message": "received", "status": "notauthorized"}


def load_projects():
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db["ProjectDetails"]
    results = collection.find({})
    all_projects = {}
    iter = 0
    for x in results:
        # use bson to conver objectid to string
        x["_id"] = str(x["_id"])
        all_projects[iter] = x
        iter += 1
    return all_projects


def find_number_of_documents_in_collection(collection_name):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db[collection_name]
    results = collection.find({})
    length = str(results.count())
    return length


def add_project_site(data):
    data = data.decode('utf-8')
    data = json.loads(data)
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db["ProjectDetails"]
    results = collection.insert_one(data)
    print(type(results.inserted_id))
    # return results.inserted_id
    return {"message": "received", "status": "success"}


def add_workers_to_db(data, projectname):
    data = data.decode('utf-8')
    data = json.loads(data)
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collectioname = projectname+"WorkerDetails"
    collection = db[collectioname]
    results = collection.insert_one(data)
    return str(results.inserted_id)


def get_workers_from_db(data, projectname):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collectioname = projectname+"WorkerDetails"
    collection = db[collectioname]
    results = collection.find({})
    all_workers = {}
    iter = 0
    for x in results:
        # use bson to conver objectid to string
        x["_id"] = str(x["_id"])
        all_workers[iter] = x
        iter += 1
    return all_workers


def worker_attendance(data, projectname):
    data = data.decode('utf-8')
    data = json.loads(data)
    now = datetime.utcnow()
    now = now+timedelta(hours=5, minutes=30)
    current_time = now.strftime("%H:%M:%S")
    today = now.strftime("%d-%m-%Y")
    if(data["function"] != "marknew"):
        return get_worker_attendance(data, today, projectname)
    else:
        returnpayload = {"time": current_time,
                         "status": "success", "type": data["type"]}
        del data["function"]
        data["time"] = current_time
        data["date"] = today
        returnid = post_to_mongo(
            data, projectname+"WorkerAttendance", "FlutechERP")
        returnpayload["returnid"] = str(returnid)
        return returnpayload


def get_worker_attendance(data, today, projectname):
    del data["function"]
    data["date"] = today
    results = find_in_mongo(data, projectname+"WorkerAttendance", "FlutechERP")
    for x in results:
        del x["_id"]
        print(x, "fetch")
        return {"time": x["time"], "status": "success", "type": data["type"]}
    return{"status": "failed"}


def get_all_attendance(projectname):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collectioname = projectname+"WorkerAttendance"
    collection = db[collectioname]
    results = collection.find({})
    all_workers = {}
    iter = 0
    for x in results:
        # use bson to conver objectid to string
        x["_id"] = str(x["_id"])
        all_workers[iter] = x
        iter += 1
    return all_workers


def get_entire_collection(colectionname):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db[colectionname]
    results = collection.find({})
    return results


def get_entire_collection_for_js(colectionname):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db[colectionname]
    results = collection.find({})
    all_results = {}
    iter = 0
    for x in results:
        x["_id"] = str(x["_id"])
        all_results[iter] = x
        iter += 1
    print("[INFO] Returning all results for js")
    return all_results


def check_if_collection_exists(collectionname):
    cluster = return_cluster()
    db = cluster["FlutechERP"]
    collection = db[collectionname]
    results = collection.find({})
    if(results.count() == 0):
        return False
    else:
        return True


def dashboard_stat(StatType, request):
    if(request.method == "GET"):
        if(StatType == "numberofemployees"):
            return find_number_of_documents_in_collection("EmployeeDetails")
        elif(StatType == "numberofprojects"):
            return find_number_of_documents_in_collection("ProjectDetails")
        elif(StatType == "numberofvisits"):
            return find_number_of_documents_in_collection("Screen Sizes")


def download_attendance(projectname):
    collection_exists = check_if_collection_exists(
        projectname+"WorkerAttendance")
    if(collection_exists):
        workbook_generated = get_raw_data_for_workbook(
            get_all_attendance(projectname), projectname)
        if(workbook_generated):
            return{"status": "success", "message": "collection exists workbook generated", "DownloadURL": "/static/generated/"+projectname+"WorkerAttendance.xlsx"}
        else:
            return{"status": "failed", "message": "collection exists but could not generate workbook"}
    else:
        return{"status": "failed", "message": "collection does not exist"}


def apihandler(request, apitype, apiname):
    data = None
    if(request.method == "POST"):
        data = request.data
        data = data.decode('utf-8')
        data = json.loads(data)
    elif(request.method == "GET"):
        pass
    id = None
    if(apitype == "dashboard"):
        if(apiname == "addemployee"):
            id = add_employee(data)
        elif(apiname == "deleteemployee"):
            objid = ObjectId(data["_id"])
            id = delete_one_from_mongo(
                {"_id": objid}, "EmployeeDetails", "FlutechERP")
        elif(apiname == "getprojects"):
            return load_projects()
        elif(apiname.startswith("deleteworker")):
            objid = ObjectId(data["_id"])
            apiname = apiname.replace("deleteworker_", "")
            id = delete_one_from_mongo(
                {"_id": objid}, apiname+"WorkerDetails", "FlutechERP")
            print(data["_id"])
        elif(apiname.startswith("attendancemarkedtoday")):
            apiname = apiname.replace("attendancemarkedtoday-", "")
            now = datetime.utcnow()
            now = now+timedelta(hours=5, minutes=30)
            today = now.strftime("%d-%m-%Y")
            data = {"date": today}
            if find_one_in_mongo(data, apiname+"WorkerAttendance", "FlutechERP") is not None:
                return{"status": "success", "message": "attendance marked"}
            else:
                return{"status": "failed", "message": "attendance not marked"}
        elif(apiname == "getemployeepdf"):
            workbook = employeeworkbook()
            status = workbook.get_all_employees(
                get_entire_collection_for_js("EmployeeDetails"))
            return status
        elif(apiname.startswith("exportworkerlist_")):
            apiname = apiname.replace("exportworkerlist_", "")
            

    return {"id": str(id)}


if __name__ == "__main__":
    pass

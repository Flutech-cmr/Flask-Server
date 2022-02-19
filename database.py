import sqlite3
import os


def does_database_exist(database_name):
    if(os.path.isfile(database_name)):
        return True
    else:
        return sqlite3.connect(database_name)


def create_database_for_employees(database_name):
    conn = sqlite3.connect(database_name)
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS EMPLOYEES (Name TEXT, Company_ID TEXT, SITE_ID TEXT, Date_Of_Birth TEXT, Blood_Group TEXT, Gender TEXT, Mobile_Number TEXT, Alternate_Mobile_Number TEXT, Emergency_Contact TEXT, Emergency_Contact_2 TEXT, Father_Name TEXT, Mother_Name TEXT, Aadhar_No INTEGER, PAN_NO INTEGER, PAN_Photo TEXT, CURRENT_ADDRESS TEXT, Permanent_Address TEXT)')


def insert_into_database_employees(database_name, data):
    conn = sqlite3.connect(database_name)
    c = conn.cursor()
    c.execute(
        'INSERT INTO EMPLOYEES VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data)
    conn.commit()
    conn.close()


def create_userid_table(database_name):
    conn = sqlite3.connect(database_name)
    c = conn.cursor()
    c.execute(
        'CREATE TABLE IF NOT EXISTS USERID (EMPID TEXT PRIMARY KEY, EMAIL TEXT, PASSWORD TEXT)')
    conn.commit()
    conn.close()


def insert_into_userid_table(database_name, data):
    conn = sqlite3.connect(database_name)
    c = conn.cursor()
    c.execute('INSERT INTO USERID VALUES(?,?,?)', data)
    conn.commit()
    conn.close()

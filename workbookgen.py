from datetime import datetime
from openpyxl import Workbook
import os


def makeworkbook(projectname):
    if(os.path.exists(projectname+"WorkerAttendance.xlsx")):
        os.remove(projectname+"WorkerAttendance.xlsx")
    wb = Workbook()
    ws = wb.active
    ws.title = projectname+"Worker Attendance"
    return wb


def find_in_jsondata(jsondata, name, date, type):
    for key, value in jsondata.items():
        if(value["date"] == date and value["Workername"] == name and type.lower() in value["type"].lower()):
            return value["time"]
    return "Not Found"


def movefile(filename):
    try:
        os.rename(filename, "static/generated/"+filename)
        return True
    except Exception as e:
        print(e)


def add_data_to_workbook(data, wb, projectname, jsondata):
    try:
        alldates = data[0]
        workernames = data[1]
        ws = wb.active
        row = 1
        col = 2
        ws.column_dimensions['A'].width = 30
        # marking dates
        ws['A1'] = "Dates"
        for dates in alldates:
            ws.cell(row=row, column=col).value = dates
            ws.merge_cells(start_row=row, start_column=col,
                           end_row=row, end_column=col+1)
            col += 2
        row += 1
        col = 2
        # marking days
        ws['A2'] = "Days"
        for dates in alldates:
            datetimeobj = datetime.strptime(dates, '%d-%m-%Y')
            day = datetimeobj.strftime('%A')
            ws.cell(row=row, column=col).value = day
            ws.merge_cells(start_row=row, start_column=col,
                           end_row=row, end_column=col+1)
            col += 2
        row += 1
        col = 2
        # marking type
        ws['A3'] = "Type"
        for dates in alldates:
            ws.cell(row=row, column=col).value = "In"
            ws.cell(row=row, column=col+1).value = "Out"
            col += 2
        # marking names
        ws['A4'] = "Names"
        row += 2
        for workers in workernames:
            ws.cell(row=row, column=1).value = workers
            row += 1

        row = 5
        col = 2
        ws.cell(row=row, column=col).value = "test"
        for rownum in range(row, len(workernames)+row):
            name = ws.cell(row=rownum, column=1).value
            for colnum in range(col, (len(alldates)*2)+col):
                typeoftime = ws.cell(row=3, column=colnum).value
                date = ws.cell(row=1, column=colnum).value
                if(date == None):
                    date = ws.cell(row=1, column=colnum-1).value

                # print(name, date, typeoftime, rownum, colnum)
                to_write = find_in_jsondata(jsondata, name, date, typeoftime)
                ws.cell(row=rownum, column=colnum).value = to_write

            col = 2
        filename = projectname+"WorkerAttendance.xlsx"
        wb.save(filename)

        return True

    except Exception as e:
        return False


def get_raw_data_for_workbook(data, projectname):
    alldates = list()
    workernames = list()
    for key, value in data.items():
        date = value["date"]
        workername = value["Workername"]
        if(date not in alldates):
            alldates.append(date)
        if(workername not in workernames):
            workernames.append(workername)

    alldates.sort()
    workernames.sort()
    if(add_data_to_workbook([alldates, workernames],
                            makeworkbook(projectname), projectname, data)):
        return True
    else:
        return False

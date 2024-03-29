import os
try:
    from werkzeug.utils import secure_filename
    from flask import *
    from modules import *
    from bot import *
    from mongoatlas import *
    from location import *
    from flask_cors import CORS, cross_origin
except ImportError as e:
    print("\n[INFO] One or more modules are missing.\n")
    print("Thw following error occured \n", e)
    try:
        os.system("pip install -r requirements.txt")
        os.system("pip3 install -r requirements.txt")
    except:
        pass
app = Flask(__name__, static_url_path='/static')
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# ----------------------------------------------------------------------------------------------------------------------
# HTML Page Routes are defined Below
# ----------------------------------------------------------------------------------------------------------------------
# This route is for the index page


@app.route('/')
def home():
    Get_version = App_version()
    return render_template('index.html', version=Get_version)
# This route is for the Login Page


@app.route('/login')
def login():
    return render_template('login.html')
# This route is for the Login Page


@app.route('/about')
def about():
    return render_template('about.html')
# This route is for the Login Page


@app.route('/checklogin', methods=['GET', 'POST'])
@cross_origin()
def checklogin():
    if request.method == 'POST':
        return validate_user(request.data)
# This route is for the ERP Function Page


@app.route('/choose-function')
def choose_function():
    return render_template('choose.html')
# This route opens the ERP project Tracker


@app.route('/project-tracker')
def project_tracker():
    return render_template('project-tracker.html')
# This route helps add projects


@app.route('/add-project')
def add_project():
    return render_template('add-project.html')
# This route opens the faceattandance page to capture the image


@app.route('/face-attendance')
def faceattandance():
    return render_template('face-attendance.html')
# This route opens the faceattandance page to capture the image


@app.route('/addemployee')
def addemployee():
    return render_template('addemployee.html')

# This route opens the ERP project Tracker


@app.route('/master')
def master():
    return render_template('master.html')


@app.route('/dashboard')
def dashboard():
    return render_template('Dashboard/index.html')


@app.route('/dashboard/<page>')
def dashboardemployees(page):
    if(page == 'employees'):
        return render_template('Dashboard/employeedetails.html')
    elif(page == 'workers'):
        return render_template('Dashboard/workerdetails.html')


@app.route('/masterpanel')
def masterpanel():
    return render_template('masterpanel.html')


@app.route('/DownloadAttendance/<projectname>')
@cross_origin()
def downloadAttendance(projectname):
    return download_attendance(projectname)


@app.route('/workeronboarding/<projectname>')
def onboardworker(projectname):
    return render_template('workeronboarding.html')


@app.route('/alreadyonboardedworkers/<projectname>')
def alreadyonboardedworkers(projectname):
    return render_template('alreadyonboardedworkers.html')


@app.route('/takeattendance/<projectname>')
def takeattendance(projectname):
    return render_template('takeattendance.html')
# This route opens the Feedback page


@app.route('/feedback')
def feedback():
    return render_template('feedback.html')
# This route opens the ComingSoon Page


@app.route('/comingsoon')
def comingsoon():
    return render_template('comingsoon.html')
# This route serves the favicon


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/robots.txt')
def robots():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'robots.txt', mimetype='text/plain')


# ----------------------------------------------------------------------------------------------------------------------
# Redirects are defined below
# ----------------------------------------------------------------------------------------------------------------------
# This route redirects to the home page of the webapp


@app.route('/index')
@app.route('/home')
def home_index():
    return redirect("/", code=302)
# ----------------------------------------------------------------------------------------------------------------------
# API Routes are defined below
# ----------------------------------------------------------------------------------------------------------------------
# This route recieves the face data captured by the webcam and sends it to the backend


@app.route('/recieve-face', methods=['POST', 'GET'])
@cross_origin()
def recieve_face():
    get_base64_from_request(request)
    return {'success': True}
# This route recieves the face data captured by the webcam and sends it to the backend


@app.route('/botmessage', methods=['POST'])
def botmessage():
    sendtelegrammessage(request.data)
    return {'success': True}
# This route recieves the screen size data from the client and stores it in a csv file


@app.route('/screen-sizes', methods=['POST', 'GET'])
def screen_sizes():
    atlas_id = screensizelogger(request.data)
    return {'Success': True, 'atlas_id': str(atlas_id)}


@app.route('/recieveworkerdata/<projectname>', methods=['POST', 'GET'])
@cross_origin()
def recieveworkerdata(projectname):
    return add_workers_to_db(request.data, projectname)


@app.route('/workerattendance/<projectname>', methods=['POST', 'GET'])
@cross_origin()
def workerattendance(projectname):
    return worker_attendance(request.data, projectname)


@app.route('/getallworkers/<projectname>', methods=['POST', 'GET'])
@cross_origin()
def getallworkers(projectname):
    print(projectname, "projectname")
    return get_workers_from_db(request.data, projectname)


@app.route('/up', methods=['GET'])
def up():
    return {'success': True}


@app.route('/git', methods=['GET', 'POST'])
def pull():
    response = performgit(request.data)
    return response


@app.route('/getcollection/<collection>', methods=['GET', 'POST'])
def getcollection(collection):
    response = get_entire_collection_for_js(collection)
    return response


@app.route('/dashboardStats/<StatType>', methods=['GET', 'POST'])
@cross_origin()
def dashboardstat(StatType):
    response = dashboard_stat(StatType, request)
    return response


@app.route('/addsite', methods=['GET', 'POST'])
@cross_origin()
def addsite():
    response = add_project_site(request.data)
    return response


@app.route('/loadprojects', methods=['GET'])
@cross_origin()
def loadprojects():
    response = load_projects()
    return response


@app.route('/api/<apitype>/<apiname>', methods=['GET', 'POST'])
def api(apitype, apiname):
    return apihandler(request, apitype, apiname)


@app.route('/gitpull')
def gitpull():
    sp = subprocess.Popen("git pull", shell=True, stdout=subprocess.PIPE)
    subprocess_return = sp.stdout.read()
    subprocess_return = subprocess_return.decode('utf-8')
    return subprocess_return


@app.route('/explore')
def explore():
    return render_template('explore.html')


@app.route('/runonterminal', methods=['GET', 'POST'])
def runonterminalroute():
    response = runonterminal(request.data)
    return response


@app.route('/uploadcredentials', methods=['GET', 'POST'])
def uploadcredentials():
    response = createcredentials(request.data)
    return response


@app.route('/notallowed')
def not_allowed():
    return render_template('notallowed.html')

@app.route('/progresstracker')
def progresstracker():
    return render_template('ProgressTracker/index.html')


@app.route('/WebviewLocationIntercept')
@cross_origin()
def Intercept():
    return render_template('intercept.html')


@app.route('/WebviewLocationAPI', methods=['GET', 'POST'])
@cross_origin()
def API():
    return GetLocation(request)


@app.route('/uploader', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        f.save(r"static\\files\\recieved\\"+secure_filename(f.filename))
        # sendfileontelegram(f.filename)
        sendtelegrammessage(
            str({"message": f.filename+" uploaded successfully"}))
        return 'file uploaded successfully'
# ----------------------------------------------------------------------------------------------------------------------
# Error Handlers are defined below
# ----------------------------------------------------------------------------------------------------------------------
# This is a 404 error handler


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html")


@app.errorhandler(500)
def internal_server_error(e):
    message = {"message": str(e)}
    sendtelegrammessage(message)


if __name__ == '__main__':
    portnumber=5050
    telegramdebug(portnumber)
    print("[INFO] This script is being loaded on Python Version {}".format(sys.version))
    app.run(host='0.0.0.0', debug=True, port=portnumber)

import os
try:
    from werkzeug.utils import secure_filename
    from flask import *
    from modules import *
    from bot import *
    from mongoatlas import *
    from flask_cors import CORS, cross_origin
except ImportError:
    print("\n[INFO] One or more modules are missing.\n")
    os.system("pip install -r requirements.txt")


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


@app.route('/employee-details')
def employee_details():
    return render_template('employeedetails.html')

# This route opens the ERP project Tracker


@app.route('/master')
def master():
    return render_template('master.html')


@app.route('/masterpanel')
def masterpanel():
    return render_template('masterpanel.html')


@app.route('/workeronboarding')
def onboardworker():
    return render_template('workeronboarding.html')


@app.route('/alreadyonboardedworkers')
def alreadyonboardedworkers():
    return render_template('alreadyonboardedworkers.html')

@app.route('/takeattendance')
def takeattendance():
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

# This route is to be used by the cron job to keep checking if the flask server is running


@app.route('/status')
def status():
    return{'System Status': 'OK'}


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
    print("recieved")
    return {'success': True}

# This route recieves the face data captured by the webcam and sends it to the backend


@app.route('/botmessage', methods=['POST'])
def botmessage():
    print(request.data)
    sendtelegrammessage(request.data)
    return {'success': True}

# This route recieves the screen size data from the client and stores it in a csv file


@app.route('/screen-sizes', methods=['POST', 'GET'])
def screen_sizes():
    atlas_id = screensizelogger(request.data)
    print(atlas_id, "atlas_id")
    return {'Success': True, 'atlas_id': str(atlas_id)}


@app.route('/recieveworkerdata', methods=['POST', 'GET'])
@cross_origin()
def recieveworkerdata():
    return add_workers_to_db(request.data)

@app.route('/workerattendance', methods=['POST', 'GET'])
@cross_origin()
def workerattendance():
    return worker_attendance(request.data)

@app.route('/getallemployees', methods=['POST', 'GET'])
@cross_origin()
def getallemployees():
    return get_workers_from_db(request.data)


@app.route('/up', methods=['GET'])
def up():
    return {'success': True}


@app.route('/git', methods=['GET', 'POST'])
def pull():
    response = performgit(request.data)
    return response


@app.route('/addsite', methods=['GET', 'POST'])
@cross_origin()
def addsite():
    print("request to add site")
    response = add_project_site(request.data)
    return response


@app.route('/loadprojects', methods=['GET'])
@cross_origin()
def loadprojects():
    print("here")
    response = load_projects()
    return response


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


if __name__ == '__main__':
    telegramdebug()
    print("[INFO] This script is being loaded on Python Version {}".format(sys.version))
    app.run(host='0.0.0.0', debug=True, port=5050)

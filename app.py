import os
from flask import *
from modules import *
from bot import *
import sys

app = Flask(__name__, static_url_path='/static')

# ----------------------------------------------------------------------------------------------------------------------
# HTML Page Routes are defined Below
# ----------------------------------------------------------------------------------------------------------------------

# This route is for the index page


@app.route('/')
def home():
    return render_template('index.html')

# This route is for the Login Page


@app.route('/login', methods=['GET', 'POST'])
def login():
    print(request.data)
    return render_template('login.html')

# This route is for the Login Page


@app.route('/checklogin', methods=['GET', 'POST'])
def checklogin():
    print(request.data)
    return render_template('login.html')

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

# This route server the navbar


@app.route('/navbar')
def add_nav():
    return render_template('navbar.html')

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


@app.route('/Topmenu')
def Topmenu():
    return render_template('Topmenu.html')


@app.route('/trial')
def trial():
    return render_template('trial.html')


# ----------------------------------------------------------------------------------------------------------------------
# Redirects are defined below
# ----------------------------------------------------------------------------------------------------------------------

# This route redirects to the home page of the webapp
@app.route('/index')
@app.route('/home')
def home_index():
    return redirect(url_for('/'))

# ----------------------------------------------------------------------------------------------------------------------
# API Routes are defined below
# ----------------------------------------------------------------------------------------------------------------------

# This route recieves the face data captured by the webcam and sends it to the backend


@app.route('/recieve-face', methods=['POST'])
def recieve_face():
    get_base64_from_request(request)
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
    screensizelogger(request.data)
    return {'success': True}


@app.route('/up', methods=['GET'])
def up():
    return {'success': True}


@app.route('/git', methods=['GET', 'POST'])
def pull():
    response = performgit(request.data)
    return response


# ----------------------------------------------------------------------------------------------------------------------
# Error Handlers are defined below
# ----------------------------------------------------------------------------------------------------------------------

# This is a 404 error handler


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5050)

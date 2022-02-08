import os
from flask import *
from modules import *
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__, static_url_path='/static')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/choose-function')
def choose_function():
    return render_template('choose.html')


@app.route('/project-tracker')
def project_tracker():
    return render_template('project-tracker.html')


@app.route('/add-project')
def add_project():
    return render_template('add-project.html')


@app.route('/navbar')
def add_nav():
    return render_template('navbar.html')


@app.route('/screen-sizes', methods=['POST', 'GET'])
def screen_sizes():
    screensizelogger(request.data)
    return {'success': True}


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html")


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/index')
@app.route('/home')
def home_index():
    return redirect(url_for('/'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)

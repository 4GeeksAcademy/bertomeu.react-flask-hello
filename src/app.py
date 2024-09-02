"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands


from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import timedelta

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

#Setup de JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY")  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)

#Setuo Bcrypt
bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route("/register", methods=["POST"])
def register():
    body = request.get_json(silent=True)
    if not body or 'email' not in body or 'password' not in body:
        return jsonify({'msg': 'Email and password fields are required'}), 400
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user = User()    
    new_user.email = body['email']
    new_user.password = pw_hash
    new_user.is_active = True
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'New user created'}), 201


@app.route("/login", methods=["POST"])
def login():
    body = request.get_json(silent=True)
    if not body or 'email' not in body or 'password' not in body:
        return jsonify({'msg': 'Email and password fields are required'}), 400
    user = User.query.filter_by(email=body['email']).first()
    if not user or bcrypt.check_password_hash(user.password, body['password']) is False:
        return jsonify({'msg': 'Invalid email or password'}), 400
    access_token = create_access_token(identity=user.email)
    return jsonify({'msg': 'Ok',
                    'jwt_token': access_token,
                    'user_data': {
                        'id': user.id,
                        'email': user.email,
                        'is_active': user.is_active
                    }
                    }), 200

@app.route("/private", methods=["GET"])
@jwt_required()
def get_private_info():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    return jsonify({'msg': 'ok', 
                    'user_data': {                                
                                'email': user.email,
                                'is_active': user.is_active
    }}), 200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

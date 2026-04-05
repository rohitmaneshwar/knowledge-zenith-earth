import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
# load_dotenv ki zaroorat Render par nahi padti, par local ke liye rehne dete hain
from dotenv import load_dotenv

# ==========================================
# SECTION 1: APP SETUP & SECURITY
# ==========================================

load_dotenv()
app = Flask(__name__)

# CORS: Frontend (Vercel) ko connect karne ke liye
CORS(app)

# Render ke liye dynamic settings
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-123')
# SQLite database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==========================================
# SECTION 2: DATABASE MODELS (TABLES)
# ==========================================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    program = db.Column(db.String(100), nullable=False)
    transaction_id = db.Column(db.String(100), nullable=True)
    date = db.Column(db.String(100))

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    program = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    message = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(100))

# ==========================================
# SECTION 3: ADMIN SECURITY (LOGIN)
# ==========================================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    # Render ke Environment Variables se password uthayega
    # Agar local pe ho toh default 'admin123' kaam karega
    real_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    # Frontend se 'password' key mein data aana chahiye
    if data.get('password') == real_password:
        return jsonify({"message": "Access Granted"}), 200
    else:
        return jsonify({"message": "Access Denied"}), 401

# ==========================================
# SECTION 4: REGISTRATION & REVIEWS APIs
# ==========================================
# (Aapka baaki code ekdum perfect hai, use waise hi rakhein)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        new_user = User(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            program=data['program'],
            transaction_id=data.get('transaction_id', ''),
            date=datetime.now().strftime("%d-%m-%Y %H:%M")
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration Info Saved Successfully!"}), 201
    except Exception as e:
        return jsonify({"message": "Server Error"}), 500

@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.query.order_by(User.id.desc()).all()
    output = [{"id": u.id, "name": u.name, "email": u.email, "phone": u.phone, 
               "program": u.program, "transaction_id": u.transaction_id, "date": u.date} for u in users]
    return jsonify(output)

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.json
    new_review = Review(
        name=data['name'], program=data['program'],
        rating=data['rating'], message=data['message'],
        date=datetime.now().strftime("%d-%m-%Y")
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify({"message": "Review posted successfully!"}), 201

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.order_by(Review.id.desc()).all()
    output = [{"id": r.id, "name": r.name, "program": r.program, 
               "rating": r.rating, "message": r.message, "date": r.date} for r in reviews]
    return jsonify(output)

@app.route('/')
def home():
    return "Knowledge Zenith API is Live and Running!"

# ==========================================
# SECTION 6: APP RUNNER
# ==========================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Render ke liye port dynamic hona chahiye (Local ke liye 5000)
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
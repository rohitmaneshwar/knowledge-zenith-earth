import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# ==========================================
# SECTION 1: APP SETUP & SECURITY
# ==========================================

# 1. .env file se secret data load karna (Password security ke liye)
load_dotenv()

app = Flask(__name__)

# 2. CORS: Frontend (React) ko Backend se baat karne ki permission dena
CORS(app)

# 3. Database ki setting (SQLite use kar rahe hain)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# ==========================================
# SECTION 2: DATABASE MODELS (TABLES)
# ==========================================

# 1. Registered Students ki Table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    program = db.Column(db.String(100), nullable=False)
    transaction_id = db.Column(db.String(100), nullable=True) # Payment UTR
    date = db.Column(db.String(100)) # Registration ka time

# 2. Client Reviews ki Table
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

# API: Admin Login Verify Karna
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    
    # .env file se asli password nikalna (Agar .env nahi hai toh error dega)
    real_password = os.getenv("Rohit@admin_password")
    
    # Agar frontend se aaya password aur asli password match karte hain
    if data.get('Rohit@admin_password') == real_password:
        return jsonify({"message": "Access Granted"}), 200
    else:
        # Galat password par direct 401 Unauthorized error
        return jsonify({"message": "Access Denied"}), 401


# ==========================================
# SECTION 4: REGISTRATION APIs
# ==========================================

# API: Naya Student Register karna
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Naya data database me feed karna
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
        print("Error in Registration:", e)
        return jsonify({"message": "Server Error"}), 500

# API: Admin panel ke liye saare students ka data bhejna
@app.route('/api/users', methods=['GET'])
def get_all_users():
    # Saare users ko ulte kram me lana (Naya sabse upar)
    users = User.query.order_by(User.id.desc()).all()
    output = []
    for user in users:
        output.append({
            "id": user.id, "name": user.name, "email": user.email, 
            "phone": user.phone, "program": user.program, 
            "transaction_id": user.transaction_id, "date": user.date
        })
    return jsonify(output)

# API: Admin panel se kisi student ko delete karna
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200
    return jsonify({"message": "User not found"}), 404


# ==========================================
# SECTION 5: REVIEWS APIs
# ==========================================

# API: Naya Review Post karna
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

# API: Website par dikhane ke liye saare reviews bhejna
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.order_by(Review.id.desc()).all()
    output = []
    for r in reviews:
        output.append({
            "id": r.id, "name": r.name, "program": r.program, 
            "rating": r.rating, "message": r.message, "date": r.date
        })
    return jsonify(output)

# API: Admin panel se kisi review ko delete karna
@app.route('/api/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review = Review.query.get(review_id)
    if review:
        db.session.delete(review)
        db.session.commit()
        return jsonify({"message": "Review deleted"}), 200
    return jsonify({"message": "Not found"}), 404


# ==========================================
# SECTION 6: APP RUNNER
# ==========================================

if __name__ == '__main__':
    # Server start hone se pehle table banaye (agar nahi bani hai)
    with app.app_context():
        db.create_all()
        
    # Server start karein
    app.run(debug=True)
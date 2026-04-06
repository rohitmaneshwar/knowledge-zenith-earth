import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# ==========================================
# SECTION 1: APP SETUP & DATABASE CONFIG
# ==========================================

load_dotenv()
app = Flask(__name__)

# CORS: Frontend (Vercel) ko connect karne ke liye
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-123')

# --- DATABASE PATH LOGIC (Instance Folder Fix) ---
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')

# Agar 'instance' folder nahi hai (Render par), toh ise bana do
if not os.path.exists(instance_path):
    os.makedirs(instance_path)

# SQLite path with extra safety for Render
db_path = os.path.join(instance_path, 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Extra connect_args for SQLite
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "connect_args": {"check_same_thread": False}
}

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
# 🔥 THE ULTIMATE FIX 🔥
# ==========================================
# Ye code har API request se pehle chalega aur table banayega!
@app.before_request
def create_tables():
    db.create_all()
    
# ==========================================
# SECTION 6: APP RUNNER
# ==========================================
    
# --- Runner Section Update (Sabse Niche) ---
if __name__ == '__main__':
    with app.app_context():
        # Purani tables delete karke nayi banayein (Hard Reset)
        db.create_all() 
        print(f"✅ Database Tables Checked/Created at: {db_path}")

# ==========================================
# 🔥 EMERGENCY DATABASE SETUP ROUTE
# ==========================================
@app.route('/api/setup-db')
def setup_database():
    try:
        db.create_all()
        return "<h1>✅ BOOM! Database and Tables created successfully!</h1><p>Ab aap /api/users ya Vercel website check kar sakte hain.</p>"
    except Exception as e:
        return f"<h1>❌ Error:</h1> <p>{str(e)}</p>"
        
@app.route('/')
def home():
    return "Knowledge Zenith API is Live and Running!"

# ==========================================
# SECTION 3: ADMIN SECURITY (LOGIN)
# ==========================================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    real_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    if data and data.get('password') == real_password:
        return jsonify({"message": "Access Granted"}), 200
    else:
        return jsonify({"message": "Access Denied"}), 401

# ==========================================
# SECTION 4: REGISTRATION & REVIEWS APIs
# ==========================================

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
        print(f"Error in register: {e}") # Logs mein error dekhne ke liye
        return jsonify({"message": "Server Error"}), 500

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.order_by(User.id.desc()).all()
        output = [{"id": u.id, "name": u.name, "email": u.email, "phone": u.phone, 
                   "program": u.program, "transaction_id": u.transaction_id, "date": u.date} for u in users]
        return jsonify(output)
    except Exception as e:
        print(f"Error in fetching users: {e}")
        return jsonify({"message": "Could not fetch users"}), 500

@app.route('/api/reviews', methods=['POST'])
def add_review():
    try:
        data = request.json
        new_review = Review(
            name=data['name'], 
            program=data['program'],
            rating=int(data['rating']), # Rating ko integer mein convert kiya
            message=data['message'],
            date=datetime.now().strftime("%d-%m-%Y")
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({"message": "Review posted successfully!"}), 201
    except Exception as e:
        print(f"Error in add_review: {e}")
        return jsonify({"message": "Review could not be posted"}), 500

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    try:
        reviews = Review.query.order_by(Review.id.desc()).all()
        output = [{"id": r.id, "name": r.name, "program": r.program, 
                   "rating": r.rating, "message": r.message, "date": r.date} for r in reviews]
        return jsonify(output)
    except Exception as e:
        print(f"Error in fetching reviews: {e}")
        return jsonify([])


    
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
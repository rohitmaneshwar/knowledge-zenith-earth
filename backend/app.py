import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# ==========================================
# SECTION 1: APP SETUP & DATABASE CONFIG
# ==========================================

load_dotenv()
app = Flask(__name__)

# CORS: Frontend (Vercel) ko connect karne ke liye
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-123')

basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')

if not os.path.exists(instance_path):
    os.makedirs(instance_path)

db_path = os.path.join(instance_path, 'database.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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

class StudentAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) 

@app.before_request
def create_tables():
    db.create_all()

# ==========================================
# 🌟 EMAIL NOTIFICATION FUNCTION 🌟
# ==========================================
def send_email_notification(to_email, user_name, subject, message_body):
    try:
        # 🔴 DHYAN DEIN: Yahan apni details daalein
        sender_email = "rohittech045@gmail.com"  # Apni Gmail ID
        sender_password = "ewvwmgfenjuyovkb" # Google App Password

        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(message_body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# ==========================================
# SECTION 3: EMERGENCY DB SETUP & HOME
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

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    real_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    if data and data.get('password') == real_password:
        return jsonify({"message": "Access Granted"}), 200
    else:
        return jsonify({"message": "Access Denied"}), 401

# ==========================================
# SECTION 5: STUDENT AUTHENTICATION (LOGIN/SIGNUP)
# ==========================================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        existing_user = StudentAccount.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"message": "Email already registered!"}), 400
        
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_account = StudentAccount(
            name=data['name'], email=data['email'],
            phone=data['phone'], password=hashed_password
        )
        db.session.add(new_account)
        db.session.commit()

        # 🌟 EMAIL BHEJNE KA CODE 🌟
        html_message = f"""
        <h2>Welcome to Knowledge Zenith Earth, {data['name']}! 🌍</h2>
        <p>Your account has been successfully created.</p>
        <p><strong>Your Registered Email:</strong> {data['email']}</p>
        <p>You can now log in to access our premium courses and content.</p>
        <br><p>Best Regards,<br>Team Knowledge Zenith</p>
        """
        send_email_notification(data['email'], data['name'], "Welcome to Knowledge Zenith Earth!", html_message)

        return jsonify({"message": "Account created successfully!"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = StudentAccount.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        
        # 🌟 SECURITY ALERT EMAIL 🌟
        login_message = f"""
        <h3>Hello {user.name},</h3>
        <p>We noticed a successful login to your Knowledge Zenith Earth account just now.</p>
        <p>If this was you, no further action is needed.</p>
        <p>If this wasn't you, please reset your password immediately on our website.</p>
        <br><p>Stay safe,<br>Team Knowledge Zenith</p>
        """
        send_email_notification(user.email, user.name, "New Login Alert - Knowledge Zenith", login_message)

        # Phone number bhi bhej rahe hain taaki profile mein dikh sake
        return jsonify({
            "message": "Login Successful", 
            "name": user.name, 
            "email": user.email,
            "phone": user.phone
        }), 200
    else:
        return jsonify({"message": "Invalid Email or Password"}), 401

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    user = StudentAccount.query.filter((StudentAccount.email == data['identifier']) | (StudentAccount.phone == data['identifier'])).first()
    if user:
        return jsonify({"message": "User found! You can now reset your password.", "email": user.email}), 200
    else:
        return jsonify({"message": "No account found with this Email/Phone."}), 404

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    user = StudentAccount.query.filter_by(email=data['email']).first()
    if user:
        user.password = generate_password_hash(data['new_password'], method='pbkdf2:sha256')
        db.session.commit()
        return jsonify({"message": "Password updated successfully! You can login now."}), 200
    else:
        return jsonify({"message": "User not found!"}), 404

# ==========================================
# SECTION 6: REGISTRATION & REVIEWS APIs
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
        print(f"Error in register: {e}")
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
            rating=int(data['rating']),
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
        print(f"✅ Database Tables Checked/Created at: {db_path}")
        
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
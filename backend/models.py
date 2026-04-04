from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Database ka object banana
db = SQLAlchemy()

# Users Table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    program_name = db.Column(db.String(200)) # Kaunsa program select kiya
    transaction_id = db.Column(db.String(100), nullable=True) # Naya Field
    date_applied = db.Column(db.DateTime, default=datetime.utcnow)
    
# 1. Review Model banayein
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    program = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    message = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(100))
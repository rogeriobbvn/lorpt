from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from extensions import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nickname = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    guild = db.Column(db.String(50))
    server = db.Column(db.String(50))
    image = db.Column(db.String(200))
    is_admin = db.Column(db.Boolean, default=False)
    matches = db.relationship('Match', backref='player', lazy=True)

class Championship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    server = db.Column(db.String(50))
    type = db.Column(db.String(20))
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    max_participants = db.Column(db.Integer)
    auto_signup = db.Column(db.Boolean, default=True)
    participants = db.relationship('User', secondary='championship_participants', backref='championships')
    matches = db.relationship('Match', backref='championship', lazy=True)

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    championship_id = db.Column(db.Integer, db.ForeignKey('championship.id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    opponent = db.Column(db.String(50))
    result = db.Column(db.String(10)) # vitória, derrota, WO
    date = db.Column(db.DateTime, default=datetime.utcnow)

championship_participants = db.Table('championship_participants',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('championship_id', db.Integer, db.ForeignKey('championship.id'))
)

from app import app, db
from models import User
from werkzeug.security import generate_password_hash

with app.app_context():
    if not User.query.filter_by(email='teste1@email.com').first():
        user1 = User(email='teste1@email.com', nickname='teste1', password=generate_password_hash('123456', method='pbkdf2:sha256'))
        db.session.add(user1)
    if not User.query.filter_by(email='teste2@email.com').first():
        user2 = User(email='teste2@email.com', nickname='teste2', password=generate_password_hash('123456', method='pbkdf2:sha256'))
        db.session.add(user2)
    db.session.commit()
    print('Usuários de teste criados com sucesso!')

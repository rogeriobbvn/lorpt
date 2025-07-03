from app import app, db
from models import User

with app.app_context():
    user = User.query.filter_by(email='rogeriobbvn@gmail.com').first()
    if user:
        user.is_admin = True
        db.session.commit()
        print('Usuário rogeriobbvn@email.com agora é admin!')
    else:
        print('Usuário não encontrado.')

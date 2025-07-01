from flask import Flask, render_template, redirect, url_for, request, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from forms import RegistrationForm, LoginForm, ChampionshipForm, ResultForm
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///legend.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

from models import User, Championship, Match

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    championships = Championship.query.all()
    return render_template('index.html', championships=championships)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_pw = generate_password_hash(form.password.data)
        user = User(email=form.email.data, nickname=form.nickname.data, password=hashed_pw)
        db.session.add(user)
        db.session.commit()
        flash('Cadastro realizado! Faça login.')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('index'))
        flash('Login inválido')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    # Implementar edição de perfil
    return render_template('profile.html')

@app.route('/championship/new', methods=['GET', 'POST'])
@login_required
def new_championship():
    if not current_user.is_admin:
        flash('Apenas administradores podem criar campeonatos.')
        return redirect(url_for('index'))
    form = ChampionshipForm()
    if form.validate_on_submit():
        champ = Championship(
            name=form.name.data,
            description=form.description.data,
            server=form.server.data,
            type=form.type.data,
            start_date=form.start_date.data,
            end_date=form.end_date.data,
            max_participants=form.max_participants.data,
            auto_signup=form.auto_signup.data
        )
        db.session.add(champ)
        db.session.commit()
        flash('Campeonato criado!')
        return redirect(url_for('index'))
    return render_template('new_championship.html', form=form)

@app.route('/championship/<int:champ_id>')
def view_championship(champ_id):
    champ = Championship.query.get_or_404(champ_id)
    return render_template('championship.html', champ=champ)

@app.route('/admin')
@login_required
def admin_panel():
    if not current_user.is_admin:
        flash('Acesso restrito ao admin.')
        return redirect(url_for('index'))
    users = User.query.all()
    championships = Championship.query.all()
    return render_template('admin.html', users=users, championships=championships)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

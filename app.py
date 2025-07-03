from flask import Flask, render_template, redirect, url_for, request, flash, session
from extensions import db
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from forms import RegistrationForm, LoginForm, ChampionshipForm, ResultForm
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///legend.db'
db.init_app(app)
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
            from datetime import datetime
            user.last_login = datetime.utcnow()
            db.session.commit()
            login_user(user)
            return redirect(url_for('index'))
        flash('Login inválido')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


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
        print(f"[LOG] Campeonato cadastrado: {champ.name} ({champ.server}, {champ.type})")
        flash('Campeonato criado com sucesso!')
        return redirect(url_for('index'))
    else:
        if form.errors:
            print('[LOG] Erros no cadastro de campeonato:', form.errors)
    return render_template('new_championship.html', form=form)

@app.route('/championship/<int:champ_id>', methods=['GET'])
def view_championship(champ_id):
    champ = Championship.query.get_or_404(champ_id)
    return render_template('championship.html', champ=champ)

@app.route('/championship/<int:champ_id>/iniciar', methods=['POST'])
@login_required
def iniciar_campeonato(champ_id):
    from random import shuffle
    champ = Championship.query.get_or_404(champ_id)
    if not current_user.is_admin or champ.started:
        flash('Ação não permitida.')
        return redirect(url_for('view_championship', champ_id=champ_id))
    # Marcar como iniciado
    champ.started = True
    # Separar em 2 grupos
    participantes = list(champ.participants)
    shuffle(participantes)
    meio = len(participantes) // 2
    grupoA = participantes[:meio]
    grupoB = participantes[meio:]
    # Criar duelos dentro dos grupos
    from models import Match
    for grupo in [grupoA, grupoB]:
        for i in range(len(grupo)):
            for j in range(i+1, len(grupo)):
                m1 = Match(championship_id=champ.id, player_id=grupo[i].id, opponent=grupo[j].nickname)
                m2 = Match(championship_id=champ.id, player_id=grupo[j].id, opponent=grupo[i].nickname)
                db.session.add(m1)
                db.session.add(m2)
    db.session.commit()
    flash('Campeonato iniciado e duelos criados!')
    return redirect(url_for('view_championship', champ_id=champ_id))

@app.route('/match/<int:match_id>/score', methods=['POST'])
@login_required
def atualizar_score(match_id):
    from models import Match
    match = Match.query.get_or_404(match_id)
    champ = Championship.query.get(match.championship_id)
    if not current_user.is_admin:
        flash('Apenas admin pode atualizar o placar.')
        return redirect(url_for('view_championship', champ_id=champ.id))
    result = flask.request.form.get('result')
    # Atualizar placar e estatísticas
    match.result = result
    # Atualiza vitórias/derrotas se resultado for válido
    jogador = match.player
    # Procurar oponente pelo nickname
    from models import User
    oponente = User.query.filter_by(nickname=match.opponent).first()
    # Remover contagem anterior se já existia
    if match.result in ['vitória', 'derrota', 'WO']:
        if match.result == 'vitória':
            jogador.victories = max(0, jogador.victories - 1)
            if oponente:
                oponente.defeats = max(0, oponente.defeats - 1)
        elif match.result in ['derrota', 'WO']:
            jogador.defeats = max(0, jogador.defeats - 1)
            if oponente:
                oponente.victories = max(0, oponente.victories - 1)
    # Adicionar nova contagem
    if result == 'vitória':
        jogador.victories += 1
        if oponente:
            oponente.defeats += 1
    elif result in ['derrota', 'WO']:
        jogador.defeats += 1
        if oponente:
            oponente.victories += 1
    db.session.commit()
    flash('Placar atualizado!')
    return redirect(url_for('view_championship', champ_id=champ.id))

@app.route('/championship/<int:champ_id>/inscrever', methods=['POST'])
@login_required
def inscrever(champ_id):
    champ = Championship.query.get_or_404(champ_id)
    if current_user not in champ.participants:
        champ.participants.append(current_user)
        db.session.commit()
        flash('Inscrição realizada com sucesso!')
    else:
        flash('Você já está inscrito neste campeonato.')
    return redirect(url_for('view_championship', champ_id=champ.id))

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    from forms import ProfileForm
    form = ProfileForm(nickname=current_user.nickname)
    last_login = current_user.last_login
    # Contar vitórias e derrotas
    victories = sum(1 for m in current_user.matches if m.result == 'vitória')
    defeats = sum(1 for m in current_user.matches if m.result == 'derrota')
    if form.validate_on_submit():
        current_user.nickname = form.nickname.data
        db.session.commit()
        flash('Nickname atualizado com sucesso!')
        return redirect(url_for('profile'))
    return render_template('profile.html', form=form, last_login=last_login, victories=victories, defeats=defeats)

@app.route('/admin', methods=['GET', 'POST'])
@login_required
def admin_panel():
    from forms import AdminEloForm
    if not current_user.is_admin:
        flash('Acesso restrito ao admin.')
        return redirect(url_for('index'))
    users = User.query.all()
    championships = Championship.query.all()
    # Lógica para atualizar elo
    if 'user_id' in flask.request.form:
        user_id = flask.request.form['user_id']
        new_elo = flask.request.form['elo']
        user = User.query.get(int(user_id))
        if user:
            user.elo = new_elo
            db.session.commit()
            flash(f'Elo de {user.nickname} atualizado para {new_elo}!')
        return redirect(url_for('admin_panel'))
    return render_template('admin.html', users=users, championships=championships, AdminEloForm=AdminEloForm)

@app.route('/teste')
def teste():
    return render_template('teste.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

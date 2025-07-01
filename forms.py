from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, IntegerField, TextAreaField, DateTimeField
from wtforms.validators import DataRequired, Email, Length

class RegistrationForm(FlaskForm):
    email = StringField('E-mail', validators=[DataRequired(), Email()])
    nickname = StringField('Nickname', validators=[DataRequired(), Length(min=3, max=50)])
    password = PasswordField('Senha', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Cadastrar')

class LoginForm(FlaskForm):
    email = StringField('E-mail', validators=[DataRequired(), Email()])
    password = PasswordField('Senha', validators=[DataRequired()])
    submit = SubmitField('Entrar')

class ChampionshipForm(FlaskForm):
    name = StringField('Nome', validators=[DataRequired()])
    description = TextAreaField('Descrição')
    server = StringField('Servidor', validators=[DataRequired()])
    type = StringField('Tipo', validators=[DataRequired()])
    start_date = DateTimeField('Data de início', format='%Y-%m-%d %H:%M')
    end_date = DateTimeField('Data de fim', format='%Y-%m-%d %H:%M')
    max_participants = IntegerField('Limite de participantes')
    auto_signup = BooleanField('Inscrição automática', default=True)
    submit = SubmitField('Criar Campeonato')

class ResultForm(FlaskForm):
    result = StringField('Resultado', validators=[DataRequired()])
    submit = SubmitField('Registrar')

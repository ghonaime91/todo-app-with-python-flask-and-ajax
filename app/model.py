

from app import app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column( db.String(255), nullable=False)
    lists = db.relationship("Todo",cascade="all, delete", backref='list_title', lazy=True)

    def __repr__(self) :
        return f"<list id = {self.id}, title = {self.title} >"




class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id', ondelete="CASCADE"))
    def __repr__(self):
        return f"< task id = {self.id}, description = {self.description},\
            completed = {self.completed}, list_id = {self.list_id} >"



db.create_all()



from app import app   
from flask import (
    render_template,
    url_for,
    redirect,
    request,
    make_response,
    jsonify
)
from app.model import Todo, List, db


#Home page & read all tasks in a list

@app.route('/')
def index():
    return redirect(url_for('get_list', list_id=1))

@app.route('/lists/<list_id>')
def get_list(list_id):
    lists = List.query.order_by('id').all()
    data = Todo.query.filter_by(list_id=list_id).order_by('id').all()
    return render_template('index.html',lists=lists, data=data)



#create a list
@app.route('/lists/create',methods=['POST'])
def create_list():
    try:
        data = request.get_json()
        title = data.get('title')
        if title == '':
            return make_response(jsonify({'error':'invalid input'}))
        new_list = List(title=title)
        db.session.add(new_list)
        db.session.commit()
        body = {'id':new_list.id, 'title':new_list.title}        
        return make_response(jsonify(body))
    except:
        db.session.rollback()
    finally:
        db.session.close()



#delete a list
@app.route('/lists/<id>/delete', methods=['DELETE'])
def delete_list(id):
    try:
        li = List.query.get(id)
        db.session.delete(li)
        db.session.commit()
        return make_response(jsonify({'action':'deleted successfully'}))
    except:
        db.session.rollback()
    finally:
        db.session.close()





#create a task
@app.route('/tasks/create', methods=['POST'])
def create():
    try:
        data = request.get_json()
        desc = data.get('description').strip()
        list_id= data.get('list_id')
        if desc == '':
            return make_response(jsonify({'error':'invalid input'}))
        task = Todo(description=desc, list_id=list_id)
        db.session.add(task)
        db.session.commit()
        print(task.list_id)
        body = {'id':task.id, 'description':task.description,
         'completed':task.completed, 'list_id':task.list_id}     
        return make_response(jsonify(body))
    except:
        db.session.rollback()
    finally:
        db.session.close()


#update a task state
@app.route('/tasks/<task_id>/update', methods=['POST'])
def update(task_id):
    try:
        data = request.get_json()
        completed = data.get('completed')
        task = Todo.query.get(task_id)
        task.completed= completed
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
        
    return make_response(jsonify({'action':'updated successfully'}))


# Delete a task 
@app.route('/tasks/<task_id>/delete', methods=['DELETE'])
def delete(task_id):
    try:
        task = Todo.query.get(task_id)
        db.session.delete(task)
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
        
    return make_response(jsonify({'action':'deleted successfully'}))

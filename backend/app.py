from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = []
task_id_counter = 1


# POST /tasks → Add a new task
@app.route('/tasks', methods=['POST'])
def add_task():
    global task_id_counter
    data = request.json
    
    if not data.get("title") or not data.get("description"):
        return jsonify({"error": "Title and Description required"}), 400

    task = {
        "id": task_id_counter,
        "title": data["title"],
        "description": data["description"],
        "completed": False
    }

    tasks.append(task)
    task_id_counter += 1

    return jsonify(task), 201


# GET /tasks → Fetch all tasks (filter optional)
@app.route('/tasks', methods=['GET'])
def get_tasks():
    status = request.args.get("status")

    if status == "completed":
        filtered = [task for task in tasks if task["completed"]]
    elif status == "pending":
        filtered = [task for task in tasks if not task["completed"]]
    else:
        filtered = tasks

    return jsonify(filtered)


# PUT /tasks/<id>/complete → Mark completed
@app.route('/tasks/<int:id>/complete', methods=['PUT'])
def complete_task(id):
    for task in tasks:
        if task["id"] == id:
            task["completed"] = True
            return jsonify(task)

    return jsonify({"error": "Task not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
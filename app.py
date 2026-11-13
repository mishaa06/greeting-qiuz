from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Your original 10 questions are preserved.
questions = [
    {
        "question": "Who is the father of Computer?",
        "options": ["Charles Babbage", "Newton", "Einstein", "Bill Gates"],
        "answer": "Charles Babbage"
    },
    {
        "question": "Which language is used for web development?",
        "options": ["HTML", "MS Word", "Excel", "Paint"],
        "answer": "HTML"
    },
    {
        "question": "What is the brain of computer?",
        "options": ["Monitor", "CPU", "Mouse", "Keyboard"],
        "answer": "CPU"
    },
    {
        "question": "Which company developed Python?",
        "options": ["Microsoft", "Google", "Python Software Foundation", "Apple"],
        "answer": "Python Software Foundation"
    },
    {
        "question": "Which one is an operating system?",
        "options": ["Windows", "Google", "HTML", "Java"],
        "answer": "Windows"
    },
    {
        "question": "What does RAM stand for?",
        "options": [
            "Random Access Memory",
            "Read Access Memory",
            "Run Access Memory",
            "Real Application Memory"
        ],
        "answer": "Random Access Memory"
    },
    {
        "question": "Which symbol is used for comments in Python?",
        "options": ["//", "#", "/*", "&"],
        "answer": "#"
    },
    {
        "question": "Which device is used to print documents?",
        "options": ["Scanner", "Monitor", "Printer", "Mouse"],
        "answer": "Printer"
    },
    {
        "question": "Which language is mainly used for styling websites?",
        "options": ["Python", "CSS", "C++", "SQL"],
        "answer": "CSS"
    },
    {
        "question": "What does URL stand for?",
        "options": [
            "Uniform Resource Locator",
            "Universal Record Link",
            "United Resource Link",
            "Uniform Read Location"
        ],
        "answer": "Uniform Resource Locator"
    }
]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get_question")
def get_question():
    index = request.args.get("index", default=0, type=int)

    if index < 0 or index >= len(questions):
        return jsonify({"finished": True})

    question = questions[index]
    return jsonify({
        "question": question["question"],
        "options": question["options"],
        "question_number": index + 1,
        "total_questions": len(questions),
        "finished": False
    })


@app.route("/check_answer", methods=["POST"])
def check_answer():
    data = request.get_json(silent=True) or {}
    index = data.get("question_index")
    selected_answer = data.get("answer")

    if not isinstance(index, int) or not 0 <= index < len(questions):
        return jsonify({"error": "Invalid question"}), 400

    correct_answer = questions[index]["answer"]
    return jsonify({
        "correct": selected_answer == correct_answer,
        "correct_answer": correct_answer
    })


if __name__ == "__main__":
    # Local development only. For online hosting, the hosting service
    # will start the app using its own web server.
    app.run(debug=True)

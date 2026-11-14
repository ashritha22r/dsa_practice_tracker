
let problems = JSON.parse(localStorage.getItem("problems")) || [];

const form = document.getElementById("problemForm");
const problemList = document.getElementById("problemList");

function saveData() {
    localStorage.setItem("problems", JSON.stringify(problems));
}

function updateStats() {
    let total = problems.length;
    let solved = problems.filter(p => p.status === "Solved").length;
    let unsolved = total - solved;

    let progress = total === 0 ? 0 :
        Math.round((solved / total) * 100);

    document.getElementById("total").textContent = total;
    document.getElementById("solved").textContent = solved;
    document.getElementById("unsolved").textContent = unsolved;
    document.getElementById("progress").textContent = progress + "%";
}

function displayProblems() {
    problemList.innerHTML = "";

    let statusFilter = document.getElementById("filterStatus").value;
    let platformFilter = document.getElementById("filterPlatform").value;

    let filtered = problems.filter(p => {
        return (statusFilter === "All" || p.status === statusFilter) &&
               (platformFilter === "All" || p.platform === platformFilter);
    });

    if (filtered.length === 0) {
        problemList.textContent = "No problems found. Add one to get started!";
    }

    filtered.forEach(problem => {
        let div = document.createElement("div");
        div.className = "problem";

        let info = document.createElement("div");

        let title = document.createElement("h3");
        title.textContent = problem.name;

        let details = document.createElement("p");
        details.textContent =
            `${problem.platform} | ${problem.topic} | ${problem.difficulty}`;

        let status = document.createElement("p");
        status.textContent = "Status: " + problem.status;
        status.className = problem.status;

        info.append(title, details, status);

        let actions = document.createElement("div");

        let toggle = document.createElement("button");
        toggle.textContent = problem.status === "Solved"
            ? "Mark Unsolved" : "Mark Solved";

        toggle.onclick = () => {
            let index = problems.findIndex(p => p.id === problem.id);
            problems[index].status =
                problems[index].status === "Solved" ? "Unsolved" : "Solved";

            saveData();
            displayProblems();
            updateStats();
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.onclick = () => {
            problems = problems.filter(p => p.id !== problem.id);
            saveData();
            displayProblems();
            updateStats();
        };

        actions.append(toggle, deleteBtn);
        div.append(info, actions);
        problemList.appendChild(div);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let problem = {
        id: Date.now(),
        name: document.getElementById("problemName").value.trim(),
        platform: document.getElementById("platform").value,
        topic: document.getElementById("topic").value,
        difficulty: document.getElementById("difficulty").value,
        status: "Unsolved"
    };

    if (!problem.name) return;

    problems.push(problem);

    saveData();
    displayProblems();
    updateStats();

    form.reset();
});

document.getElementById("filterStatus")
    .addEventListener("change", displayProblems);

document.getElementById("filterPlatform")
    .addEventListener("change", displayProblems);

displayProblems();
updateStats();

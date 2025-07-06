// === Authentication ===
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function signup() {
  const user = document.getElementById("signupUser").value.trim();
  const pass = document.getElementById("signupPass").value.trim();
  if (!user || !pass) return alert("Enter username and password");

  const users = getUsers();
  if (users[user]) return alert("User already exists");
  users[user] = pass;
  saveUsers(users);
  alert("Signup successful! Now login.");
}

function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const users = getUsers();
  if (users[user] !== pass) return alert("Invalid credentials");

  localStorage.setItem("loggedInUser", user);
  showApp();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("authSection").style.display = "block";
}

// === Complaint System ===
function getComplaints(user) {
  return JSON.parse(localStorage.getItem("complaints_" + user) || "[]");
}

function saveComplaints(user, complaints) {
  localStorage.setItem("complaints_" + user, JSON.stringify(complaints));
}

function addComplaint() {
  const desc = document.getElementById("desc").value.trim();
  const sev = parseInt(document.getElementById("sev").value);
  if (!desc || isNaN(sev) || sev < 1 || sev > 10) {
    return alert("Enter valid description and severity (1–10)");
  }

  const user = localStorage.getItem("loggedInUser");
  const complaints = getComplaints(user);
  complaints.push({ id: Date.now(), description: desc, severity: sev });
  saveComplaints(user, complaints);

  document.getElementById("desc").value = "";
  document.getElementById("sev").value = "";

  displayComplaints();
}

function displayComplaints() {
  const user = localStorage.getItem("loggedInUser");
  const complaints = getComplaints(user).sort(
    (a, b) => b.severity - a.severity
  );
  const list = document.getElementById("complaintList");
  list.innerHTML = "";

  if (complaints.length === 0) {
    list.innerHTML = "<li>No complaints yet.</li>";
    return;
  }

  for (const c of complaints) {
    const li = document.createElement("li");
    li.innerText = `ID: ${c.id}, Severity: ${c.severity}, ${c.description}`;
    list.appendChild(li);
  }
}

function showApp() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return;

  document.getElementById("currentUser").innerText = user;
  document.getElementById("authSection").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  displayComplaints();
}

showApp(); // Auto login if session exists

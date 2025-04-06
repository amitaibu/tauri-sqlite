import Database from "@tauri-apps/plugin-sql";

const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const userForm = document.getElementById("user-form");
const usersTable = document.querySelector("#users-table tbody");
const errorMsg = document.getElementById("error-msg");

async function getUsers() {
  try {
    const db = await Database.load("sqlite:test.db");
    const users = await db.select("SELECT * FROM users");

    renderUsers(users);
    errorMsg.textContent = "";
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Failed to load users.";
  }
}

function renderUsers(users) {
  usersTable.innerHTML = "";
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.email}</td>`;
    usersTable.appendChild(row);
  });
}

async function addUser(name, email) {
  try {
    const db = await Database.load("sqlite:test.db");
    await db.execute("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
    await getUsers();
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Failed to add user.";
  }
}

userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  if (!name || !email) return;

  addUser(name, email);
  nameInput.value = "";
  emailInput.value = "";
});

getUsers();

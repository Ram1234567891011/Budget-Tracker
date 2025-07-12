const balanceEl = document.getElementById("balance");
const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const list = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  list.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.classList.add("transaction", transaction.type);

    li.innerHTML = `
      <span>${transaction.text}</span>
      <span>${transaction.type === "expense" ? "-" : "+"}₱${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${index})">✖</button>
    `;

    list.appendChild(li);
  });

  updateBalance();
}

function updateBalance() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const total = income - expense;
  balanceEl.textContent = `₱${total}`;
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateLocalStorage();
  renderTransactions();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = typeInput.value;

  if (text === "" || isNaN(amount)) return;

  transactions.push({
    text,
    amount,
    type
  });

  updateLocalStorage();
  renderTransactions();

  textInput.value = "";
  amountInput.value = "";
});

renderTransactions();

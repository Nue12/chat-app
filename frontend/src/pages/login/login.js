import {
  updateLabelOnBlur,
  updateLabelOnFocus,
} from "../../utils/watchInput.js";

const nameInput = document.querySelector(".nameInput");
const nameInputLabel = document.querySelector(".nameInput-label");

const passwordInput = document.querySelector(".passwordInput");
const passwordInputLabel = document.querySelector(".passwordInput-label");

// update labels
updateLabelOnFocus(nameInput, nameInputLabel);
updateLabelOnBlur(nameInput, nameInputLabel);

updateLabelOnFocus(passwordInput, passwordInputLabel);
updateLabelOnBlur(passwordInput, passwordInputLabel);

/////////// login process /////////////

localStorage.removeItem("auth");

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const { name, password } = {
    name: nameInput.value,
    password: passwordInput.value,
  };

  if (!name || !password) {
    return;
  }

  const res = await fetch(`${window.location.origin}/isAuthencate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });

  const { status, key, userId, userName, userImg, message } = await res.json();

  if (status === "success") {
    const auth = { key, userId, userName, userImg };
    window.localStorage.setItem("auth", JSON.stringify(auth));
    alert(message); //
    window.location.href = "/chat";
  } else {
    alert(message);
  }
});

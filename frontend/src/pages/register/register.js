import {
  updateLabelOnBlur,
  updateLabelOnFocus,
} from "../../utils/watchInput.js";

const nameInput = document.querySelector(".nameInput");
const nameInputLabel = document.querySelector(".nameInput-label");

const emailInput = document.querySelector(".emailInput");
const emailInputLabel = document.querySelector(".emailInput-label");

const passwordInput = document.querySelector(".passwordInput");
const passwordInputLabel = document.querySelector(".passwordInput-label");

// update labels
updateLabelOnFocus(nameInput, nameInputLabel);
updateLabelOnBlur(nameInput, nameInputLabel);

updateLabelOnFocus(emailInput, emailInputLabel);
updateLabelOnBlur(emailInput, emailInputLabel);

updateLabelOnFocus(passwordInput, passwordInputLabel);
updateLabelOnBlur(passwordInput, passwordInputLabel);

//////////// registration process /////////

const processTag = document.querySelector(".process");
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {
  const { name, email, password } = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  if (!name || !email || !password) {
    return;
  }

  registerBtn.disabled = true;
  processTag.classList.remove("invisible");

  const res = await fetch(`${window.location.origin}/registerUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const { status, message, redirectUrl, userEmail } = await res.json();

  if (status === "success") {
    window.localStorage.setItem("userEmail", JSON.stringify(userEmail));
    alert(message); //
    processTag.classList.add("invisible");
    registerBtn.disabled = false;
    if (redirectUrl) {
      window.location.href = redirectUrl; // --> /verify email
    }
  } else {
    alert(message); //
    processTag.classList.add("invisible");
    registerBtn.disabled = false;
  }
});

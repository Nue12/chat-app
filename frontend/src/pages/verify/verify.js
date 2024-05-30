const emailTag = document.querySelector(".email");

const userEmail = window.localStorage.getItem("userEmail");

if (userEmail) {
  const partialEmail = userEmail.replace(
    /(\w{3})[\w.-]+@([\w.]+\w)/,
    "$1******@$2"
  );
  emailTag.innerHTML = partialEmail;
  window.localStorage.removeItem("userEmail");
}

const otpArr = [];
document.addEventListener("DOMContentLoaded", function (event) {
  function OTPInput() {
    const inputs = document.querySelectorAll("#otp > *[id]");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("keydown", function (event) {
        if (event.key === "Backspace") {
          inputs[i].value = "";
          otpArr.pop();
          if (i !== 0) inputs[i - 1].focus();
        } else {
          if (event.keyCode > 47 && event.keyCode < 58) {
            inputs[i].value = event.key;
            otpArr.push(event.key);
            if (i !== inputs.length - 1) inputs[i + 1].focus();
            if (i === inputs.length - 1) {
              checkOtpCode();
              return true;
            }
            event.preventDefault();
          } else if (event.keyCode > 64 && event.keyCode < 91) {
            inputs[i].value = String.fromCharCode(event.keyCode);
            otpArr.push(String.fromCharCode(event.keyCode));
            if (i !== inputs.length - 1) inputs[i + 1].focus();
            if (i === inputs.length - 1) {
              checkOtpCode();
              return true;
            }
            event.preventDefault();
          }
        }
      });
    }
  }
  OTPInput();
});

async function checkOtpCode() {
  const otpCode = otpArr.join("");
  console.log(otpCode);
  const res = await fetch(`${window.location.origin}/verifiedEmail`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ otpCode }),
  });

  const { message, redirectUrl, status } = await res.json();

  if (status === "success") {
    alert(message); //
    if (redirectUrl) {
      window.location.href = redirectUrl; // --> /login
    }
  } else {
    alert(message); //
    const inputTags = document.querySelectorAll("input");
    inputTags.forEach((input) => {
      input.value = "";
    });
    inputTags[0].focus();
    otpArr = [];
  }
}

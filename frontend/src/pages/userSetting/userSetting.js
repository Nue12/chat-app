import { themeToggler, updateTheme } from "../../utils/theme.js";

const themeTogglerBtn = document.querySelector(".theme-toggler-btn");
const ball = document.querySelector(".theme-toggler-ball");
const themText = document.querySelector(".theme-text");
const title = document.querySelector(".userSetting_title");
const profileInput = document.querySelector(".profileInput");
const profileImage = document.querySelector(".profile_img");
const profileBtn = document.querySelector(".profile_button");
// update theme
(() => {
  const { userImg } = JSON.parse(localStorage.getItem("auth"));

  updateTheme(ball, themText);
  profileImage.src = userImg
    ? `${window.location.origin}/${userImg}`
    : `${window.location.origin}/assets/default-avatar.jpg`;
})();

// theme toggler
themeToggler(themeTogglerBtn, ball, themText);

// update title
const updateTitle = () => {
  const { userName } = JSON.parse(localStorage.getItem("auth"));
  title.textContent = `User setting for @${userName}`;
};

updateTitle();
// redirect to login

const logoutBtn = document.getElementById("logOutBtn");

logoutBtn.addEventListener("click", () => {
  if (confirm("Log out confirm")) {
    window.location.href = "/login";
  }
});

let FILE;

profileInput.addEventListener("change", async (e) => {
  const file = profileInput.files[0];
  if (!file) return;

  if (!e.target.value) return;

  const maxSize = 1 * 1024 * 1024;

  if (file.size > maxSize) {
    alert(`Please choose an image less than 1 mb`);
    return;
  }

  FILE = file;
  profileImage.src = URL.createObjectURL(file);

  const formData = new FormData();
  const { userId } = JSON.parse(localStorage.getItem("auth"));

  formData.append("profile_img", FILE);

  const res = await fetch(`${window.location.origin}/uploadProfile/${userId}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    alert("Failed to upload profile");
    return;
  }

  const data = await res.json();

  const userInfo = JSON.parse(localStorage.getItem("auth"));
  const updatedUserInfo = { ...userInfo, userImg: data.url };
  localStorage.setItem("auth", JSON.stringify(updatedUserInfo));
});

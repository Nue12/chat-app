export const themeToggler = (togglerElem, ball, themText) => {
  togglerElem.addEventListener("click", () => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");

      updateTheme(ball, themText);
    } else {
      localStorage.removeItem("theme");
      document.documentElement.classList.remove("dark");

      updateTheme(ball, themText);
    }
  });
};

export const updateTheme = (ball, themText) => {
  const isDarkTheme = localStorage.getItem("theme");

  if (isDarkTheme) {
    document.documentElement.classList.add("dark");
    if (ball && themText) {
      ball.classList.remove("left-[3px]");
      ball.classList.add("left-[31px]");
      themText.textContent = "Light Mode";
    }
  } else {
    document.documentElement.classList.remove("dark");
    if (ball && themText) {
      ball.classList.remove("left-[31px]");
      ball.classList.add("left-[3px]");
      themText.textContent = "Dark Mode";
    }
  }
};

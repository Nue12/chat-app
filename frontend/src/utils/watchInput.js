export const updateLabelOnFocus = (input, label) => {
  input.addEventListener("focus", () => {
    label.classList.remove("top-[10px]", "left-2");
    label.classList.add("top-[-12px]", "left-0", "text-sm");
  });
};

export const updateLabelOnBlur = (input, label) => {
  input.addEventListener("blur", () => {
    const hasValue = input.value.trim().length;

    if (hasValue) {
      label.classList.add("text-sm");
    } else {
      label.classList.remove("top-[-12px]", "left-0", "text-sm");
      label.classList.add("top-[10px]", "left-2");
    }
  });
};

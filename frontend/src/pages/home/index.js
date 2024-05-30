import { updateTheme } from "../../utils/theme.js";
// users Menu open and close

window.addEventListener("unload", () => {
  console.log("I don't know how it work");
});
const usersButton = document.getElementById("usersBtn");
const settingButton = document.getElementById("settingBtn");
const usersMenu = document.getElementById("usersMenu");

let usersMenuDth = false;

// listen for click to open or close users menu and function

usersButton.addEventListener("click", () => {
  if (usersMenuDth) {
    closeUsersMenu();
  } else if (!usersMenuDth) {
    openUsersMenu();
  }
});

let touchstartX = 0;
let touchendX = 0;

// function for touch direction to close or open users menu

function checkDirection() {
  if (touchstartX - touchendX > 70) {
    openUsersMenu();
    // setSlide(true);
  } else if (touchstartX - touchendX < -70) {
    closeUsersMenu();
    // setSlide(false);
  }
}

// function for screen touch to open and close to users menu

document.addEventListener("touchstart", (e) => {
  touchstartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  checkDirection();
});

// go to user setting
settingButton.addEventListener("click", () => {
  window.location.href = "/setting";
});

// function for open and close usersMenu

const opLayerTag = document.getElementById("opLayer");
const rightSideTag = document.getElementById("rightSide");

function openUsersMenu() {
  usersMenu.classList.remove("translate-x-full");
  usersMenuDth = !usersMenuDth;
  opLayerTag.classList.remove("hidden");
  rightSideTag.classList.remove("-z-50");
  rightSideTag.classList.add("z-50");
}
function closeUsersMenu() {
  usersMenu.classList.add("translate-x-full");
  usersMenuDth = !usersMenuDth;
  opLayerTag.classList.add("hidden");
  rightSideTag.classList.remove("z-50");
  rightSideTag.classList.add("-z-50");
}

////////////// debounce function ///////////////////////////

let uniqueSet = new Set();

function debounce(cb, delay = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
      uniqueSet.clear();
    }, delay);
  };
}

const typingContainerTag = document.getElementById("typingContainer");

const updateDebounceTypeDiv = debounce(() => {
  typingContainerTag.innerHTML = "";
}, 2000);

/////////////// atuh session ////////////////
/// that fun will check is user login or not
(async () => {
  updateTheme();

  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth) {
    return (window.location.href = "/login");
  } else {
    const { key } = auth;

    const res = await fetch(`${window.location.origin}/checkKey`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (res.redirected) {
      return (window.location.href = res.url); // --> /login
    } else {
      const loadingTag = document.getElementById("loading");
      loadingTag.classList.add("hidden");
      const mainChatTag = document.getElementById("mainchat");
      mainChatTag.classList.remove("hidden");
    }
  }

  /**** please put SOCKET thing in down there.. ****/
  //////////////////

  // your code
  const socket = io("/");
  const msgsDivInner = document.getElementById("messagesDiv_inner");
  const inputMsg = document.getElementById("inputMessage");
  const sendBtn = document.getElementById("sendMessage");
  const bottomLayer = document.querySelector(".bottom_layer");
  const { userName, userImg } = auth;

  socket.on("connect", () => {
    socket.emit("active", userName);
  });

  const userNameTag = document.querySelector(".userTag");
  userNameTag.innerHTML = userName;

  socket.on("histData", (histData) => {
    histData.forEach((data) => {
      setMessages(data);
    });
  });

  // socket.on("disconnect", () => {
  //   socket.emit("offline", userName);
  // });

  inputMsg.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      sendDataToSocket();
    }
  });

  sendBtn.addEventListener("click", () => {
    sendDataToSocket();
  });

  inputMsg.addEventListener("keypress", () => {
    socket.emit("typing", userName);
  });

  socket.on("resData", (data) => {
    console.log("data", data);
    console.log(typeof data.timestamp);
    setMessages(data);
  });

  setInterval(() => {
    setDate();
  }, 60000);

  socket.on("typingPs", (name) => {
    uniqueSet.add(name);
    let typingPsText = "";
    const typingPsAry = [...uniqueSet];
    typingPsAry.forEach((typingP, idx) => {
      if (idx === 0) {
        typingPsText += typingP;
      } else {
        typingPsText += ", " + typingP;
      }
    });

    setTimeout(() => {
      typingPsAry.forEach((typingP) => {
        if (typingP !== name) {
          uniqueSet.delete(typingP);
        }
      });
    }, 1000);
    typingContainerTag.innerHTML = `
    <div class="flex space-x-1">
    <div
    class="animate-fC w-[10px] h-[10px] rounded-full bg-[#D9D9D9]"
    ></div>
    <div
    class="animate-sC w-[10px] h-[10px] rounded-full bg-[#C7C5C5]"
    ></div>
    <div
    class="animate-tC w-[10px] h-[10px] rounded-full bg-[#A6A6A6]"
    ></div>
    </div>
    <p class="text-[#A6A6A6] text-sm">
    <span class="font-medium text-[#A6A6A6] text-sm">${typingPsText}</span>
    is typing
    </p>
    </div>
    `;
    updateDebounceTypeDiv();
  });

  socket.on("usersStatus", (usersStatus) => {
    showUsersStatus(usersStatus);
  });

  ///////////////// Functions /////////////////////////

  function sendDataToSocket() {
    if (inputMsg.value.trim() === "") return;
    const timestamp = Date.now();
    console.log(typeof timestamp);

    const data = {
      message: inputMsg.value,
      userName: userName,
      userImg,
      timestamp,
    };
    socket.emit("chat", data);
    inputMsg.value = "";
  }

  function setMessages(data) {
    // if is empty string chage default
    if (data.userImg === "") {
      data.userImg = "/assets/default-avatar.jpg";
    }

    const oneMsgDiv = `
        <div class="my-4">
          <div class="flex items-start">
            <div
              class="w-12 h-12 rounded-full overflow-hidden"
            >
              <img
                src=${data.userImg}
                alt=""
                class='w-full h-full object-cover'
              />
            </div>
    
            <div class="flex-1 ml-2">
              <div class="flex items-baseline space-x-2">
                <h2 class="font-bold text-lg leading-6">${data.userName}</h2>
                <span class="date"></span>
                <p class="timestamp invisible">${data.timestamp}</p>
              </div>
              <p>${data.message}</p>
            </div>
          </div>
        </div>
        `;
    msgsDivInner.innerHTML += oneMsgDiv;
    setDate();
    bottomLayer.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function setDate() {
    const timestampTag = document.querySelectorAll(".timestamp");
    let i = 0;
    if (timestampTag) {
      timestampTag.forEach((tag) => {
        const timestamp = +tag.innerHTML;
        const date = timeSince(timestamp);
        const dateTag = document.querySelectorAll(".date")[i];
        dateTag.innerHTML = date;
        i++;
      });
    }
  }

  function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " month ago";
      } else {
        return Math.floor(interval) + " months ago";
      }
    }

    interval = seconds / 86400;
    if (interval > 28) {
      return "4 weeks ago";
    }
    if (interval > 21) {
      return "3 weeks ago";
    }
    if (interval > 14) {
      return "2 weeks ago";
    }
    if (interval > 7) {
      return "1 week ago";
    }
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " day ago";
      } else {
        return Math.floor(interval) + " days ago";
      }
    }

    interval = seconds / 3600;
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " hour ago";
      } else {
        return Math.floor(interval) + " hours ago";
      }
    }

    interval = seconds / 60;
    if (interval > 1) {
      if (Math.floor(interval) === 1) {
        return Math.floor(interval) + " minute ago";
      } else {
        return Math.floor(interval) + " minutes ago";
      }
    }

    if (interval < 1) {
      return "less than a minute ago";
    }
  }

  function showUsersStatus(usersStatus) {
    // show active people
    const onPpl = usersStatus.filter((user) => {
      return user.active === true;
    });

    const onPplParentTag = document.getElementById("onPplParent");
    const onNoTag = document.querySelector(".onNo");
    const onColor = "04bf00";
    onPplParentTag.innerHTML = "";

    generateOnAndOffDiv(onPpl, onPplParentTag, onNoTag, onColor);
    // const activeNo = onPpl.length;
    // onNoTag.innerHTML = ` ${activeNo}`;

    // onPpl.forEach((user) => {
    //   if (user.userImg === "") {
    //     user.userImg = "/assets/default-avatar.jpg";
    //   }
    //   const onPplDiv = `
    //                     <div class="flex items-center justify-between my-2">
    //                       <div class="flex items-center space-x-3">
    //                         <div
    //                         class="w-8 h-8 rounded-full overflow-hidden"
    //                         >
    //                           <img
    //                             src=${user.userImg}
    //                             alt=""
    //                             class='w-full h-full object-cover'
    //                           />
    //                         </div>
    //                         <p>${user.name}</p>
    //                       </div>
    //                       <iconify-icon
    //                         icon="pajamas:status-active"
    //                         style="color: #${onColor}"
    //                         width="12"
    //                         height="12"
    //                       ></iconify-icon>
    //                     </div>
    //                       `;
    //   onPplParentTag.innerHTML += onPplDiv;
    // });

    // show offline people
    const offPpl = usersStatus.filter((user) => {
      return user.active === false;
    });

    if (offPpl) {
      const offPplParentTag = document.getElementById("offPplParent");
      const offNoTag = document.querySelector(".offNo");
      const offColor = "a6a6a6";
      offPplParentTag.innerHTML = "";

      generateOnAndOffDiv(offPpl, offPplParentTag, offNoTag, offColor);
      // const offlineNo = offPpl.length;
      // offNoTag.innerHTML = ` ${offlineNo}`;
      // offPpl.forEach((person) => {
      //   const offPplDiv = `<div class="flex items-center justify-between my-2">
      //                       <p>${person.name}</p>
      //                       <iconify-icon
      //                         icon="pajamas:status-active"
      //                         style="color: #${offColor}"
      //                         width="12"
      //                         height="12"
      //                       ></iconify-icon>
      //                     </div>
      //                     `;
      //   offPplParentTag.innerHTML += offPplDiv;
      // });
    }
  }

  function generateOnAndOffDiv(
    partiPpl,
    partiPplParentTag,
    partiNoTag,
    statusColor
  ) {
    const partiNo = partiPpl.length;
    partiNoTag.innerHTML = ` ${partiNo}`;

    // partiPplParentTag.innerHtml = "";

    partiPpl.forEach((user) => {
      if (user.userImg === "") {
        user.userImg = "/assets/default-avatar.jpg";
      }
      const partiPplDiv = `
                        <div class="flex items-center justify-between my-2">
                          <div class="flex items-center space-x-3">
                            <div
                            class="w-8 h-8 rounded-full overflow-hidden"
                            >
                              <img
                                src=${user.userImg}
                                alt=""
                                class='w-full h-full object-cover'
                              />
                            </div>
                            <p>${user.name}</p>
                          </div>
                          <iconify-icon
                            icon="pajamas:status-active"
                            style="color: #${statusColor}"
                            width="12"
                            height="12"
                          ></iconify-icon>
                        </div>
                          `;
      partiPplParentTag.innerHTML += partiPplDiv;
    });
  }

  /////////////////
})();

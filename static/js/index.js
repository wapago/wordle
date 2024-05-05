let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었습니다.";
    div.id = "correct";
    div.style =
      "display:flex; justify-content: center; align-items: center; position:absolute; top:40vh; left:38%;" +
      "background-color:white; width:200px; height:100px;";

    document.body.appendChild(div);
  };

  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts++;
    index = 0;
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async (event) => {
    let 맞은_개수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer"); // await 서버에서 요청을 받을때까지 기다림
    console.log(응답);
    const 정답 = await 응답.json();
    console.log(정답);

    for (let i = 0; i < 5; i++) {
      let keydownVal = keydownArray[i];

      const clickedKey = document.querySelector(
        `.each-key[data-key='${keydownVal}']`
      );

      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );

      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_개수 += 1;
        clickedKey.style.background = "#6AAA64";
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        clickedKey.style.background = "#C9B458";
        block.style.background = "#C9B458";
      } else {
        clickedKey.style.background = "#787C7E";
        block.style.background = "#787C7E";
      }

      block.style.color = "white";
      clickedKey.style.color = "white";
    }
    keydownArray = [];
    if (맞은_개수 === 5) gameover();
    else nextLine();
  };

  const handleEnterClick = (event) => {
    let 맞은_개수 = 0;
    for (let i = 0; i < 5; i++) {
      let clickVal = clickedArray[i];

      const clickedKey = document.querySelector(
        `.each-key[data-key='${clickVal}']`
      );

      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );

      const 입력한_글자 = clickVal;
      const 정답_글자 = 정답[i];

      if (입력한_글자 === 정답_글자) {
        맞은_개수 += 1;
        clickedKey.style.background = "#6AAA64";
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        clickedKey.style.background = "#C9B458";
        block.style.background = "#C9B458";
      } else {
        block.style.background = "#787C7E";
        clickedKey.style.background = "#787C7E";
      }

      block.style.color = "white";
      clickedKey.style.color = "white";
    }
    clickedArray = [];
    if (맞은_개수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  let keydownArray = [];

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.keyCode === 8) handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey(event);
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      keydownArray.push(key);
      thisBlock.innerText = key;
      index += 1;
    }
  };

  let clickedArray = [];

  const handleClick = (event) => {
    // 1. class="each-key" 만 감지할 것
    const targetClass = event.target.className;
    if (targetClass !== "each-key" && targetClass !== "backspace") return;

    const clickVal = event.target.innerText;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (targetClass === "backspace") {
      handleBackspace();
    } else if (index === 5) {
      if (clickVal === "ENTER") {
        handleEnterClick(event);
      } else return;
    } else {
      clickedArray.push(clickVal);
      thisBlock.innerText = clickVal;
      index += 1;
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timer = document.querySelector("#timer");
      timer.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown); // 키보드를 "눌렀을때"(키보드를 눌렀다가 "뗐을 때" --> keyup)
  window.addEventListener("click", handleClick);
}

appStart();

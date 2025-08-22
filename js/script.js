$(function () {
  // 게임 변수 초기화
  let score = 0;
  let miss = 0;
  let timeLeft = 60;
  let gameActive = false;
  let gameInterval;
  let timerInterval;

  // 키보드와 레인 매핑
  const keyMap = {
    d: 0,
    f: 1,
    j: 2,
    k: 3,
  };

  // 게임 시작 함수
  function startGame() {
    gameActive = true;
    gameInterval = setInterval(createItem, 800);
    timerInterval = setInterval(updateTimer, 1000);
    $("#startBtn").hide();
  }

  // 타이머 업데이트 함수
  function updateTimer() {
    timeLeft--;
    $("#timer").text(timeLeft);

    if (timeLeft <= 0) {
      endGame();
    }
  }

  // 게임 종료 함수
  function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    $("#final-score").text(score);
    $("#final-miss").text(miss);
    $("#game-over").show();
  }

  // 아이템 생성 함수
  function createItem() {
    if (!gameActive) return;

    const lane = Math.floor(Math.random() * 4);
    const width = $(".lane").eq(lane).width();

    const item = $("<div class='note'>")
      .css({
        left: lane * width + "px",
        width: width + "px",
      })
      .data("lane", lane);

    $("#game-container").append(item);

    item.animate(
      { top: $("#game-container").height() + "px" },
      2000,
      "linear",
      function () {
        if (gameActive) {
          $(this).remove();
          miss++;
          $("#miss").text(miss);
        }
      }
    );
  }

  // 성공 효과 함수
  function showHitEffect(laneIndex) {
    const lane = $(".lane").eq(laneIndex);
    const laneOffset = lane.position();

    const effect = $("<div class='hit-effect'>").css({
      left: laneOffset.left + lane.width() / 2 - 30 + "px",
      top: $("#game-container").height() - 120 + "px",
    });

    $("body").append(effect);
    setTimeout(() => effect.remove(), 400);
  }

  // 노트 판정 함수
  function checkNote(lane) {
    if (!gameActive) return;

    const judgeLine = $("#game-container").height() - 80;
    let hitNote = false;

    $(".note").each(function () {
      if ($(this).data("lane") === lane && !hitNote) {
        const notePos = $(this).position().top + 25;

        if (Math.abs(notePos - judgeLine) < 50) {
          $(this).stop().remove();
          score++;
          $("#score").text(score);

          showHitEffect(lane);

          $(".key").eq(lane).addClass("perfect");
          setTimeout(() => $(".key").eq(lane).removeClass("perfect"), 300);

          hitNote = true;
          return false;
        }
      }
    });
  }

  // 키보드 입력 처리
  $(document).keydown(function (e) {
    if (!gameActive) return;

    const key = e.key.toLowerCase();

    if (!keyMap.hasOwnProperty(key)) {
      return;
    }

    const lane = keyMap[key];
    checkNote(lane);

    $(".key").eq(lane).addClass("pressed");
    setTimeout(() => $(".key").eq(lane).removeClass("pressed"), 100);
  });

  // 터치 입력 처리 - 이벤트 위임 사용
  $(document).on("touchstart", ".key", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!gameActive) return;

    const lane = $(this).parent().index();
    checkNote(lane);

    $(this).addClass("pressed");
    setTimeout(() => $(this).removeClass("pressed"), 100);
  });

  // 마우스 클릭 처리
  $(document).on("mousedown", ".key", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!gameActive) return;

    const lane = $(this).parent().index();
    checkNote(lane);

    $(this).addClass("pressed");
    setTimeout(() => $(this).removeClass("pressed"), 100);
  });

  // 터치 끝 이벤트
  $(document).on("touchend touchcancel", ".key", function (e) {
    e.preventDefault();
  });

  // 게임 시작 버튼
  $("#startBtn").on("touchstart click", function (e) {
    e.preventDefault();
    if (!gameActive && timeLeft > 0) {
      startGame();
    }
  });
});

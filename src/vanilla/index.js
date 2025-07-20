// HTMLでLIFFのSDKを読み込んでいるため、ここでのimportは不要
// import liff from "@line/liff";

document.addEventListener("DOMContentLoaded", function () {
  // ===== LIFF初期化 =====
  liff
    .init({ liffId: "2007755942-oQ4lzEn9" })
    .then(() => console.log("✅ LIFF OK"))
    .catch((e) => console.error("❌ LIFF NG", e));

  // ===== 要素取得 =====
  const registrationSection = document.getElementById("registrationSection");
  const purchaseSection = document.getElementById("purchaseSection");
  const nameInput = document.getElementById("nameInput");
  const employeeIdInput = document.getElementById("employeeIdInput");
  const submitButton = document.getElementById("submitButton");
  const statusMessage = document.getElementById("statusMessage");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const logoutButton = document.getElementById("logoutButton");

  const gasWebAppUrl =
    "https://script.google.com/macros/s/AKfycbwv7QqlYbC870ssiOsMYljs1ZsLRyM03mBWpixSBTAp_SrHbtFLHBYHANojlBdQ2qf5JQ/exec";

  // ===== 関数定義 =====

  /** ページ表示を切り替える関数 */
  function showPage(pageName) {
    const userName = localStorage.getItem("userName");
    const employeeId = localStorage.getItem("employeeId");

    if (pageName === "purchase" && userName && employeeId) {
      userNameDisplay.textContent = userName; // 購入ページに名前を表示
      registrationSection.style.display = "none";
      purchaseSection.style.display = "flex"; // flexで表示
    } else {
      registrationSection.style.display = "flex";
      purchaseSection.style.display = "none";
    }
  }

  // ===== イベントリスナー =====

  // 登録ボタンの処理
  submitButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const employeeId = employeeIdInput.value.trim();

    if (!name || !employeeId) {
      statusMessage.textContent = "名前と社員番号を入力してください。";
      statusMessage.className = "error";
      return;
    }

    // ここではGASに送信せず、情報を保存してページを切り替えるだけ
    localStorage.setItem("userName", name);
    localStorage.setItem("employeeId", employeeId);

    statusMessage.textContent = "✅ 情報を記憶しました！";
    statusMessage.className = "success";

    // 0.5秒後に購入ページへ遷移
    setTimeout(() => {
      showPage("purchase");
    }, 500);
  });

  // ログアウト（情報削除）ボタンの処理
  logoutButton.addEventListener("click", () => {
    if (confirm("記憶した情報を削除して、入力画面に戻りますか？")) {
      localStorage.removeItem("userName");
      localStorage.removeItem("employeeId");
      showPage("registration");
    }
  });

  // ===== 初期化処理 =====

  // ページ読み込み時に、情報が保存されていれば購入ページを直接表示
  const savedId = localStorage.getItem("employeeId");
  if (savedId) {
    showPage("purchase");
  } else {
    showPage("registration");
  }
});

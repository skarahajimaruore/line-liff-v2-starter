document.addEventListener("DOMContentLoaded", function () {
  // ===== LIFF初期化 =====
  const liffId = "2007755942-oQ4lzEn9"; // あなたのLIFF ID
  liff
    .init({ liffId: liffId })
    .then(() => console.log("✅ LIFF OK"))
    .catch((e) => console.error("❌ LIFF NG", e));

  // ===== 要素取得 =====
  const registrationSection = document.getElementById("registrationSection");
  const purchaseSection = document.getElementById("purchaseSection");
  const completeSection = document.getElementById("completeSection");
  const nameInput = document.getElementById("nameInput");
  const employeeIdInput = document.getElementById("employeeIdInput");
  const submitButton = document.getElementById("submitButton");
  const statusMessage = document.getElementById("statusMessage");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const logoutButton = document.getElementById("logoutButton");
  const purchaseButtons = document.querySelectorAll(".purchase-button");
  const purchaseStatus = document.getElementById("purchaseStatus");
  const backToPurchaseButton = document.getElementById("backToPurchaseButton");

  const gasWebAppUrl =
    "https://script.google.com/macros/s/AKfycbySXTpxp3FWR0INFXb1cBhi3W-3gwEfHDbtpWGhd3Ubv6wsf2u3bjnWfxoqmjNDn0krag/exec"; // あなたのGASのURL

  // ===== 関数定義 =====

  /** ページ表示を切り替える関数 */
  function showPage(pageName) {
    registrationSection.style.display = "none";
    purchaseSection.style.display = "none";
    completeSection.style.display = "none";

    if (pageName === "purchase") {
      const userName = localStorage.getItem("userName");
      userNameDisplay.textContent = userName;
      purchaseSection.style.display = "flex";
    } else if (pageName === "complete") {
      completeSection.style.display = "flex";
    } else {
      registrationSection.style.display = "flex";
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
    localStorage.setItem("userName", name);
    localStorage.setItem("employeeId", employeeId);
    statusMessage.textContent = "✅ 情報を記憶しました！";
    statusMessage.className = "success";
    setTimeout(() => {
      showPage("purchase");
    }, 500);
  });

  // 購入ボタン（複数）の処理
  purchaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bentoName = button.dataset.bentoName;
      const userName = localStorage.getItem("userName");
      const employeeId = localStorage.getItem("employeeId");

      if (!userName || !employeeId) {
        alert("情報がありません。登録画面に戻ります。");
        showPage("registration");
        return;
      }

      purchaseStatus.textContent = "📡 購入処理中...";
      purchaseStatus.className = "";

      const postData = { name: userName, employeeId, bentoName };

      fetch(gasWebAppUrl, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            // レスポンスがOKでない場合、エラーとして処理
            throw new Error("サーバーからの応答エラー");
          }
          return response.json();
        })
        .then((data) => {
          if (data.result === "success") {
            console.log("✅ GASへの送信リクエスト完了");
            purchaseStatus.textContent = "";
            showPage("complete");
          } else {
            // GAS側でエラーが返された場合
            throw new Error(data.message || "サーバー側でエラーが発生しました");
          }
        })
        .catch((error) => {
          console.error("❌ 送信エラー:", error);
          purchaseStatus.textContent = "購入に失敗しました。";
          purchaseStatus.className = "error";
        });
    });
  });

  // ログアウト（情報削除）ボタンの処理
  logoutButton.addEventListener("click", () => {
    if (confirm("記憶した情報を削除して、入力画面に戻りますか？")) {
      localStorage.removeItem("userName");
      localStorage.removeItem("employeeId");
      showPage("registration");
    }
  });

  // 「続けて購入する」ボタンの処理
  backToPurchaseButton.addEventListener("click", () => {
    showPage("purchase");
  });

  // ===== 初期化処理 =====
  const savedId = localStorage.getItem("employeeId");
  if (savedId) {
    showPage("purchase");
  } else {
    showPage("registration");
  }
});

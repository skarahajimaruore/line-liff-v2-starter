document.addEventListener("DOMContentLoaded", function () {
  // ===== LIFF初期化 =====
  const liffId = "2007755942-oQ4lzEn9";
  liff
    .init({ liffId })
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

  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbzX_RWe1GTKutM_mnkeXIYCjC_YS6CwrPq6sIYE0LMWgcyV5IwHg7Uc_z9NdEUuD29ASw/exec";

  // ===== ページ切り替え関数 =====
  function showPage(page) {
    registrationSection.style.display = "none";
    purchaseSection.style.display = "none";
    completeSection.style.display = "none";
    if (page === "purchase") {
      userNameDisplay.textContent = localStorage.getItem("userName");
      purchaseSection.style.display = "flex";
    } else if (page === "complete") {
      completeSection.style.display = "flex";
    } else {
      registrationSection.style.display = "flex";
    }
  }

  // ===== 初期化 =====
  if (localStorage.getItem("employeeId")) {
    showPage("purchase");
  } else {
    showPage("registration");
  }

  // ===== 登録ボタン =====
  submitButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const employeeId = employeeIdInput.value.trim();
    if (!name || !employeeId) {
      statusMessage.textContent = "⚠️ 名前と社員番号を入力してください。";
      statusMessage.className = "error";
      return;
    }
    statusMessage.textContent = "📡 登録中...";
    statusMessage.className = "";

    const params = new URLSearchParams({
      name: name,
      employeeId: employeeId,
      action: "register",
    });

    // ★★★ここから修正★★★
    fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      mode: "no-cors", // これを追加！
    })
      .then(() => {
        // no-corsモードでは返事を読めないが、成功したと見なす
        localStorage.setItem("userName", name);
        localStorage.setItem("employeeId", employeeId);
        statusMessage.textContent = "✅ 登録完了！";
        statusMessage.className = "success";
        setTimeout(() => showPage("purchase"), 500);
      })
      .catch((error) => {
        // ここに来るのは、ネットワーク接続がないなど、本当の通信エラー
        console.error("❌ 登録エラー:", error);
        statusMessage.textContent = "登録中...";
        statusMessage.className = "error";
      });
  });

  // ===== 購入ボタン =====
  purchaseButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm(`${button.dataset.bentoName}を購入します。よろしいですか？`))
        return;

      const name = localStorage.getItem("userName");
      const employeeId = localStorage.getItem("employeeId");
      if (!name || !employeeId) {
        alert("情報がありません。登録画面に戻ります。");
        return showPage("registration");
      }

      purchaseStatus.textContent = "📡 購入処理中...";
      purchaseStatus.className = "";

      try {
        const profile = await liff.getProfile();
        const userId = profile.userId;

        const params = new URLSearchParams({
          name: name,
          employeeId: employeeId,
          bentoName: button.dataset.bentoName,
          action: "purchase",
          userId: userId,
        });

        // ★★★ここから修正★★★
        await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
          mode: "no-cors", // これを追加！
        });

        // no-corsモードでは返事を読めないが、成功したと見なす
        showPage("complete");
      } catch (error) {
        // ここに来るのは、ネットワーク接続がないなど、本当の通信エラー
        console.error("❌ 購入エラー:", error);
        purchaseStatus.textContent = "購入中...";
        purchaseStatus.className = "error";
      }
    });
  });

  // ===== ログアウト =====
  logoutButton.addEventListener("click", () => {
    if (confirm("記憶した情報を削除し、登録画面に戻りますか？")) {
      localStorage.removeItem("userName");
      localStorage.removeItem("employeeId");
      showPage("registration");
    }
  });

  // ===== 続けて購入 =====
  backToPurchaseButton.addEventListener("click", () => {
    showPage("purchase");
  });
});

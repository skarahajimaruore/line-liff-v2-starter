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
    "https://script.google.com/macros/s/AKfycbzViDXLNvEERltScVltA3SBESD7MMpiPrN2byIt8chcZYlxr43Qa1aUUHsA14Si3dFG-Q/exec";

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

    fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("サーバー応答エラー：" + response.status);
        return response.json();
      })
      .then((data) => {
        if (data.result === "success") {
          localStorage.setItem("userName", name);
          localStorage.setItem("employeeId", employeeId);
          statusMessage.textContent = "✅ 登録完了！";
          statusMessage.className = "success";
          setTimeout(() => showPage("purchase"), 500);
        } else {
          throw new Error(data.message || "サーバー側エラー");
        }
      })
      .catch((error) => {
        console.error("❌ 登録エラー:", error);
        statusMessage.textContent = "登録に失敗しました。";
        statusMessage.className = "error";
      });
  });

  // ===== 購入ボタン =====
  purchaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bentoName = button.dataset.bentoName;
      const name = localStorage.getItem("userName");
      const employeeId = localStorage.getItem("employeeId");
      if (!name || !employeeId) {
        alert("情報がありません。登録画面に戻ります。");
        return showPage("registration");
      }

      purchaseStatus.textContent = "📡 購入処理中...";
      purchaseStatus.className = "";

      const params = new URLSearchParams({
        name: name,
        employeeId: employeeId,
        bentoName: bentoName,
        action: "purchase",
      });

      fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error("サーバー応答エラー：" + response.status);
          return response.json();
        })
        .then((data) => {
          if (data.result === "success") {
            showPage("complete");
          } else {
            throw new Error(data.message || "サーバー側エラー");
          }
        })
        .catch((error) => {
          console.error("❌ 購入エラー:", error);
          purchaseStatus.textContent = "購入に失敗しました。";
          purchaseStatus.className = "error";
        });
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

import "./index.css";
import liff from "@line/liff";

document.addEventListener("DOMContentLoaded", function () {
  liff
    .init({ liffId: "2007755942-oQ4lzEn9" })
    .then(() => {
      console.log("✅ LIFF初期化成功！");
    })
    .catch((error) => {
      console.error("❌ LIFF初期化エラー:", error);
    });

  // HTMLの要素を取得
  const submitButton = document.getElementById("submitButton");
  const nameInput = document.getElementById("nameInput");
  const employeeIdInput = document.getElementById("employeeIdInput");
  const statusMessage = document.getElementById("statusMessage");

  if (!submitButton || !nameInput || !employeeIdInput || !statusMessage) {
    console.error(
      "❌ HTML内の要素取得に失敗しました。IDを再確認してください。"
    );
    return;
  }

  // --- 修正点①：localStorageから保存された情報を読み込む ---
  const savedName = localStorage.getItem("userName");
  const savedId = localStorage.getItem("employeeId");
  if (savedName) {
    nameInput.value = savedName;
  }
  if (savedId) {
    employeeIdInput.value = savedId;
  }
  // ----------------------------------------------------

  const gasWebAppUrl =
    "https://script.google.com/macros/s/AKfycbwv7QqlYbC870ssiOsMYljs1ZsLRyM03mBWpixSBTAp_SrHbtFLHBYHANojlBdQ2qf5JQ/exec";

  const spreadsheetUrl =
    "https://docs.google.com/spreadsheets/d/1y2iUmjSh3_Z9PsekwyTZlSxRwvPwQq-_qi4ajsW6POg/edit?gid=0#gid=0";

  // 送信ボタンがクリックされたときの処理
  submitButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const employeeId = employeeIdInput.value.trim();

    if (!name || !employeeId) {
      statusMessage.textContent = "名前と社員番号を入力してください。";
      statusMessage.style.color = "red";
      console.warn("⚠️ 入力不足：両方の項目が必要です。");
      return;
    }

    const postData = {
      name,
      employeeId,
    };

    statusMessage.textContent = "送信中...";
    statusMessage.style.color = "black";
    console.log("📤 データ送信中...", postData);

    fetch(gasWebAppUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        console.log("📬 fetch完了（status:", response.status, "）");
        if (response.ok) {
          return response.json();
        }
        throw new Error("❌ サーバー応答が異常（" + response.status + "）");
      })
      .then((data) => {
        console.log("📦 レスポンス:", data);
        if (data.result === "success") {
          // --- 修正点②：送信成功時にlocalStorageへ情報を保存 ---
          localStorage.setItem("userName", name);
          localStorage.setItem("employeeId", employeeId);

          statusMessage.textContent = "送信完了！次回から入力不要です。";
          statusMessage.style.color = "green";
          // ---------------------------------------------------

          console.log("✅ スプレッドシートに記録完了！");
          console.log("📝 スプレッドシートを確認: " + spreadsheetUrl);
        } else {
          statusMessage.textContent = "送信に失敗しました（サーバー側）";
          statusMessage.style.color = "red";
          console.error("⚠️ GAS側エラー:", data);
        }
      })
      .catch((error) => {
        console.error("❌ 通信エラー:", error);
        statusMessage.textContent = "送信中...";
        statusMessage.style.color = "gray";
      });
  });
});

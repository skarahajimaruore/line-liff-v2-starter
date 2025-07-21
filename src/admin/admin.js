// 管理画面用JS
document.addEventListener("DOMContentLoaded", () => {
  const GAS_URL =
    "https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbzBFGLZaEJ_UZHJvx-LLxZ2EQKWWLTE1se1B1e-qNw_Kt6kX_JF3ilflG28WFQtpLp0bg/exec/exec";
  const tbody = document.getElementById("orderTableBody");
  const errorEl = document.getElementById("errorMsg");

  // 1) 注文済みのデータを取得する
  fetch(`${GAS_URL}?action=list`)
    .then((res) => res.json())
    .then((data) => {
      if (data.result !== "success") throw new Error(data.message);
      data.orders.forEach(
        ({ rowIndex, timestamp, employeeId, name, bentoName, status }) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td>${timestamp}</td>
          <td>${employeeId}</td>
          <td>${name}</td>
          <td>${bentoName}</td>
          <td>${status}</td>
          <td><button class="complete-btn">提供完了</button></td>
        `;
          // rowIndexを属性に保存
          tr.querySelector(".complete-btn").dataset.row = rowIndex;
          tbody.appendChild(tr);
        }
      );
    })
    .catch((err) => (errorEl.textContent = err.message));

  // 2) 「提供完了」ボタン押下時の処理
  tbody.addEventListener("click", (e) => {
    if (!e.target.matches(".complete-btn")) return;
    const btn = e.target;
    const rowIndex = btn.dataset.row;
    btn.disabled = true;
    btn.textContent = "処理中…";

    const params = new URLSearchParams({ action: "complete", row: rowIndex });
    fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.result !== "success") throw new Error(res.message);
        // ステータス列を書き換え
        btn.closest("tr").children[4].textContent = "提供済み";
        btn.remove(); // ボタンを消す
      })
      .catch((err) => {
        errorEl.textContent = "更新失敗: " + err.message;
        btn.disabled = false;
        btn.textContent = "提供完了";
      });
  });
});

# 頁面說明

本系統為簡易的資料庫查詢系統，用於統計捐款資料。<br />
包含四個頁面，分別為登入、查詢、編輯關聯與上傳資料。<br />
有簡易 RWD 功能，可在不同裝置上正常顯示。

以下是各頁面的截圖及說明。<br />
包含所有可能的錯誤訊息。

<details>
<summary>登入頁面</summary>

使用者可以輸入帳號密碼進行登入，若帳號密碼正確，則會導向查詢頁面。<br />
![登入頁面](p_login.png)

若帳號密碼錯誤，則會顯示登入失敗訊息。<br />
![登入失敗](p_login_failed.png)

</details>

---

<details>
<summary>查詢頁面</summary>

使用者可以輸入捐款者姓名，並查詢資料庫中的資料。<br />
![查詢頁面](p_search.png)

查詢成功時，資料將會顯示在下方的欄位中。<br />
![查詢成功](p_search_success.png)

若資料庫中無此捐款者，則會顯示查無此人訊息。<br />
![查無此人](p_search_failed.png)

</details>

---

<details>
<summary>編輯關聯頁面</summary>

使用者可以編輯捐款者與其他捐款者的關聯，此欄位為樹狀結構。<br />
![編輯關聯頁面](p_relation.png)

若資料庫中發現捐款者，將會在下方預覽頁顯示該捐款者關聯。<br />
![預覽關聯Ｇ](p_relation_graph_1.png)
![預覽關聯Ｇ](p_relation_graph_2.png)

預設為樹狀圖模式，可以點擊右方的按鈕切換為表格模式。<br />
![預覽關聯Ｔ](p_relation_table_1.png)
![預覽關聯Ｔ](p_relation_table_2.png)

若發生循環關聯，則會顯示為下列形式。<br />
![循環關聯](p_relation_cycle_g.png)
![循環關聯](p_relation_cycle_t.png)

若欄位名稱重複，將會顯示錯誤訊息。<br />
![重複名稱](p_relation_duplicate.png)

若資料庫中無此捐款者，則會顯示查無此人訊息。<br />
![查無此人](p_relation_failed_1.png)
![查無此人](p_relation_failed_2.png)

</details>

---

<details>
<summary>上傳資料頁面</summary>

使用者可以上傳捐款者的資料，資料格式為 Excel 檔案。本頁面包含資料匯出及重設資料庫功能。<br />
重設資料庫將會刪除所有捐款紀錄及未加入關聯之捐款者資料，已加入關聯之捐款者資料將會保留。<br />
![上傳資料頁面](p_upload.png)

上傳資料時，將會顯示訊息。<br />
![上傳訊息](p_upload_success.png)
![上傳訊息](p_upload_failed_1.png)
![上傳訊息](p_upload_failed_2.png)

重設資料庫時，將會顯示確認視窗。<br />
![重設確認視窗](p_upload_reset.png)

</details>

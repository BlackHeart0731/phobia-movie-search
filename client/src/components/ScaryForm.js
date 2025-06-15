import React, { useState } from "react";
import styles from "./ScaryForm.module.css";

const fearOptions = [
  "高所","閉所","暗所","蜘蛛","蝶","蟻","昆虫","蛙","ヘビ","集合体",
  "血液描写","水・溺水","雷","嘔吐","注射・先端","ピエロ","幽霊・超常現象",
  "性的シーン","死体","その他（自由記述）"
];

const ScaryForm = ({ onAdd }) => {
  const [selectedFears, setSelectedFears] = useState([]);
  const [otherText, setOtherText] = useState("");
  const [detail, setDetail] = useState("");
  const [time, setTime] = useState("");

  const toggleFear = (fear) => {
    if (selectedFears.includes(fear)) {
      setSelectedFears(selectedFears.filter(f => f !== fear));
    } else {
      setSelectedFears([...selectedFears, fear]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!detail.trim()) {
      alert("詳細は必須です");
      return;
    }

    const types = [...selectedFears];
    if (otherText.trim()) types.push(otherText.trim());

    const report = { types, detail, time: time.trim() };

    try {
      const response = await fetch("https://phobia-api.kuroiha.workers.dev/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });

      console.log("response.status:", response.status);
      console.log("response.ok:", response.ok);

      // eslint-disable-next-line no-unused-vars
      const data = await response.json();

      if (response.ok) {
        alert("恐怖要素を報告しました！");
        setSelectedFears([]);
        setOtherText("");
        setDetail("");
        setTime("");
        if (onAdd) onAdd(report);
      } else {
        alert("送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch (error) {
      alert("通信エラーが発生しました");
      console.error(error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>恐怖要素を報告する</h4>
      <div className={styles.checkboxGrid}>
        {fearOptions.map(fear => (
          <label key={fear} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedFears.includes(fear)}
              onChange={() => toggleFear(fear)}
            />
            {fear}
          </label>
        ))}
      </div>
      <input
        type="text"
        placeholder="その他（自由記述）"
        value={otherText}
        onChange={e => setOtherText(e.target.value)}
        className={styles.inputText}
      />
      <input
        type="text"
        placeholder="詳細（必須）"
        value={detail}
        onChange={e => setDetail(e.target.value)}
        required
        className={styles.inputText}
      />
      <input
        type="text"
        placeholder="出現時間（任意） 例: 01:23"
        value={time}
        onChange={e => setTime(e.target.value)}
        className={styles.inputText}
      />
      <button type="submit" className={styles.submitButton}>追加する</button>
    </form>
  );
};

export default ScaryForm;

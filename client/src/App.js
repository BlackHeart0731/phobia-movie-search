import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryList from "./components/CategoryList";
import MovieList from "./components/MovieList";
import LoadMoreButton from "./components/LoadMoreButton";
import Footer from "./components/Footer";
import MovieModal from "./components/MovieModal";
import cinecaptionTTF from "./fonts/cinecaption226.ttf";
import playfairDisplayTTF from "./fonts/PlayfairDisplay-VariableFont_wght.ttf";
import "./styles.css";
import "./App.css";

// APIのベースURLは環境変数から取得（.envにREACT_APP_API_BASE_URL=http://localhost:3001など記載）
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 重複チェック関数は変更なし
const isDuplicateReport = (existingReports, newReport) => {
  return existingReports.some((report) => {
    if (report.types.length !== newReport.types.length) return false;

    const set1 = new Set(report.types);
    const set2 = new Set(newReport.types);
    for (const t of set1) {
      if (!set2.has(t)) return false;
    }

    if (report.detail.trim() !== newReport.detail.trim()) return false;
    if ((report.time || "").trim() !== (newReport.time || "").trim()) return false;

    const id1 = report.movieId || "";
    const id2 = newReport.movieId || "";
    if (id1 !== id2) return false;

    return true;
  });
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("upcoming");
  const [visibleCount, setVisibleCount] = useState(8);

  // モーダル管理用state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMovieId, setModalMovieId] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  // 恐怖要素一覧用state
  const [fearReports, setFearReports] = useState([]);

  // フォントの動的読み込み（初回マウント時のみ）
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'Cinecaption';
        src: url(${cinecaptionTTF}) format("truetype");
        font-weight: normal;
        font-style: normal;
      }
      @font-face {
        font-family: 'Playfair Display';
        src: url(${playfairDisplayTTF}) format("truetype");
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 初回マウント時に恐怖要素一覧を取得（環境変数API_BASE_URL使用）
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/fear_reports`);
        if (!res.ok) throw new Error("恐怖要素一覧の取得に失敗しました");
        const data = await res.json();
        setFearReports(data);
      } catch (error) {
        console.error("恐怖要素取得エラー:", error);
      }
    };
    fetchReports();
  }, []);

  // 検索クエリ更新時
  const handleSearch = (query) => {
    setSearchQuery(query);
    setVisibleCount(8);
  };

  // カテゴリ変更時
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setSearchQuery("");
    setVisibleCount(8);
  };

  // 「もっと見る」ボタン押下時
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // モーダルを開く
  const openModalWithMovie = (id, title) => {
    setModalMovieId(id);
    setModalTitle(title);
    setModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setModalOpen(false);
    setModalMovieId(null);
    setModalTitle("");
  };

  // 恐怖要素の登録処理（MovieModalから呼ばれる）
  const handleAddFearReport = async (report) => {
    if (isDuplicateReport(fearReports, report)) {
      alert("同じ内容の恐怖要素が既に登録されています。");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/fear_reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });

      if (!res.ok) {
        throw new Error(`送信エラー: ステータスコード ${res.status}`);
      }

      await res.json();

      closeModal();

      // 送信後に最新の恐怖要素一覧を再取得して画面更新
      const updatedRes = await fetch(`${API_BASE_URL}/fear_reports`);
      if (!updatedRes.ok) throw new Error(`更新取得エラー: ステータス ${updatedRes.status}`);
      const updatedData = await updatedRes.json();
      setFearReports(updatedData);

    } catch (error) {
      alert("送信に失敗しました。時間をおいて再度お試しください。");
      console.error("恐怖要素送信エラー:", error);
    }
  };

  return (
    <div className="App">
      <Header />
      <SearchBar onSearch={handleSearch} />
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      <MovieList
        category={selectedCategory}
        query={searchQuery}
        visibleCount={visibleCount}
        onMovieClick={openModalWithMovie}
      />
      <LoadMoreButton onClick={handleLoadMore} />
      <Footer />

      <MovieModal
        isOpen={modalOpen}
        onClose={closeModal}
        movieId={modalMovieId}
        title={modalTitle}
        onAddFearReport={handleAddFearReport}
        fearReports={fearReports}
      />
    </div>
  );
}

export default App;

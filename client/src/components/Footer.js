import React, { useState } from "react";
import styles from "./Footer.module.css";
import Modal from "./Modal";

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: null });

  const openModal = (title, body) => {
    setModalContent({ title, body });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const modalData = {
    "サイト説明": (
      <>
        <p>
          「ファビアチェック」は、ファビア（恐怖症）を持つ方が映画を選ぶ際に、
          事前に恐怖要素を確認できるサイトです。
        </p>
        <p>
          様々な恐怖症（高所恐怖症、閉所恐怖症、蜘蛛恐怖症など）を持つ方が、
          安心して映画を楽しめるよう、映画に含まれる可能性のある恐怖要素を表示しています。
        </p>
        <p>
          このサイトは皆様からの情報提供によって成り立っています。映画の恐怖要素について
          知っていることがあれば、ぜひ情報を追加してください。
        </p>

        <hr style={{ margin: "1em 0" }} />

        <p><strong>※注意事項：</strong></p>
        <ul style={{ paddingLeft: "1.2em" }}>
          <li>日本で公開されていない海外の映画も含まれている場合があります。</li>
          <li>日本の公開日と海外の公開日が混在しているため、公開時期の表記に重複やズレが生じることがあります。</li>
          <li>恐怖要素の情報はユーザー投稿を中心に構成しているため、内容に差異があることがあります。</li>
        </ul>
      </>
    ),
    "免責事項": (
      <>
        <p>
          当サイトに掲載されている恐怖要素の情報は、ユーザーからの投稿に基づいています。
          情報の正確性は保証できませんので、あくまで参考程度にご利用ください。
        </p>
        <p>投稿内容は運営の判断で予告なく修正・削除する場合があります。</p>
        <p>
          映画の恐怖要素を説明する過程で、ネタバレを含む可能性があります。
          映画の内容を知りたくない方はご注意ください。
        </p>
        <p>当サイトの利用によって生じたいかなる損害についても、運営者は責任を負いません。</p>
      </>
    ),
    "プライバシーポリシー": (
      <>
        <p>
          1. 収集する情報<br />
          当サイトでは、サイト改善のために匿名の利用統計情報を収集することがあります。
          また、投稿機能を利用する際に入力された情報を保存します。
        </p>
        <p>
          2. 情報の利用目的<br />
          収集した情報は、サイトの改善、コンテンツの充実、およびユーザー体験の向上のために利用します。
        </p>
        <p>
          3. 第三者への提供<br />
          法令に基づく場合を除き、収集した個人情報を第三者に提供することはありません。
        </p>
        <p>
          4. Cookieの使用<br />
          当サイトでは、ユーザー体験向上のためにCookieを使用しています。
          ブラウザの設定でCookieを無効にすることも可能です。
        </p>
        <p>
          5. 広告について<br />
          当サイトではGoogle AdSenseを利用しており、
          ユーザーの興味に基づいた広告が表示されることがあります。
        </p>
      </>
    ),
    "投稿ガイドライン": (
      <>
        <p><strong>投稿の目的</strong><br />
          恐怖症を持つ方が安心して映画を選べるよう、正確で役立つ情報の提供にご協力ください。
        </p>
        <p><strong>投稿時の注意点</strong><br />
          ・実際に視聴した映画についてのみ投稿してください。<br />
          ・恐怖要素の詳細は具体的に記入してください（例：「高所シーンあり」ではなく「30分頃、高いビルの屋上からの視点で撮影されたシーンが約2分間続く」など）。<br />
          ・ネタバレになる可能性がある場合は、その旨を明記してください。<br />
          ・出現時間は分かる範囲で記入してください（任意）。
        </p>
        <p><strong>禁止事項</strong><br />
          ・虚偽の情報の投稿<br />
          ・映画の内容と関係のない投稿<br />
          ・誹謗中傷や差別的な表現を含む投稿<br />
          ・著作権を侵害する内容の投稿<br />
          ・広告や宣伝目的の投稿
        </p>
      </>
    ),
    "FAQ": (
      <>
        <p><strong>Q: このサイトはどのように使えばいいですか？</strong><br />
          A: 映画のタイトルを検索するか、「公開予定の映画」「上映中の映画」などのカテゴリから映画を選び、詳細ページで恐怖要素を確認できます。
        </p>
        <p><strong>Q: 恐怖要素の情報はどこから来ていますか？</strong><br />
          A: サイト利用者からの投稿情報です。より多くの方の協力で情報の質と量を高めていきます。
        </p>
        <p><strong>Q: 映画の恐怖要素情報を追加するにはどうすればいいですか？</strong><br />
          A: 映画の詳細ページにある「恐怖要素を追加」ボタンから投稿できます。
        </p>
        <p><strong>Q: 間違った情報を見つけた場合はどうすればいいですか？</strong><br />
          A: お問い合わせフォームから報告してください。確認の上、修正対応いたします。
        </p>
        <p><strong>Q: 探している映画が見つからない場合は？</strong><br />
          A: 正確なタイトルで検索してみてください。それでも見つからない場合は、TMDBのデータベースにまだ登録されていない可能性があります。
        </p>
      </>
    ),
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        {/* ホームもリンクだけどボタン風にしたいならclassNameをlinkButtonに */}
        <a href="/" className={styles.linkButton}>ホーム</a>

        {Object.entries(modalData).map(([title, body]) => (
          <button
            key={title}
            className={styles.linkButton}
            onClick={() => openModal(title, body)}
            type="button"
          >
            {title}
          </button>
        ))}

        {/* お問い合わせもボタン風のaタグに */}
        <a
          href="https://same-sunflower-d44.notion.site/20d0d0e1f57b80bd9af2c6e925aa0c20"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkButton}
        >
          お問い合わせ
        </a>
      </nav>

      <div className={styles.copyRight}>
        <small>© 2025 ファビアチェック All Rights Reserved.</small><br />
        <small>This product uses the TMDB API but is not endorsed or certified by TMDB.</small>
        <div className={styles.tmdbLogo}>
          <img src="/TMDB.svg" alt="TMDB Logo" style={{ width: "100px", height: "auto" }} />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={modalContent.title}>
        <div style={{ textAlign: "left" }}>{modalContent.body}</div>
      </Modal>
    </footer>
  );
};

export default Footer;

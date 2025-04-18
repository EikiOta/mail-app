// src/components/Navigation.js
import React from 'react';

const Navigation = ({ currentPage, onPageChange }) => {
  // ページ遷移時に画面上部にスクロール
  const handlePageChange = (page, e) => {
    e.preventDefault();
    window.scrollTo(0, 0); // 画面上部にスクロール
    onPageChange(page);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a 
          href="#" 
          className="navbar-brand" 
          onClick={(e) => handlePageChange('home', e)}
        >
          メール一斉送信
        </a>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={(e) => handlePageChange('home', e)}
            >
              ホーム
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'mail-compose' ? 'active' : ''}`}
              onClick={(e) => handlePageChange('mail-compose', e)}
            >
              メール作成
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
              onClick={(e) => handlePageChange('settings', e)}
            >
              設定
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'logs' ? 'active' : ''}`}
              onClick={(e) => handlePageChange('logs', e)}
            >
              送信ログ
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
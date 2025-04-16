// src/components/Navigation.js
import React from 'react';

const Navigation = ({ currentPage, onPageChange }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a 
          href="#" 
          className="navbar-brand" 
          onClick={(e) => {
            e.preventDefault();
            onPageChange('home');
          }}
        >
          メール一斉送信システム
        </a>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange('home');
              }}
            >
              ホーム
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'mail-compose' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange('mail-compose');
              }}
            >
              メール作成
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange('settings');
              }}
            >
              設定
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'logs' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange('logs');
              }}
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
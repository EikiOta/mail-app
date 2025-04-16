// src/components/common/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  // ページ番号配列を生成
  const getPageNumbers = () => {
    const maxPageDisplay = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
    const endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="pagination">
      {/* 前へボタン */}
      <div 
        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        前へ
      </div>
      
      {/* ページ番号 */}
      {getPageNumbers().map(pageNum => (
        <div
          key={pageNum}
          className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </div>
      ))}
      
      {/* 次へボタン */}
      <div 
        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        次へ
      </div>
    </div>
  );
};

export default Pagination;
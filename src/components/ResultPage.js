// src/components/ResultPage.js
import React from 'react';

const ResultPage = ({ result, recipients, onHome, onNewMail }) => {
  const { totalCount, successCount, errorCount } = result;
  
  // 現在の日時を取得
  const now = new Date();
  
  // 送信結果の詳細テーブルを描画
  const renderResultDetails = () => {
    return (
      <table className="recipients-table">
        <thead>
          <tr>
            <th width="5%">#</th>
            <th width="15%">宛先(To)</th>
            <th width="20%">会社名</th>
            <th width="15%">ステータス</th>
            <th width="25%">送信日時</th>
          </tr>
        </thead>
        <tbody>
          {recipients.map((recipient, index) => {
            // 送信時間をずらす（1件あたり3秒）
            const sendTime = new Date(now.getTime() + index * 3000);
            const sendTimeStr = sendTime.toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }).replace(/\//g, '/');
            
            // ランダムに成功かエラーかを決定（現実的には成功率の高いものをシミュレート）
            const isSuccess = index < successCount;
            
            return (
              <tr key={recipient.id}>
                <td>{index + 1}</td>
                <td>{recipient.name}</td>
                <td>{recipient.company}</td>
                <td>
                  <span className={`status-badge ${isSuccess ? 'success' : 'error'}`}>
                    {isSuccess ? '成功' : 'エラー'}
                  </span>
                </td>
                <td>{sendTimeStr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container" id="result-page">
      <h1>送信結果</h1>
      
      <div className="result-summary">
        <div className="result-count">{successCount} / {totalCount} 件送信完了</div>
        <div className="result-description" style={{ color: errorCount === 0 ? '#27ae60' : '#e74c3c' }}>
          {errorCount === 0 
            ? 'すべてのメールが正常に送信されました'
            : `${errorCount}件のメールでエラーが発生しました`}
        </div>
      </div>
      
      <div className="result-details">
        {renderResultDetails()}
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>パスワード通知メールも送信されました (ZIP圧縮ファイル用)</strong>
        </div>
        <button className="action-btn" onClick={onHome}>ホームに戻る</button>
        <button className="action-btn" onClick={onNewMail} style={{ marginLeft: '10px' }}>
          新規メール作成
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
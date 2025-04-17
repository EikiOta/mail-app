// src/components/ResultPage.js
import React from 'react';

const ResultPage = ({ result, recipients, onHome, onNewMail }) => {
  const { totalCount, successCount, errorCount } = result;
  
  // パスワード通知メールの結果を計算（実際のシステムではresultオブジェクトから取得する）
  const passwordEmailCount = recipients.filter(r => r.compressionSettings?.sendPasswordEmail).length;
  const passwordEmailSuccessCount = Math.floor(passwordEmailCount * 0.95); // デモ用：95%成功と仮定
  const passwordEmailErrorCount = passwordEmailCount - passwordEmailSuccessCount;
  
  // 総合の送信数（メール本文 + パスワード通知メール）
  const totalSendCount = totalCount + passwordEmailCount;
  const totalSuccessCount = successCount + passwordEmailSuccessCount;
  const totalErrorCount = errorCount + passwordEmailErrorCount;
  
  // 現在の日時を取得
  const now = new Date();
  
  // 送信結果の詳細テーブルを描画
  const renderResultDetails = () => {
    return (
      <table className="recipients-table">
        <thead>
          <tr>
            <th width="5%">#</th>
            <th width="12%">宛先(To)</th>
            <th width="15%">会社名</th>
            <th width="15%">本文メール</th>
            <th width="15%">パスワードメール</th>
            <th width="20%">送信日時</th>
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
            
            // ランダムに成功かエラーかを決定（本文メール）
            const isSuccess = index < successCount;
            
            // ランダムに成功かエラーかを決定（パスワード通知メール）
            const needsPasswordEmail = recipient.compressionSettings?.sendPasswordEmail || Math.random() > 0.5; // デモ用
            const passwordEmailSuccess = needsPasswordEmail && Math.random() > 0.05; // 95%の確率で成功
            
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
                <td>
                  {needsPasswordEmail ? (
                    <span className={`status-badge ${passwordEmailSuccess ? 'success' : 'error'}`}>
                      {passwordEmailSuccess ? '成功' : 'エラー'}
                    </span>
                  ) : (
                    <span className="status-badge" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
                      なし
                    </span>
                  )}
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
        <div className="result-cards">
          <div className="result-card">
            <h3>本文メール</h3>
            <div className="result-count">{successCount} / {totalCount} 件送信完了</div>
            <div className="result-description" style={{ color: errorCount === 0 ? '#27ae60' : '#e74c3c' }}>
              {errorCount === 0 
                ? 'すべてのメールが正常に送信されました'
                : `${errorCount}件のメールでエラーが発生しました`}
            </div>
          </div>
          
          {passwordEmailCount > 0 && (
            <div className="result-card">
              <h3>パスワード通知メール</h3>
              <div className="result-count">{passwordEmailSuccessCount} / {passwordEmailCount} 件送信完了</div>
              <div className="result-description" style={{ color: passwordEmailErrorCount === 0 ? '#27ae60' : '#e74c3c' }}>
                {passwordEmailErrorCount === 0 
                  ? 'すべてのメールが正常に送信されました'
                  : `${passwordEmailErrorCount}件のメールでエラーが発生しました`}
              </div>
            </div>
          )}
          
          <div className="result-card" style={{ backgroundColor: '#f8f9fa', border: '2px solid #3498db' }}>
            <h3>合計送信数</h3>
            <div className="result-count">{totalSuccessCount} / {totalSendCount} 件</div>
            <div className="result-description" style={{ color: totalErrorCount === 0 ? '#27ae60' : '#e74c3c' }}>
              {totalErrorCount === 0 
                ? 'すべてのメールが正常に送信されました'
                : `合計${totalErrorCount}件のメールでエラーが発生しました`}
            </div>
          </div>
        </div>
      </div>
      
      <div className="result-details">
        <h2>送信詳細</h2>
        {renderResultDetails()}
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button className="action-btn" onClick={onHome}>ホームに戻る</button>
        <button className="action-btn" onClick={onNewMail} style={{ marginLeft: '10px' }}>
          新規メール作成
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
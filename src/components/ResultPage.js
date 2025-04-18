// src/components/ResultPage.js
import React from 'react';

const ResultPage = ({ result, recipients, onHome, onNewMail }) => {
  const { totalCount, successCount, errorCount, canceled, processedCount } = result;
  
  // メールデータから圧縮設定やパスワード設定を取得
  // 最初の受信者から設定情報を取得する
  const compressionSettings = recipients.length > 0 && recipients[0].compressionSettings 
    ? recipients[0].compressionSettings 
    : { type: 'none', sendPasswordEmail: false };
  
  // パスワード通知メールの必要性をチェック
  const needsPasswordEmails = compressionSettings.type === 'password' && compressionSettings.sendPasswordEmail;
  
  // パスワード通知メールの送信数を計算
  const passwordEmailCount = needsPasswordEmails ? (canceled ? processedCount : totalCount) : 0;
  
  // 成功率と同じ比率でパスワードメールの成功/エラー数を計算
  const successRate = totalCount > 0 ? successCount / totalCount : 0;
  const passwordEmailSuccessCount = Math.round(passwordEmailCount * successRate);
  const passwordEmailErrorCount = passwordEmailCount - passwordEmailSuccessCount;
  
  // 総合の送信数（メール本文 + パスワード通知メール）
  const totalSendCount = (canceled ? processedCount : totalCount) + passwordEmailCount;
  const totalSuccessCount = successCount + passwordEmailSuccessCount;
  const totalErrorCount = errorCount + passwordEmailErrorCount;
  
  // 現在の日時を取得
  const now = new Date();
  
  // 送信結果の詳細テーブルを描画
  const renderResultDetails = () => {
    return (
      <div className="table-container" style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '20px' }}>
        <table className="recipients-table">
          <thead>
            <tr>
              <th width="5%">No</th>
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
              
              // 中止時は処理済みの件数までを「成功」とする
              const isSuccess = canceled ? (index < processedCount) : (index < successCount);
              // 中止された場合は、処理されていない件数は表示しない
              if (canceled && index >= processedCount) {
                return null;
              }
              
              return (
                <tr key={recipient.id || index}>
                  <td>{index + 1}</td>
                  <td>{recipient.name}</td>
                  <td>{recipient.company}</td>
                  <td>
                    <span className={`status-badge ${isSuccess ? 'success' : 'error'}`}>
                      {isSuccess ? '成功' : 'エラー'}
                    </span>
                  </td>
                  <td>
                    {needsPasswordEmails ? (
                      <span className={`status-badge ${isSuccess ? 'success' : 'error'}`}>
                        {isSuccess ? '成功' : 'エラー'}
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
            }).filter(Boolean)}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container" id="result-page">
      <h1>送信結果</h1>
      
      {canceled && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '6px', 
          marginBottom: '20px', 
          border: '1px solid #ffeeba',
          color: '#856404'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '16px' }}>送信が中止されました</div>
          <div>送信処理は途中で中止されました。合計{processedCount}件まで送信されました。残りの{totalCount - processedCount}件は送信されていません。</div>
        </div>
      )}
      
      <div className="result-summary">
        <div className="result-cards">
          <div className="result-card">
            <h3>本文メール</h3>
            <div className="result-count">
              {successCount} / {canceled ? processedCount : totalCount} 件送信完了
            </div>
            <div className="result-description" style={{ color: errorCount === 0 ? '#27ae60' : '#e74c3c' }}>
              {canceled 
                ? `${processedCount}件のメールが送信されました${errorCount > 0 ? `（${errorCount}件はエラー）` : ''}`
                : (errorCount === 0 
                  ? 'すべてのメールが正常に送信されました' 
                  : `${errorCount}件のメールでエラーが発生しました`)}
            </div>
          </div>
          
          {passwordEmailCount > 0 && (
            <div className="result-card">
              <h3>パスワード通知メール</h3>
              <div className="result-count">{passwordEmailSuccessCount} / {passwordEmailCount} 件送信完了</div>
              <div className="result-description" style={{ color: passwordEmailErrorCount === 0 ? '#27ae60' : '#e74c3c' }}>
                {canceled 
                  ? `${passwordEmailCount}件のパスワード通知が送信されました${passwordEmailErrorCount > 0 ? `（${passwordEmailErrorCount}件はエラー）` : ''}`
                  : (passwordEmailErrorCount === 0 
                    ? 'すべてのメールが正常に送信されました' 
                    : `${passwordEmailErrorCount}件のメールでエラーが発生しました`)}
              </div>
            </div>
          )}
          
          <div className="result-card" style={{ backgroundColor: '#f8f9fa', border: '2px solid #3498db' }}>
            <h3>合計送信数</h3>
            <div className="result-count">{totalSuccessCount} / {totalSendCount} 件</div>
            <div className="result-description" style={{ color: totalErrorCount === 0 ? '#27ae60' : '#e74c3c' }}>
              {canceled 
                ? `送信中止により、合計${totalSuccessCount}件のメールのみが送信されました${totalErrorCount > 0 ? `（${totalErrorCount}件はエラー）` : ''}`
                : (totalErrorCount === 0 
                  ? 'すべてのメールが正常に送信されました' 
                  : `合計${totalErrorCount}件のメールでエラーが発生しました`)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="result-details">
        <h2>送信詳細</h2>
        {renderResultDetails()}
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center', padding: '20px', borderTop: '1px solid #e0e0e0' }}>
        <button className="action-btn" onClick={onHome}>ホームに戻る</button>
        <button className="action-btn" onClick={onNewMail} style={{ marginLeft: '10px' }}>
          新規メール作成
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
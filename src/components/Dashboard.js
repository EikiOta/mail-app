// src/components/Dashboard.js
import React, { useState } from 'react';
import { Modal } from './common/Modal';

const Dashboard = ({ logs, onCompose, lastImportDate, onImportSync }) => {
  // 最新の4件のログのみ表示
  const recentLogs = logs.slice(0, 4);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('summary-tab');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  // ログに応じたダミーの送信先データ
  const getDummyRecipientsForLog = (log) => {
    const recipients = [];
    
    for (let i = 0; i < log.totalCount; i++) {
      // 成功/エラー状態を決定（logのsuccessCountに基づく）
      const isSuccess = i < log.successCount;
      const passwordStatus = i < log.passwordEmailSuccess ? 'success' : 'error';
      
      recipients.push({
        id: i + 1,
        name: `宛先${i + 1}`,
        company: `会社${Math.floor(i/3) + 1}`,
        department: `部署${i % 5 + 1}`,
        position: `役職${i % 4 + 1}`,
        email: `recipient${i + 1}@example.com`,
        cc: i % 3 === 0 ? [
          { id: 1001 + i, name: `CC担当者${i + 1}`, email: `cc${i + 1}@example.com` }
        ] : [],
        status: isSuccess ? 'success' : 'error',
        passwordStatus: log.passwordEmailSuccess > 0 ? passwordStatus : 'none',
        sentTime: log.date.replace(/(\d+:\d+)$/, (i % 60).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0')),
        greeting: `会社${Math.floor(i/3) + 1} 宛先${i + 1}様\n\n`
      });
    }
    
    return recipients;
  };

  // 同期処理を実行（デモ用）
  const executeSync = () => {
    setSyncing(true);
    
    // 同期処理をシミュレート（2秒後に完了）
    setTimeout(() => {
      setSyncing(false);
      setSyncComplete(true);
      
      // 同期完了時にApp.jsの同期日時を更新
      if (onImportSync) {
        onImportSync();
      }
      
      // 完了後3秒でモーダルを閉じる
      setTimeout(() => {
        setShowSyncModal(false);
      }, 3000);
    }, 2000);
  };

  // ファイル選択ダイアログを開く
  const openFileDialog = () => {
    // 実際のファイル選択アクションを実行せず、ダミー処理のみ実行
    executeSync();
  };

  // 顧客管理リストとの同期ダイアログを開く
  const openSyncDialog = () => {
    setShowSyncModal(true);
    setSyncing(false);
    setSyncComplete(false);
  };

  // ログ詳細を開く
  const openLogDetail = (log) => {
    setCurrentLog(log);
    setActiveDetailTab('summary-tab');
    setShowLogDetailModal(true);
  };

  // 詳細タブの切り替え
  const handleDetailTabChange = (tabId) => {
    setActiveDetailTab(tabId);
  };

  // 添付ファイル情報を表示
  const renderAttachmentInfo = () => {
    return (
      <div>
        <div className="attachment-item">
          <div className="attachment-icon">📄</div>
          <div className="attachment-name">スキルシート_IK_20250415.zip</div>
          <div className="attachment-size">120 KB</div>
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>設定:</strong> ZIP圧縮してパスワードを設定（パスワード: a8Xp2Z）
        </div>
      </div>
    );
  };

  // ログ詳細モーダルの内容をレンダリング
  const renderLogDetailModal = () => {
    if (!currentLog) return null;
    
    // 現在のログに対応するダミーの受信者リストを生成
    const dummyRecipients = getDummyRecipientsForLog(currentLog);
    
    return (
      <Modal onClose={() => setShowLogDetailModal(false)} fullWidth={true} maxWidth="90%">
        <div className="modal-header">
          <h3 className="modal-title">送信ログ詳細</h3>
        </div>
        
        <div className="modal-body">
          <div className="log-detail-tabs">
            <div 
              className={`log-detail-tab ${activeDetailTab === 'summary-tab' ? 'active' : ''}`} 
              onClick={() => handleDetailTabChange('summary-tab')}
            >
              概要
            </div>
            <div 
              className={`log-detail-tab ${activeDetailTab === 'recipients-tab' ? 'active' : ''}`} 
              onClick={() => handleDetailTabChange('recipients-tab')}
            >
              送信先リスト
            </div>
          </div>
          
          {/* 概要タブ */}
          <div className={`log-detail-pane ${activeDetailTab === 'summary-tab' ? 'active' : ''}`} id="summary-tab">
            <div className="log-summary-card" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: '0', color: '#2c3e50' }}>{currentLog.subject}</h3>
                <span className={`status-badge ${currentLog.status === 'success' ? 'success' : 'error'}`} style={{ fontSize: '14px' }}>
                  {currentLog.status === 'success' ? '送信完了' : 'エラーあり'}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>送信日時</div>
                    <div style={{ fontWeight: 'bold' }}>{currentLog.date}</div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>テンプレート</div>
                    <div>{currentLog.templateId === 1 ? '人材紹介メール' : currentLog.templateId === 2 ? '案件紹介メール' : ''}</div>
                  </div>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>メール送信</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{currentLog.totalCount}</span>
                        <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>合計</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#27ae60' }}>{currentLog.successCount}</span>
                        <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>成功</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#e74c3c' }}>{currentLog.errorCount}</span>
                        <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>失敗</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>パスワード通知</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#27ae60' }}>{currentLog.passwordEmailSuccess}</span>
                        <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>成功</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#e74c3c' }}>{currentLog.passwordEmailError}</span>
                        <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>失敗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">添付ファイル</div>
              <div className="log-detail-value">
                {renderAttachmentInfo()}
              </div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">処理時間</div>
              <div className="log-detail-value">9秒</div>
            </div>
          </div>
          
          {/* 送信先リストタブ */}
          <div className={`log-detail-pane ${activeDetailTab === 'recipients-tab' ? 'active' : ''}`} id="recipients-tab">
            <div className="recipients-table-container">
              <table className="recipients-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '3%' }}>No</th>
                    <th style={{ width: '10%' }}>名前</th>
                    <th style={{ width: '15%' }}>会社名</th>
                    <th style={{ width: '15%' }}>部署</th>
                    <th style={{ width: '7%' }}>役職</th>
                    <th style={{ width: '15%' }}>メールアドレス</th>
                    <th style={{ width: '15%' }}>CC</th>
                    <th style={{ width: '7%' }}>本文メール</th>
                    <th style={{ width: '7%' }}>パスワードメール</th>
                    <th style={{ width: '6%' }}>送信日時</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyRecipients.slice(0, 10).map((recipient, index) => (
                    <tr key={recipient.id}>
                      <td>{index + 1}</td>
                      <td>{recipient.name}</td>
                      <td>{recipient.company}</td>
                      <td>{recipient.department}</td>
                      <td>{recipient.position}</td>
                      <td>{recipient.email}</td>
                      <td>
                        <div className="cc-tags">
                          {recipient.cc.map((cc, ccIndex) => (
                            <span key={ccIndex} className="cc-tag">
                              {cc.name}
                            </span>
                          ))}
                          {recipient.cc.length === 0 && (
                            <span className="no-cc">なし</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${recipient.status}`}>
                          {recipient.status === 'success' ? '成功' : 'エラー'}
                        </span>
                      </td>
                      <td>
                        {recipient.passwordStatus !== 'none' ? (
                          <span className={`status-badge ${recipient.passwordStatus}`}>
                            {recipient.passwordStatus === 'success' ? '成功' : 'エラー'}
                          </span>
                        ) : (
                          <span className="status-badge" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
                            なし
                          </span>
                        )}
                      </td>
                      <td>{recipient.sentTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="action-btn" onClick={() => setShowLogDetailModal(false)}>閉じる</button>
        </div>
      </Modal>
    );
  };

  // 顧客管理リスト同期モーダルの内容をレンダリング
  const renderSyncModal = () => {
    return (
      <Modal onClose={() => !syncing && setShowSyncModal(false)}>
        <div className="modal-header">
          <h3 className="modal-title">顧客管理リストと同期</h3>
        </div>
        
        <div className="modal-body">
          {!syncing && !syncComplete ? (
            <div>
              <p>顧客管理用のExcelファイル（.xlsx）を選択してください。</p>
              <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                ※ 同期すると現在の宛先データは上書きされます。必ず最新の顧客管理リストを選択してください。
              </p>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button 
                  className="action-btn"
                  onClick={openFileDialog}
                >
                  ファイルを選択
                </button>
              </div>
            </div>
          ) : syncing ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '20px' }}>同期中...</div>
              <div className="sync-progress-container" style={{ 
                height: '10px',
                backgroundColor: '#e0e0e0',
                borderRadius: '5px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                <div className="sync-progress" style={{
                  width: '70%',
                  height: '100%',
                  backgroundColor: '#3498db',
                  animation: 'progress-animation 2s infinite',
                  backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
                  backgroundSize: '1rem 1rem'
                }}></div>
              </div>
              <p>顧客管理リストのデータを取り込んでいます...</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: '#27ae60', marginBottom: '20px' }}>✓</div>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>同期完了</div>
              <p>顧客管理リストのデータを取り込みました。</p>
              <p style={{ marginTop: '10px' }}>取り込み件数: 30件</p>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          {!syncing && (
            <button 
              className="cancel-btn"
              onClick={() => setShowSyncModal(false)}
            >
              閉じる
            </button>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="container" id="home-page">
      <h1>ダッシュボード</h1>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="icon">📧</div>
          <h3>送信済メール</h3>
          <div className="count">127</div>
          <div className="description">今月の送信数</div>
        </div>
        
        <div className="dashboard-card">
          <div className="icon">👥</div>
          <h3>宛先データ</h3>
          <div className="count">30</div>
          <div className="description">
            登録済み宛先
            <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
              最終同期: {lastImportDate}
            </div>
            <button 
              className="action-btn" 
              style={{ fontSize: '12px', padding: '3px 10px', marginTop: '5px' }}
              onClick={openSyncDialog}
            >
              顧客管理リストと同期
            </button>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="icon">📝</div>
          <h3>テンプレート</h3>
          <div className="count">2</div>
          <div className="description">利用可能テンプレート</div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button className="action-btn" onClick={onCompose}>新規メール作成</button>
      </div>
      
      <div className="recent-history">
        <h2>最近の送信履歴</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th width="20%">日時</th>
              <th width="35%">件名</th>
              <th width="15%">送信数</th>
              <th width="15%">ステータス</th>
              <th width="15%">操作</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map(log => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>{log.subject}</td>
                <td>{log.totalCount}件</td>
                <td>
                  <span className={`status-badge ${log.status === 'success' ? 'success' : 'error'}`}>
                    {log.status === 'success' ? '完了' : 'エラー'}
                  </span>
                </td>
                <td>
                  <button className="log-details-btn" onClick={() => openLogDetail(log)}>詳細</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ログ詳細モーダル */}
      {showLogDetailModal && renderLogDetailModal()}

      {/* 顧客管理リスト同期モーダル */}
      {showSyncModal && renderSyncModal()}
    </div>
  );
};

export default Dashboard;
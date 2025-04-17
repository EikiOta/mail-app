// src/components/Dashboard.js
import React, { useState } from 'react';
import { Modal } from './common/Modal';

const Dashboard = ({ logs, onCompose }) => {
  // 最新の4件のログのみ表示
  const recentLogs = logs.slice(0, 4);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('summary-tab');

  // ダミーの送信先データ（実際のシステムではログと一緒に保存されるはず）
  const dummyRecipients = [
    {
      id: 1,
      name: '佐藤 翔太',
      company: '富士通株式会社',
      email: 'sato.shota@fujitsu.co.jp',
      cc: [
        { id: 101, name: '山本 健二', email: 'yamamoto.kenji@fujitsu.co.jp' },
        { id: 102, name: '田中 裕子', email: 'tanaka.yuko@fujitsu.co.jp' }
      ],
      status: 'success',
      sentTime: '2025/04/15 15:30:12',
      greeting: '富士通株式会社 佐藤 翔太様\n\n'
    },
    {
      id: 2,
      name: '鈴木 健太',
      company: 'トヨタ自動車株式会社',
      email: 'suzuki.kenta@toyota.co.jp',
      cc: [
        { id: 103, name: '渡辺 浩', email: 'watanabe.hiroshi@toyota.co.jp' }
      ],
      status: 'success',
      sentTime: '2025/04/15 15:30:15',
      greeting: 'トヨタ自動車株式会社 鈴木 健太様\n\n'
    },
    {
      id: 3,
      name: '高橋 大輔',
      company: '株式会社日立製作所',
      email: 'takahashi.daisuke@hitachi.co.jp',
      cc: [],
      status: 'success',
      sentTime: '2025/04/15 15:30:18',
      greeting: '株式会社日立製作所 高橋 大輔様\n\n'
    }
  ];

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
          <strong>設定:</strong> ZIP圧縮してパスワードを設定（パスワード: a8Xp2#7Z）
          ※パスワードは別メールで送信されています
        </div>
      </div>
    );
  };

  // ログ詳細モーダルの内容をレンダリング
  const renderLogDetailModal = () => {
    if (!currentLog) return null;
    
    return (
      <Modal onClose={() => setShowLogDetailModal(false)}>
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
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>送信数</div>
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
            <table className="recipients-table">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="15%">宛先(To)</th>
                  <th width="20%">会社名</th>
                  <th width="30%">CC</th>
                  <th width="15%">ステータス</th>
                  <th width="15%">送信日時</th>
                </tr>
              </thead>
              <tbody>
                {dummyRecipients.map((recipient, index) => (
                  <tr key={recipient.id}>
                    <td>{index + 1}</td>
                    <td>{recipient.name}</td>
                    <td>{recipient.company}</td>
                    <td>
                      <div className="cc-tags">
                        {recipient.cc.map((cc, ccIndex) => (
                          <span key={ccIndex} className="cc-tag">
                            {cc.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td><span className={`status-badge ${recipient.status}`}>{recipient.status === 'success' ? '成功' : 'エラー'}</span></td>
                    <td>{recipient.sentTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="action-btn" onClick={() => setShowLogDetailModal(false)}>閉じる</button>
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
          <div className="description">登録済み宛先</div>
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
              <th width="15%">アクション</th>
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
    </div>
  );
};

export default Dashboard;
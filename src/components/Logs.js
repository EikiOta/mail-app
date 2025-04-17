// src/components/Logs.js
import React, { useState } from 'react';
import { Modal } from './common/Modal';
import Pagination from './common/Pagination';

const Logs = ({ logs }) => {
  const [filters, setFilters] = useState({
    period: 'all',
    template: 'all',
    status: 'all',
    keyword: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('summary-tab');
  const [showPasswordEmailModal, setShowPasswordEmailModal] = useState(false);
  const itemsPerPage = 10;

  // ダミーの送信先データ（実際のシステムではログと一緒に保存されるはず）
  const dummyRecipients = [
    {
      id: 1,
      name: '佐藤 翔太',
      company: '富士通株式会社',
      department: 'システムインテグレーション事業部',
      position: '部長',
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
      department: '開発部',
      position: '課長',
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
      department: '営業本部 関西支社 名古屋支店',
      position: '主任',
      email: 'takahashi.daisuke@hitachi.co.jp',
      cc: [],
      status: 'success',
      sentTime: '2025/04/15 15:30:18',
      greeting: '株式会社日立製作所 高橋 大輔様\n\n'
    }
  ];

  // パスワード通知メールのテンプレート
  const passwordEmailTemplate = `<<会社名>> <<宛先名>>様

いつもお世話になっております。KOKUAの天野です。

先ほど送信いたしましたファイルのパスワードをお知らせいたします。
パスワード: <<パスワード>>

ご不明点がございましたら、お気軽にお問い合わせください。
よろしくお願いいたします。`;

  // フィルター変更時の処理
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // フィルターが変更されたらページを1に戻す
  };

  // 日付によるフィルタリング
  const filterLogByPeriod = (log) => {
    const period = filters.period;
    if (period === 'all') return true;
    
    const logDate = new Date(log.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (period === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return logDate >= today && logDate < tomorrow;
    } else if (period === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    } else if (period === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return logDate >= monthAgo;
    }
    
    return true;
  };

  // フィルタリングしたログを取得
  const getFilteredLogs = () => {
    return logs.filter(log => {
      // 期間フィルター
      if (!filterLogByPeriod(log)) return false;
      
      // テンプレートフィルター
      if (filters.template !== 'all') {
        if (filters.template === 'null' && log.templateId !== null) return false;
        else if (filters.template !== 'null' && log.templateId !== parseInt(filters.template)) return false;
      }
      
      // ステータスフィルター
      if (filters.status !== 'all' && log.status !== filters.status) return false;
      
      // キーワードフィルター
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        return log.subject.toLowerCase().includes(keyword);
      }
      
      return true;
    });
  };

  // ログの詳細表示
  const openLogDetail = (log) => {
    setCurrentLog(log);
    setActiveDetailTab('summary-tab');
    setShowLogDetailModal(true);
  };

  // パスワード通知メールモーダルを開く
  const openPasswordEmailModal = () => {
    setShowPasswordEmailModal(true);
  };

  // 詳細タブの切り替え
  const handleDetailTabChange = (tabId) => {
    setActiveDetailTab(tabId);
  };

  // ページングされたデータを取得
  const getPaginatedData = () => {
    const filteredLogs = getFilteredLogs();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredLogs.length);
    
    return filteredLogs.slice(startIndex, endIndex);
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
          <button 
            className="password-email-btn" 
            onClick={openPasswordEmailModal}
            style={{ marginLeft: '10px', fontSize: '12px', padding: '2px 8px' }}
          >
            パスワード通知メール確認
          </button>
        </div>
      </div>
    );
  };

  // ログ詳細モーダルの内容をレンダリング
  const renderLogDetailModal = () => {
    if (!currentLog) return null;
    
    return (
      <Modal onClose={() => setShowLogDetailModal(false)} fullWidth={true}>
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
            <table className="recipients-table wide-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>No</th>
                  <th>送信先情報</th>
                  <th>CC</th>
                  <th style={{ width: '80px' }}>ステータス</th>
                  <th style={{ width: '100px' }}>送信日時</th>
                </tr>
              </thead>
              <tbody>
                {dummyRecipients.map((recipient, index) => (
                  <tr key={recipient.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="recipient-info">
                        <div className="recipient-name">{recipient.name}</div>
                        <div className="recipient-company">{recipient.company}</div>
                        <div className="recipient-details">
                          <span className="detail-label">部署:</span> {recipient.department} 
                          <span className="detail-label" style={{ marginLeft: '10px' }}>役職:</span> {recipient.position}
                        </div>
                        <div className="recipient-email">{recipient.email}</div>
                      </div>
                    </td>
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

  // パスワード通知メールモーダルの内容をレンダリング
  const renderPasswordEmailModal = () => {
    return (
      <Modal onClose={() => setShowPasswordEmailModal(false)}>
        <div className="modal-header">
          <h3 className="modal-title">パスワード通知メール</h3>
        </div>
        
        <div className="modal-body">
          <p>以下のパスワード通知メールが各宛先に別途送信されました：</p>
          <div className="email-preview" style={{ 
            whiteSpace: 'pre-line',
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
            marginTop: '10px',
            marginBottom: '15px'
          }}>
            {passwordEmailTemplate
              .replace('<<会社名>>', '富士通株式会社')
              .replace('<<宛先名>>', '佐藤 翔太')
              .replace('<<パスワード>>', 'a8Xp2#7Z')}
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            ※ このパスワード通知メールは、メール送信時に「パスワードを別メールで送信する」が選択された場合に自動的に送信されます。<br />
            ※ テンプレートは「設定」→「テンプレート管理」から編集できます。
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="action-btn" onClick={() => setShowPasswordEmailModal(false)}>閉じる</button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container" id="logs-page">
      <h1>送信ログ</h1>
      
      <div className="log-filters">
        <div className="log-filter">
          <label>期間</label>
          <select 
            className="search-input" 
            name="period" 
            value={filters.period}
            onChange={handleFilterChange}
          >
            <option value="all">すべて</option>
            <option value="today">今日</option>
            <option value="week">過去7日</option>
            <option value="month">過去30日</option>
            <option value="custom">カスタム...</option>
          </select>
        </div>
        
        <div className="log-filter">
          <label>テンプレート</label>
          <select 
            className="search-input" 
            name="template" 
            value={filters.template}
            onChange={handleFilterChange}
          >
            <option value="all">すべて</option>
            <option value="1">人材紹介メール</option>
            <option value="2">案件紹介メール</option>
          </select>
        </div>
        
        <div className="log-filter">
          <label>ステータス</label>
          <select 
            className="search-input" 
            name="status" 
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">すべて</option>
            <option value="success">成功</option>
            <option value="error">エラー</option>
          </select>
        </div>
        
        <div className="log-filter">
          <label>キーワード検索</label>
          <input 
            type="text" 
            className="search-input" 
            name="keyword" 
            placeholder="件名、送信先などで検索..."
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      <table className="log-table">
        <thead>
          <tr>
            <th width="5%">No</th>
            <th width="15%">日時</th>
            <th width="25%">件名</th>
            <th width="15%">送信数</th>
            <th width="10%">成功</th>
            <th width="10%">失敗</th>
            <th width="15%">アクション</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((log, index) => (
            <tr key={log.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{log.date}</td>
              <td>{log.subject}</td>
              <td>{log.totalCount}件</td>
              <td>{log.successCount}件</td>
              <td>{log.errorCount}件</td>
              <td>
                <button 
                  className="log-details-btn" 
                  onClick={() => openLogDetail(log)}
                >
                  詳細
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Pagination 
        currentPage={currentPage}
        totalItems={getFilteredLogs().length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      
      {/* ログ詳細モーダル */}
      {showLogDetailModal && renderLogDetailModal()}
      
      {/* パスワード通知メールモーダル */}
      {showPasswordEmailModal && renderPasswordEmailModal()}
    </div>
  );
};

export default Logs;
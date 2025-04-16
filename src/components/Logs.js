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
  const [selectedPreviewRecipient, setSelectedPreviewRecipient] = useState(null);
  const itemsPerPage = 10;

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
    setSelectedPreviewRecipient(dummyRecipients[0]); // 最初の宛先を選択
    setShowLogDetailModal(true);
  };

  // 詳細タブの切り替え
  const handleDetailTabChange = (tabId) => {
    setActiveDetailTab(tabId);
  };

  // プレビュー宛先の変更
  const handlePreviewRecipientChange = (e) => {
    const recipientId = parseInt(e.target.value);
    const recipient = dummyRecipients.find(r => r.id === recipientId);
    if (recipient) {
      setSelectedPreviewRecipient(recipient);
    }
  };

  // ページングされたデータを取得
  const getPaginatedData = () => {
    const filteredLogs = getFilteredLogs();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredLogs.length);
    
    return filteredLogs.slice(startIndex, endIndex);
  };

  // メールの本文内容（ダミーデータ）
  const getMailContent = () => {
    return `いつもお世話になっております。
xxxのyyyです。
技術者のご紹介をさせていただきます。
何かスキルマッチする案件がございましたら、ご連絡いただけますと幸いです。
お忙しい中恐れ入りますがご確認の程よろしくお願い致します。
※既にご存じの情報でしたらご了承ください。
------------------------------------------------------
【名前】I.K（27歳・男性）
【最寄駅】星ヶ丘駅or塩釜口駅　※愛知県
【所属】 1社先正社員
【技術】Java,PHP,Javascript,PostgreSQL,Oracle,Eclipse
(詳細設計～保守・運用)
【経験年数】3年3か月
【稼働時期】5月
【単価】60万円　※ご相談ください
【希望条件】
＜必須＞
・言語にこだわりなし
・電車：1時間以内
・リモート併用（相談可）
【業務打ち合わせ可能日】
19時30分以降対応可能（WEB/対面）
※上記時間以前の面談は事前に相談が必要
------------------------------------------------------
何卒よろしくお願い申し上げます。`;
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
            <div 
              className={`log-detail-tab ${activeDetailTab === 'content-tab' ? 'active' : ''}`} 
              onClick={() => handleDetailTabChange('content-tab')}
            >
              メール内容
            </div>
            <div 
              className={`log-detail-tab ${activeDetailTab === 'preview-tab' ? 'active' : ''}`} 
              onClick={() => handleDetailTabChange('preview-tab')}
            >
              宛先別プレビュー
            </div>
            <div 
              className={`log-detail-tab ${activeDetailTab === 'system-tab' ? 'active' : ''}`} 
              onClick={() => handleDetailTabChange('system-tab')}
            >
              システムログ
            </div>
          </div>
          
          {/* 概要タブ */}
          <div className={`log-detail-pane ${activeDetailTab === 'summary-tab' ? 'active' : ''}`} id="summary-tab">
            <div className="log-detail-item">
              <div className="log-detail-label">送信日時</div>
              <div className="log-detail-value">{currentLog.date}</div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">件名</div>
              <div className="log-detail-value">{currentLog.subject}</div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">テンプレート</div>
              <div className="log-detail-value">
                {currentLog.templateId === 1 ? '人材紹介メール' : 
                 currentLog.templateId === 2 ? '案件紹介メール' : ''}
              </div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">送信数</div>
              <div className="log-detail-value">
                <div>合計: {currentLog.totalCount}件</div>
                <div>成功: {currentLog.successCount}件</div>
                <div>失敗: {currentLog.errorCount}件</div>
              </div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">添付ファイル</div>
              <div className="log-detail-value">
                <div>スキルシート_IK_20250415.xlsx (124 KB)</div>
                <div>設定: ZIP圧縮してパスワードを設定（パスワード別途送信）</div>
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
          
          {/* メール内容タブ */}
          <div className={`log-detail-pane ${activeDetailTab === 'content-tab' ? 'active' : ''}`} id="content-tab">
            <div className="log-detail-item">
              <div className="log-detail-label">件名</div>
              <div className="log-detail-value">{currentLog.subject}</div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">本文</div>
              <div className="log-detail-value" style={{ whiteSpace: 'pre-line' }}>
                {getMailContent()}
              </div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">添付ファイル</div>
              <div className="log-detail-value">
                {renderAttachmentInfo()}
              </div>
            </div>
            
            <div className="log-detail-item">
              <div className="log-detail-label">パスワード通知メール</div>
              <div className="log-detail-value" style={{ whiteSpace: 'pre-line' }}>
                株式会社〇〇 ××様
                いつもお世話になっております。xxxのyyyです。
                先ほど送信いたしましたファイルのパスワードをお知らせいたします。
                パスワード: a8Xp2#7Z
                ご不明点がございましたら、お気軽にお問い合わせください。
                よろしくお願いいたします。
              </div>
            </div>
          </div>

          {/* 宛先別プレビュータブ */}
          <div className={`log-detail-pane ${activeDetailTab === 'preview-tab' ? 'active' : ''}`} id="preview-tab">
            <div style={{ marginBottom: '20px' }}>
              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>宛先選択:</label>
              <select 
                value={selectedPreviewRecipient?.id || ''}
                onChange={handlePreviewRecipientChange}
                style={{ padding: '8px', minWidth: '250px' }}
              >
                {dummyRecipients.map(recipient => (
                  <option key={recipient.id} value={recipient.id}>
                    {recipient.name} ({recipient.company})
                  </option>
                ))}
              </select>
            </div>

            {selectedPreviewRecipient && (
              <div className="email-preview">
                <div className="preview-header" style={{ marginBottom: '15px' }}>
                  <div><strong>送信先:</strong> {selectedPreviewRecipient.name} ({selectedPreviewRecipient.email})</div>
                  {selectedPreviewRecipient.cc.length > 0 && (
                    <div>
                      <strong>CC:</strong> {selectedPreviewRecipient.cc.map(cc => cc.name).join(', ')}
                    </div>
                  )}
                  <div><strong>送信日時:</strong> {selectedPreviewRecipient.sentTime}</div>
                </div>

                <div className="confirmation-section">
                  <div className="confirmation-label">件名</div>
                  <div className="confirmation-value">{currentLog.subject}</div>
                </div>

                <div className="confirmation-section">
                  <div className="confirmation-label">メール内容</div>
                  <div className="confirmation-value" style={{ 
                    whiteSpace: 'pre-line',
                    backgroundColor: '#f9f9f9',
                    padding: '15px',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}>
                    {selectedPreviewRecipient.greeting + getMailContent()}
                  </div>
                </div>

                <div className="confirmation-section">
                  <div className="confirmation-label">添付ファイル</div>
                  <div className="confirmation-value">
                    {renderAttachmentInfo()}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* システムログタブ */}
          <div className={`log-detail-pane ${activeDetailTab === 'system-tab' ? 'active' : ''}`} id="system-tab">
            <pre className="system-log">
              <span className="log-timestamp">[2025-04-15 15:30:10]</span> <span className="log-level info">INFO</span> メール送信処理を開始しました。送信先: 3件
              <span className="log-timestamp">[2025-04-15 15:30:10]</span> <span className="log-level info">INFO</span> 添付ファイル: スキルシート_IK_20250415.xlsx (124 KB) をZIP圧縮します
              <span className="log-timestamp">[2025-04-15 15:30:11]</span> <span className="log-level info">INFO</span> 添付ファイルをZIP圧縮しました: スキルシート_IK_20250415.zip (120 KB)
              <span className="log-timestamp">[2025-04-15 15:30:11]</span> <span className="log-level info">INFO</span> パスワード: a8Xp2#7Z を設定しました
              <span className="log-timestamp">[2025-04-15 15:30:12]</span> <span className="log-level info">INFO</span> メール送信 (1/3): To: 佐藤 翔太 &lt;sato.shota@fujitsu.co.jp&gt;, CC: 2件
              <span className="log-timestamp">[2025-04-15 15:30:12]</span> <span className="log-level info">INFO</span> メール送信完了: ID:20250415153012-001
              <span className="log-timestamp">[2025-04-15 15:30:12]</span> <span className="log-level info">INFO</span> パスワード通知メール送信: To: 佐藤 翔太 &lt;sato.shota@fujitsu.co.jp&gt;
              <span className="log-timestamp">[2025-04-15 15:30:15]</span> <span className="log-level info">INFO</span> メール送信 (2/3): To: 鈴木 健太 &lt;suzuki.kenta@toyota.co.jp&gt;, CC: 1件
              <span className="log-timestamp">[2025-04-15 15:30:15]</span> <span className="log-level info">INFO</span> メール送信完了: ID:20250415153015-002
              <span className="log-timestamp">[2025-04-15 15:30:15]</span> <span className="log-level info">INFO</span> パスワード通知メール送信: To: 鈴木 健太 &lt;suzuki.kenta@toyota.co.jp&gt;
              <span className="log-timestamp">[2025-04-15 15:30:18]</span> <span className="log-level info">INFO</span> メール送信 (3/3): To: 高橋 大輔 &lt;takahashi.daisuke@hitachi.co.jp&gt;, CC: 0件
              <span className="log-timestamp">[2025-04-15 15:30:18]</span> <span className="log-level info">INFO</span> メール送信完了: ID:20250415153018-003
              <span className="log-timestamp">[2025-04-15 15:30:18]</span> <span className="log-level info">INFO</span> パスワード通知メール送信: To: 高橋 大輔 &lt;takahashi.daisuke@hitachi.co.jp&gt;
              <span className="log-timestamp">[2025-04-15 15:30:19]</span> <span className="log-level info">INFO</span> 一時ファイル削除: スキルシート_IK_20250415.zip
              <span className="log-timestamp">[2025-04-15 15:30:19]</span> <span className="log-level info">INFO</span> すべての送信処理が完了しました: 3件成功, 0件失敗
              <span className="log-timestamp">[2025-04-15 15:30:19]</span> <span className="log-level info">INFO</span> 処理時間: 9秒
            </pre>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="action-btn" onClick={() => setShowLogDetailModal(false)}>閉じる</button>
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
            <th width="5%">#</th>
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
    </div>
  );
};

export default Logs;
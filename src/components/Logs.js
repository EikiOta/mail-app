// src/components/Logs.js
import React, { useState } from 'react';
import { Modal } from './common/Modal';
import Pagination from './common/Pagination';
import { LOG_SAMPLE_CONTENT } from '../utils/data';

const Logs = ({ logs }) => {
  const [filters, setFilters] = useState({
    period: 'all',
    template: 'all',
    status: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [logDetailCurrentPage, setLogDetailCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const logDetailItemsPerPage = 10;

  // ログに応じたダミーの送信先データ
  const getDummyRecipientsForLog = (log) => {
    // 宛先マスタ(30件)から必要数を取得してシャッフル
    const sampleNames = [
      { name: '佐藤 翔太', company: '富士通株式会社', department: '営業部', position: '部長', email: 'sato.shota@fujitsu.co.jp' },
      { name: '鈴木 健太', company: 'トヨタ自動車株式会社', department: '技術部', position: '課長', email: 'suzuki.kenta@toyota.co.jp' },
      { name: '高橋 大輔', company: '株式会社日立製作所', department: '人事部', position: '係長', email: 'takahashi.daisuke@hitachi.co.jp' },
      { name: '田中 拓也', company: 'ソニーグループ株式会社', department: '総務部', position: '主任', email: 'tanaka.takuya@sony.co.jp' },
      { name: '伊藤 直樹', company: '三菱電機株式会社', department: '経理部', position: '担当', email: 'ito.naoki@mitsubishi.co.jp' },
      { name: '渡辺 恵美', company: 'パナソニック株式会社', department: '企画部', position: 'マネージャー', email: 'watanabe.megumi@panasonic.co.jp' },
      { name: '山本 香織', company: '株式会社東芝', department: '開発部', position: 'リーダー', email: 'yamamoto.kaori@toshiba.co.jp' },
      { name: '中村 裕子', company: '株式会社NTTデータ', department: 'マーケティング部', position: '社員', email: 'nakamura.yuko@nttdata.co.jp' },
      { name: '小林 綾香', company: '株式会社野村総合研究所', department: '購買部', position: '主査', email: 'kobayashi.ayaka@nri.co.jp' },
      { name: '加藤 智子', company: 'KDDI株式会社', department: 'システム部', position: '専門職', email: 'kato.tomoko@kddi.co.jp' },
      { name: '吉田 健一', company: '富士通株式会社', department: '開発部', position: '課長', email: 'yoshida.kenichi@fujitsu.co.jp' },
      { name: '佐々木 真由美', company: 'トヨタ自動車株式会社', department: '人事部', position: '主任', email: 'sasaki.mayumi@toyota.co.jp' },
      { name: '山田 太郎', company: '株式会社日立製作所', department: 'システム部', position: '部長', email: 'yamada.taro@hitachi.co.jp' },
      { name: '伊藤 裕子', company: 'ソニーグループ株式会社', department: '営業部', position: '担当', email: 'ito.yuko@sony.co.jp' },
      { name: '鈴木 一郎', company: '三菱電機株式会社', department: '技術部', position: 'リーダー', email: 'suzuki.ichiro@mitsubishi.co.jp' },
      { name: '高橋 明美', company: 'パナソニック株式会社', department: '総務部', position: '係長', email: 'takahashi.akemi@panasonic.co.jp' },
      { name: '田中 正和', company: '株式会社東芝', department: '経理部', position: 'マネージャー', email: 'tanaka.masakazu@toshiba.co.jp' },
      { name: '渡辺 秀樹', company: '株式会社NTTデータ', department: '企画部', position: '社員', email: 'watanabe.hideki@nttdata.co.jp' },
      { name: '中村 和也', company: '株式会社野村総合研究所', department: 'マーケティング部', position: '主査', email: 'nakamura.kazuya@nri.co.jp' },
      { name: '山本 浩二', company: 'KDDI株式会社', department: '購買部', position: '専門職', email: 'yamamoto.koji@kddi.co.jp' },
      { name: '小林 誠', company: '富士通株式会社', department: 'システム部', position: '担当', email: 'kobayashi.makoto@fujitsu.co.jp' },
      { name: '加藤 健二', company: 'トヨタ自動車株式会社', department: '開発部', position: '部長', email: 'kato.kenji@toyota.co.jp' },
      { name: '吉田 幸子', company: '株式会社日立製作所', department: '営業部', position: '課長', email: 'yoshida.sachiko@hitachi.co.jp' },
      { name: '佐々木 大輔', company: 'ソニーグループ株式会社', department: '技術部', position: '係長', email: 'sasaki.daisuke@sony.co.jp' },
      { name: '山田 亜希子', company: '三菱電機株式会社', department: '人事部', position: '主任', email: 'yamada.akiko@mitsubishi.co.jp' },
      { name: '伊藤 誠', company: 'パナソニック株式会社', department: '総務部', position: 'リーダー', email: 'ito.makoto@panasonic.co.jp' },
      { name: '斎藤 健太', company: '株式会社東芝', department: '経理部', position: '社員', email: 'saito.kenta@toshiba.co.jp' },
      { name: '松本 明日香', company: '株式会社NTTデータ', department: '企画部', position: '主査', email: 'matsumoto.asuka@nttdata.co.jp' },
      { name: '井上 大輔', company: '株式会社野村総合研究所', department: 'マーケティング部', position: '専門職', email: 'inoue.daisuke@nri.co.jp' },
      { name: '木村 真由美', company: 'KDDI株式会社', department: '購買部', position: '担当', email: 'kimura.mayumi@kddi.co.jp' }
    ];

    // セッションごとに異なるシャッフル結果を得るためにランダムに並べ替え
    const shuffledNames = [...sampleNames].sort(() => 0.5 - Math.random()).slice(0, log.totalCount);
    
    const recipients = [];
    
    for (let i = 0; i < log.totalCount; i++) {
      let status = 'unprocessed'; // デフォルトは未処理
      let passwordStatus = 'unprocessed';
      
      // 送信中断の場合
      if (log.canceled) {
        // 処理済み件数の場合
        if (i < log.successCount) {
          status = 'success';
          passwordStatus = log.passwordEmailSuccess > 0 ? 'success' : 'none';
        }
        // それ以外は未処理
      } else {
        // 通常の場合（中断なし）
        if (i < log.successCount) {
          status = 'success';
          passwordStatus = log.passwordEmailSuccess > 0 ? 'success' : 'none';
        } else if (i < log.successCount + log.errorCount) {
          status = 'error';
          passwordStatus = log.passwordEmailError > 0 ? 'error' : 'none';
        }
      }
      
      const personData = shuffledNames[i] || sampleNames[i % sampleNames.length]; // 必要な数に足りない場合は繰り返し使用
      
      recipients.push({
        id: i + 1,
        name: personData.name,
        company: personData.company,
        department: personData.department,
        position: personData.position,
        email: personData.email,
        cc: i % 3 === 0 ? [
          { id: 1001 + i, name: sampleNames[(i + 10) % sampleNames.length].name, email: sampleNames[(i + 10) % sampleNames.length].email }
        ] : [],
        status: status,
        passwordStatus: passwordStatus,
        sentTime: log.date.replace(/(\d+:\d+)$/, (i % 60).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0'))
      });
    }
    
    return recipients;
  };

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
      if (filters.status !== 'all') {
        if (filters.status === 'canceled' && !log.canceled) return false;
        else if (filters.status !== 'canceled' && log.status !== filters.status) return false;
      }
      
      return true;
    });
  };

  // ログの詳細表示
  const openLogDetail = (log) => {
    setCurrentLog(log);
    setLogDetailCurrentPage(1); // ページを初期化
    setShowLogDetailModal(true);
  };

  // ページングされたデータを取得
  const getPaginatedData = () => {
    const filteredLogs = getFilteredLogs();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredLogs.length);
    
    return filteredLogs.slice(startIndex, endIndex);
  };

  // ログ詳細モーダルでのページネーション処理
  const getPaginatedRecipients = (recipients) => {
    const startIndex = (logDetailCurrentPage - 1) * logDetailItemsPerPage;
    const endIndex = Math.min(startIndex + logDetailItemsPerPage, recipients.length);
    return recipients.slice(startIndex, endIndex);
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

  // ステータスの表示名を取得
  const getStatusText = (status) => {
    switch(status) {
      case 'success': return '実行済み';
      case 'error': return '実行失敗';
      case 'unprocessed': return '未処理';
      default: return 'なし';
    }
  };

  // ログステータスの表示名を取得
  const getLogStatusText = (log) => {
    if (log.canceled) return '送信中断';
    return log.status === 'success' ? '完了' : '失敗あり';
  };

  // ログ詳細モーダルの内容をレンダリング
  const renderLogDetailModal = () => {
    if (!currentLog) return null;
    
    // 現在のログに対応するダミーの受信者リストを生成
    const dummyRecipients = getDummyRecipientsForLog(currentLog);
    const paginatedRecipients = getPaginatedRecipients(dummyRecipients);
    
    // 送信したメール本文
    const emailContent = LOG_SAMPLE_CONTENT[currentLog.templateId];
    
    return (
      <Modal onClose={() => setShowLogDetailModal(false)} fullWidth={true} maxWidth="90%">
        <div className="modal-header">
          <h3 className="modal-title">送信ログ詳細</h3>
        </div>
        
        <div className="modal-body">
          <div className="log-summary-card" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: '0', color: '#2c3e50' }}>{currentLog.subject}</h3>
              <span className={`status-badge ${currentLog.status}`} style={{ fontSize: '14px' }}>
                {getLogStatusText(currentLog)}
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
                      <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>実行済み</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#e74c3c' }}>{currentLog.errorCount}</span>
                      <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>実行失敗</span>
                    </div>
                    {currentLog.canceled && (
                      <div>
                        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#f39c12' }}>{currentLog.unprocessedCount}</span>
                        <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>未処理</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>パスワード通知</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#27ae60' }}>{currentLog.passwordEmailSuccess}</span>
                      <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>実行済み</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#e74c3c' }}>{currentLog.passwordEmailError}</span>
                      <span style={{ fontSize: '14px', color: '#6c757d', marginLeft: '5px' }}>実行失敗</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {currentLog.canceled && (
              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '4px', 
                border: '1px solid #ffeeba',
                color: '#856404' 
              }}>
                <strong>送信中断:</strong> この送信処理は中断されました。{currentLog.successCount}件が処理され、残りの{currentLog.unprocessedCount}件は未処理です。
              </div>
            )}
          </div>
          
          {/* メール本文表示セクションを追加 */}
          <div className="log-detail-item" style={{ marginBottom: '15px', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px' }}>
            <div className="log-detail-label" style={{ fontWeight: 'bold', marginBottom: '10px' }}>送信メール内容</div>
            <div className="log-detail-value">
              <div style={{ marginBottom: '10px' }}>
                <strong>件名: </strong>{emailContent ? emailContent.subject : currentLog.subject}
              </div>
              <div style={{ 
                whiteSpace: 'pre-line', 
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0' 
              }}>
                {emailContent ? emailContent.content : '（内容は利用できません）'}
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
                ※ 送信時に「&lt;&lt;会社名&gt;&gt;」「&lt;&lt;名前&gt;&gt;」などのプレースホルダーは各宛先の情報に置換されます。
              </p>
            </div>
          </div>
            
          <div className="log-detail-item" style={{ marginBottom: '15px', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px' }}>
            <div className="log-detail-label" style={{ fontWeight: 'bold', marginBottom: '10px' }}>添付ファイル</div>
            <div className="log-detail-value">
              {renderAttachmentInfo()}
            </div>
          </div>
            
          <div className="log-detail-item" style={{ marginBottom: '15px', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px' }}>
            <div className="log-detail-label" style={{ fontWeight: 'bold', marginBottom: '10px' }}>処理時間</div>
            <div className="log-detail-value">9秒</div>
          </div>
          
          <div className="log-detail-item" style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px' }}>
            <div className="log-detail-label" style={{ fontWeight: 'bold', marginBottom: '10px' }}>送信先リスト</div>
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
                  {paginatedRecipients.map((recipient, index) => (
                    <tr key={recipient.id}>
                      <td>{(logDetailCurrentPage - 1) * logDetailItemsPerPage + index + 1}</td>
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
                          {getStatusText(recipient.status)}
                        </span>
                      </td>
                      <td>
                        {recipient.passwordStatus !== 'none' ? (
                          <span className={`status-badge ${recipient.passwordStatus}`}>
                            {getStatusText(recipient.passwordStatus)}
                          </span>
                        ) : (
                          <span className="status-badge" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
                            なし
                          </span>
                        )}
                      </td>
                      <td>{recipient.status === 'unprocessed' ? '-' : recipient.sentTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* ページネーション追加 */}
              {dummyRecipients.length > logDetailItemsPerPage && (
                <div style={{ marginTop: '15px' }}>
                  <Pagination 
                    currentPage={logDetailCurrentPage}
                    totalItems={dummyRecipients.length}
                    itemsPerPage={logDetailItemsPerPage}
                    onPageChange={setLogDetailCurrentPage}
                    noScroll={true}
                  />
                </div>
              )}
            </div>
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
      
      <div className="log-filters" style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '20px' }}>
        <div className="log-filters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          <div className="log-filter">
            <label>期間</label>
            <select 
              className="search-input select-input" 
              name="period" 
              value={filters.period}
              onChange={handleFilterChange}
            >
              <option value="all">すべて</option>
              <option value="today">今日</option>
              <option value="week">過去7日</option>
              <option value="month">過去30日</option>
            </select>
          </div>
          
          <div className="log-filter">
            <label>テンプレート</label>
            <select 
              className="search-input select-input" 
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
              className="search-input select-input" 
              name="status" 
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">すべて</option>
              <option value="success">完了</option>
              <option value="error">失敗あり</option>
              <option value="canceled">送信中断</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="table-container" style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '20px' }}>
        <table className="log-table">
          <thead>
            <tr>
              <th width="5%">No</th>
              <th width="15%">日時</th>
              <th width="30%">件名</th>
              <th width="15%">送信数</th>
              <th width="10%">実行済み</th>
              <th width="10%">実行失敗</th>
              <th width="15%"></th>
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
                  {log.canceled && (
                    <span className="status-badge" style={{ marginLeft: '5px', backgroundColor: '#fff3cd', color: '#856404' }}>
                      中断
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalItems={getFilteredLogs().length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        noScroll={true}
      />
      
      {/* ログ詳細モーダル */}
      {showLogDetailModal && renderLogDetailModal()}
    </div>
  );
};

export default Logs;
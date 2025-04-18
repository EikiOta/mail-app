// src/components/Dashboard.js
import React, { useState } from 'react';
import { Modal } from './common/Modal';

const Dashboard = ({ logs, onCompose, lastImportDate, onImportSync }) => {
  // 最新の4件のログのみ表示
  const recentLogs = logs.slice(0, 4);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

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
      // 成功/エラー状態を決定（logのsuccessCountに基づく）
      const isSuccess = i < log.successCount;
      const passwordStatus = i < log.passwordEmailSuccess ? 'success' : 'error';
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
        status: isSuccess ? 'success' : 'error',
        passwordStatus: log.passwordEmailSuccess > 0 ? passwordStatus : 'none',
        sentTime: log.date.replace(/(\d+:\d+)$/, (i % 60).toString().padStart(2, '0') + ':' + Math.floor(Math.random() * 60).toString().padStart(2, '0')),
        greeting: `${personData.company} ${personData.name}様\n\n`
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
    setShowLogDetailModal(true);
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
          <div className="log-summary-card" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
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

  // 画面全体に収まるようにスタイルを調整
  const containerStyle = {
    height: 'calc(100vh - var(--navbar-height) - 40px)',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  // ダッシュボードカードのスタイル調整 - より小さく
  const dashboardCardsStyle = {
    marginBottom: '15px',
    display: 'flex',
    gap: '15px'
  };

  const dashboardCardStyle = {
    border: '1px solid #e0e0e0',
    flex: 1,
    padding: '12px',
    textAlign: 'center'
  };

  const dashboardCardIconStyle = {
    fontSize: '20px',
    marginBottom: '5px',
    color: 'var(--secondary-color)'
  };

  const dashboardCardCountStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'var(--secondary-color)',
    margin: '5px 0'
  };

  const dashboardCardH3Style = {
    margin: '0 0 5px 0',
    fontSize: '16px'
  };

  // 最近の送信履歴のスタイル調整 - スクロールなしで表示
  const recentHistoryStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '10px 15px',
    flex: '1'
  };

  const historyTableStyle = {
    width: '100%',
    marginBottom: '0'
  };

  const historyTableThStyle = {
    padding: '8px',
    fontSize: '13px'
  };

  const historyTableTdStyle = {
    padding: '6px 8px',
    fontSize: '13px'
  };

  const actionBtnStyle = {
    marginBottom: '15px'
  };

  return (
    <div className="container" id="home-page" style={containerStyle}>
      <h1 style={{ marginBottom: '15px', paddingBottom: '8px', fontSize: '22px' }}>ダッシュボード</h1>
      
      <div className="dashboard-cards" style={dashboardCardsStyle}>
        <div className="dashboard-card" style={dashboardCardStyle}>
          <div className="icon" style={dashboardCardIconStyle}>📧</div>
          <h3 style={dashboardCardH3Style}>送信済メール</h3>
          <div className="count" style={dashboardCardCountStyle}>127</div>
          <div className="description" style={{ fontSize: '12px', color: '#666' }}>今月の送信数</div>
        </div>
        
        <div className="dashboard-card" style={dashboardCardStyle}>
          <div className="icon" style={dashboardCardIconStyle}>👥</div>
          <h3 style={dashboardCardH3Style}>宛先データ</h3>
          <div className="count" style={dashboardCardCountStyle}>30</div>
          <div className="description" style={{ fontSize: '12px', color: '#666' }}>
            登録済み宛先
            <div style={{ fontSize: '11px', marginTop: '4px', color: '#666' }}>
              最終同期: {lastImportDate}
            </div>
            <button 
              className="action-btn" 
              style={{ fontSize: '11px', padding: '2px 8px', marginTop: '4px' }}
              onClick={openSyncDialog}
            >
              顧客管理リストと同期
            </button>
          </div>
        </div>
        
        <div className="dashboard-card" style={dashboardCardStyle}>
          <div className="icon" style={dashboardCardIconStyle}>📝</div>
          <h3 style={dashboardCardH3Style}>テンプレート</h3>
          <div className="count" style={dashboardCardCountStyle}>2</div>
          <div className="description" style={{ fontSize: '12px', color: '#666' }}>利用可能テンプレート</div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button className="action-btn" onClick={onCompose} style={actionBtnStyle}>新規メール作成</button>
      </div>
      
      <div className="recent-history" style={recentHistoryStyle}>
        <h2 style={{ fontSize: '16px', marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #eee' }}>最近の送信履歴</h2>
        <table className="history-table" style={historyTableStyle}>
          <thead>
            <tr>
              <th width="20%" style={historyTableThStyle}>日時</th>
              <th width="35%" style={historyTableThStyle}>件名</th>
              <th width="15%" style={historyTableThStyle}>送信数</th>
              <th width="15%" style={historyTableThStyle}>ステータス</th>
              <th width="15%" style={historyTableThStyle}></th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map(log => (
              <tr key={log.id}>
                <td style={historyTableTdStyle}>{log.date}</td>
                <td style={historyTableTdStyle}>{log.subject}</td>
                <td style={historyTableTdStyle}>{log.totalCount}件</td>
                <td style={historyTableTdStyle}>
                  <span className={`status-badge ${log.status === 'success' ? 'success' : 'error'}`} style={{ fontSize: '11px', padding: '2px 6px' }}>
                    {log.status === 'success' ? '完了' : 'エラー'}
                  </span>
                </td>
                <td style={historyTableTdStyle}>
                  <button className="log-details-btn" style={{ fontSize: '11px', padding: '2px 6px' }} onClick={() => openLogDetail(log)}>詳細</button>
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
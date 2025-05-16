// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../utils/data';
import { Modal } from './common/Modal';
import Pagination from './common/Pagination';

const Settings = ({ recipients = [], lastImportDate, onImportSync }) => {
  const [activeTab, setActiveTab] = useState('recipients-settings');
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [templates, setTemplates] = useState(TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [recipientsData, setRecipientsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [showPlaceholderInfo, setShowPlaceholderInfo] = useState(false);
  const [passwordEmailTemplate, setPasswordEmailTemplate] = useState(
    `<<会社名>> <<名前>>様

いつもお世話になっております。xxxのyyyです。

先ほど送信いたしましたファイルのパスワードをお知らせいたします。
パスワード: <<パスワード>>

ご不明点がございましたら、お気軽にお問い合わせください。
よろしくお願いいたします。`
  );
  const itemsPerPage = 10;
  const maxTemplates = 6; // テンプレート数の上限
  const [newTemplateData, setNewTemplateData] = useState({
    name: '',
    subject: '',
    content: `<<会社名>> <<名前>>様

`
  });

  // 初期化
  useEffect(() => {
    // App.jsから受け取ったrecipientsがない場合は初期データを使用する
    if (recipients && recipients.length > 0) {
      setRecipientsData(recipients);
    }
  }, [recipients]);

  // タブ切り替え時に画面上部にスクロール
  const handleTabChange = (tab) => {
    window.scrollTo(0, 0);
    setActiveTab(tab);
  };

  // テンプレート編集処理
  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setShowEditTemplateModal(true);
  };

  // テンプレート削除確認
  const handleDeleteTemplateConfirm = (template) => {
    setDeleteMessage(`テンプレート「${template.name}」を削除してもよろしいですか？`);
    setDeleteTarget({ type: 'template', id: template.id });
    setShowDeleteConfirmModal(true);
  };

  // パスワードテンプレート変更時の処理
  const handlePasswordTemplateChange = (e) => {
    setPasswordEmailTemplate(e.target.value);
  };

  // 削除処理の実行
  const executeDelete = () => {
    if (deleteTarget.type === 'template') {
      setTemplates(templates.filter(t => t.id !== deleteTarget.id));
    }
    setShowDeleteConfirmModal(false);
  };

  // 新規テンプレート保存
  const saveNewTemplate = () => {
    const { name, subject, content } = newTemplateData;
    
    if (!name || !subject || !content) {
      alert('すべての項目を入力してください。');
      return;
    }

    // テンプレート数が上限に達していないか確認
    if (templates.length >= maxTemplates) {
      alert(`テンプレート数は最大${maxTemplates}件までです。既存のテンプレートを削除してから追加してください。`);
      return;
    }
    
    const newId = Math.max(...templates.map(t => t.id), 0) + 1;
    const newTemplate = {
      id: newId,
      name,
      subject,
      content
    };
    
    setTemplates([...templates, newTemplate]);
    setNewTemplateData({ 
      name: '', 
      subject: '', 
      content: `<<会社名>> <<名前>>様

` 
    });
    setShowAddTemplateModal(false);
  };

  // 既存テンプレート更新
  const updateTemplate = () => {
    if (!currentTemplate) return;
    
    setTemplates(templates.map(t => 
      t.id === currentTemplate.id ? currentTemplate : t
    ));
    
    setShowEditTemplateModal(false);
  };

  // 顧客管理リストとの同期ダイアログを開く
  const openSyncDialog = () => {
    setShowSyncModal(true);
    setSyncing(false);
    setSyncComplete(false);
  };

  // 同期処理を実行（デモ用、実際にはファイル選択後に処理する）
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

  // パスワード通知メールのプレビュー表示
  const renderPasswordEmailPreview = () => {
    // プレビュー例での置換
    return passwordEmailTemplate
      .replace('<<会社名>>', '株式会社サンプル')
      .replace('<<名前>>', '山田 太郎')
      .replace('<<パスワード>>', 'a8Xp2Z');
  };

  // テンプレートのプレビュー表示
  const renderTemplatePreview = (content) => {
    // プレビュー例での置換
    return content
      .replace('<<会社名>>', '株式会社サンプル')
      .replace('<<名前>>', '山田 太郎');
  };

  // ページングされたデータを取得
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, recipientsData.length);
    
    return recipientsData.slice(startIndex, endIndex);
  };

  // プレースホルダー説明ボタンコンポーネント
  const PlaceholderInfoButton = () => (
    <div style={{ 
      marginBottom: '20px',
      textAlign: 'right'
    }}>
      <button 
        onClick={() => setShowPlaceholderInfo(!showPlaceholderInfo)}
        style={{ 
          backgroundColor: '#f2f7fd', 
          border: '1px solid #cce5ff',
          borderRadius: '4px',
          padding: '5px 10px',
          fontSize: '13px',
          color: '#004085',
          cursor: 'pointer'
        }}
      >
        {showPlaceholderInfo ? 'プレースホルダーの説明を隠す' : 'プレースホルダーの説明を表示'}
      </button>
      
      {showPlaceholderInfo && (
        <div style={{ 
          backgroundColor: '#f2f7fd', 
          padding: '15px', 
          borderRadius: '4px', 
          border: '1px solid #cce5ff', 
          marginTop: '10px',
          textAlign: 'left'
        }}>
          <h4 style={{ color: '#004085', marginTop: '0', marginBottom: '10px' }}>プレースホルダーについて</h4>
          <p style={{ margin: '0 0 10px 0', color: '#004085' }}>
            テンプレートでは以下のプレースホルダーが使用できます。送信時に各宛先の情報に自動的に置換されます。
          </p>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#004085' }}>
            <li><code>{'<<会社名>>'}</code> - 送信先の会社名</li>
            <li><code>{'<<名前>>'}</code> - 送信先の担当者名</li>
          </ul>
          <p style={{ marginTop: '10px', color: '#004085' }}>
            例：「<code>{'<<会社名>> <<名前>>様'}</code>」→「株式会社サンプル 山田 太郎様」
          </p>
          <p style={{ marginTop: '5px', fontSize: '14px', color: '#004085' }}>
            ※ テンプレート冒頭に宛先の挨拶文（<code>{'<<会社名>> <<名前>>様'}</code>）を入れることをお勧めします。
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container" id="settings-page">
      <h1>設定</h1>
      
      <div className="app-tabs">
        <ul className="tab-nav">
          <li 
            className={`tab-item ${activeTab === 'recipients-settings' ? 'active' : ''}`} 
            onClick={() => handleTabChange('recipients-settings')}
          >
            宛先データ管理
          </li>
          <li 
            className={`tab-item ${activeTab === 'template-settings' ? 'active' : ''}`} 
            onClick={() => handleTabChange('template-settings')}
          >
            テンプレート管理
          </li>
          <li 
            className={`tab-item ${activeTab === 'password-template' ? 'active' : ''}`} 
            onClick={() => handleTabChange('password-template')}
          >
            パスワード通知メール設定
          </li>
        </ul>
        
        {/* タブコンテンツ */}
        <div className="tab-content" style={{ border: '1px solid #e0e0e0', borderRadius: '0 6px 6px 6px', padding: '20px' }}>
          {/* 宛先データ管理タブ */}
          <div className={`tab-pane ${activeTab === 'recipients-settings' ? 'active' : ''}`} id="recipients-settings">
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
              <button 
                className="action-btn" 
                onClick={openSyncDialog}
              >
                顧客管理リストと同期
              </button>
              
              <div style={{ color: '#666', fontSize: '14px' }}>
                最終同期日時: {lastImportDate}
              </div>
            </div>
            
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '20px' }}>
              <table className="recipients-table">
                <thead>
                  <tr>
                    <th width="5%">No</th>
                    <th width="20%">宛先名</th>
                    <th width="25%">会社名</th>
                    <th width="15%">部署</th>
                    <th width="15%">役職</th>
                    <th width="20%">メールアドレス</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().map((recipient, index) => (
                    <tr key={recipient.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{recipient.name}</td>
                      <td>{recipient.company}</td>
                      <td>
                        <div className="small-text" title={recipient.department}>
                          {recipient.department}
                        </div>
                      </td>
                      <td>
                        <div className="small-text" title={recipient.position}>
                          {recipient.position}
                        </div>
                      </td>
                      <td className="small-text">{recipient.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <Pagination 
                currentPage={currentPage}
                totalItems={recipientsData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                noScroll={true}
              />
            </div>
          </div>
          
          {/* テンプレート管理タブ */}
          <div className={`tab-pane ${activeTab === 'template-settings' ? 'active' : ''}`} id="template-settings">
            {/* プレースホルダーの説明を折りたたみ式に変更 */}
            <PlaceholderInfoButton />
            
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                className="action-btn" 
                onClick={() => setShowAddTemplateModal(true)}
                disabled={templates.length >= maxTemplates}
              >
                新規テンプレート追加
              </button>
              <div style={{ 
                fontSize: '14px', 
                color: templates.length >= maxTemplates ? '#e74c3c' : '#2c3e50',
                fontWeight: templates.length >= maxTemplates ? 'bold' : 'normal'
              }}>
                {templates.length} / {maxTemplates} テンプレート
              </div>
            </div>
            
            <div className="templates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {templates.map(template => (
                <div key={template.id} className="template-card" style={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '6px', 
                  padding: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  backgroundColor: '#fff'
                }}>
                  <div className="account-header" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '10px',
                    marginBottom: '15px'
                  }}>
                    <h3 className="account-title" style={{ margin: '0', fontSize: '18px' }}>{template.name}</h3>
                    <div className="account-actions">
                      <button 
                        className="log-details-btn edit-template-btn"
                        onClick={() => handleEditTemplate(template)}
                        style={{ marginRight: '5px' }}
                      >
                        編集
                      </button>
                      <button 
                        className="log-details-btn delete-template-btn"
                        onClick={() => handleDeleteTemplateConfirm(template)}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <label style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px', display: 'block' }}>件名</label>
                    <div style={{ 
                      padding: '8px 12px', 
                      borderRadius: '4px', 
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f9f9f9',
                      marginBottom: '15px'
                    }}>
                      {template.subject}
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <label style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px', display: 'block' }}>本文</label>
                    <div className="template-preview" style={{ 
                      padding: '10px', 
                      borderRadius: '4px', 
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f9f9f9',
                      maxHeight: '200px',
                      overflow: 'auto',
                      whiteSpace: 'pre-line',
                      fontSize: '13px'
                    }}>
                      {template.content}
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <label style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px', display: 'block' }}>プレビュー例</label>
                    <div style={{ 
                      padding: '10px', 
                      borderRadius: '4px', 
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#f5fcf7',
                      maxHeight: '200px',
                      overflow: 'auto',
                      whiteSpace: 'pre-line',
                      fontSize: '13px'
                    }}>
                      {renderTemplatePreview(template.content)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* パスワード通知メール設定タブ */}
          <div className={`tab-pane ${activeTab === 'password-template' ? 'active' : ''}`} id="password-template">
            <div className="template-card" style={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px', 
              padding: '20px', 
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div className="account-header" style={{ 
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: '15px',
                marginBottom: '20px'
              }}>
                <h3 className="account-title">パスワード通知メールテンプレート</h3>
              </div>
              
              <div className="form-section" style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '6px', 
                marginBottom: '20px',
                border: '1px solid #e0e0e0'
              }}>
                <p>添付ファイルを圧縮してパスワードを設定した場合、以下のテンプレートでパスワード通知メールが自動送信されます。</p>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  以下のプレースホルダーが使用できます：<br />
                  <code>{'<<会社名>>'}</code> - 送信先の会社名<br />
                  <code>{'<<名前>>'}</code> - 送信先の担当者名<br />
                  <code>{'<<パスワード>>'}</code> - 設定したパスワード
                </p>
              </div>

              <div className="form-section">
                <label htmlFor="password-template" style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>テンプレート</label>
                <textarea 
                  id="password-template"
                  value={passwordEmailTemplate}
                  onChange={handlePasswordTemplateChange}
                  style={{ minHeight: '250px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
                />
              </div>

              <div className="form-section">
                <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>プレビュー例</label>
                <div className="email-preview" style={{ 
                  whiteSpace: 'pre-line',
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}>
                  {renderPasswordEmailPreview()}
                </div>
              </div>

              <div style={{ textAlign: 'right', marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                <button className="action-btn">保存</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* テンプレート編集モーダル */}
      {showEditTemplateModal && (
        <Modal onClose={() => setShowEditTemplateModal(false)}>
          <div className="modal-header">
            <h3 className="modal-title">テンプレート編集</h3>
          </div>
          
          <div className="modal-body">
            <div className="edit-template-form">
              <div className="form-section">
                <label htmlFor="template-name">テンプレート名</label>
                <input 
                  type="text" 
                  id="template-name" 
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({
                    ...currentTemplate,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="form-section">
                <label htmlFor="template-subject">件名</label>
                <input 
                  type="text" 
                  id="template-subject" 
                  value={currentTemplate.subject}
                  onChange={(e) => setCurrentTemplate({
                    ...currentTemplate,
                    subject: e.target.value
                  })}
                />
              </div>
              
              <div className="form-section">
                <label htmlFor="template-content">本文</label>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  プレースホルダー: <code>{'<<会社名>>'}</code>, <code>{'<<名前>>'}</code> を利用できます。
                </p>
                <textarea 
                  id="template-content"
                  value={currentTemplate.content}
                  onChange={(e) => setCurrentTemplate({
                    ...currentTemplate,
                    content: e.target.value
                  })}
                />
              </div>
              
              <div className="form-section">
                <label>プレビュー</label>
                <div style={{ 
                  whiteSpace: 'pre-line',
                  backgroundColor: '#f5fcf7',
                  padding: '15px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}>
                  {renderTemplatePreview(currentTemplate.content)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="cancel-btn"
              onClick={() => setShowEditTemplateModal(false)}
            >
              キャンセル
            </button>
            <button 
              className="confirm-btn"
              onClick={updateTemplate}
            >
              保存
            </button>
          </div>
        </Modal>
      )}
      
      {/* 新規テンプレート追加モーダル */}
      {showAddTemplateModal && (
        <Modal onClose={() => setShowAddTemplateModal(false)}>
          <div className="modal-header">
            <h3 className="modal-title">新規テンプレート追加</h3>
          </div>
          
          <div className="modal-body">
            <div className="edit-template-form">
              <div className="form-section">
                <label htmlFor="new-template-name">テンプレート名</label>
                <input 
                  type="text" 
                  id="new-template-name" 
                  placeholder="例：セミナー案内メール"
                  value={newTemplateData.name}
                  onChange={(e) => setNewTemplateData({
                    ...newTemplateData,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="form-section">
                <label htmlFor="new-template-subject">件名</label>
                <input 
                  type="text" 
                  id="new-template-subject" 
                  placeholder="例：オンラインセミナーのご案内"
                  value={newTemplateData.subject}
                  onChange={(e) => setNewTemplateData({
                    ...newTemplateData,
                    subject: e.target.value
                  })}
                />
              </div>
              
              <div className="form-section">
                <label htmlFor="new-template-content">本文</label>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  プレースホルダー: <code>{'<<会社名>>'}</code>, <code>{'<<名前>>'}</code> を利用できます。<br/>
                  ※ 冒頭に「<code>{'<<会社名>> <<名前>>様'}</code>」と入れることを推奨します。
                </p>
                <textarea 
                  id="new-template-content" 
                  placeholder="テンプレートの本文を入力してください"
                  value={newTemplateData.content}
                  onChange={(e) => setNewTemplateData({
                    ...newTemplateData,
                    content: e.target.value
                  })}
                />
              </div>
              
              <div className="form-section">
                <label>プレビュー</label>
                <div style={{ 
                  whiteSpace: 'pre-line',
                  backgroundColor: '#f5fcf7',
                  padding: '15px',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0'
                }}>
                  {renderTemplatePreview(newTemplateData.content)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="cancel-btn"
              onClick={() => setShowAddTemplateModal(false)}
            >
              キャンセル
            </button>
            <button 
              className="confirm-btn"
              onClick={saveNewTemplate}
            >
              保存
            </button>
          </div>
        </Modal>
      )}
      
      {/* 顧客管理リスト同期モーダル */}
      {showSyncModal && (
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
      )}
      
      {/* 削除確認モーダル */}
      {showDeleteConfirmModal && (
        <Modal onClose={() => setShowDeleteConfirmModal(false)}>
          <div className="modal-header">
            <h3 className="modal-title">削除確認</h3>
          </div>
          
          <div className="modal-body">
            <p id="delete-confirm-message">{deleteMessage}</p>
          </div>
          
          <div className="modal-footer">
            <button 
              className="cancel-btn"
              onClick={() => setShowDeleteConfirmModal(false)}
            >
              キャンセル
            </button>
            <button 
              className="confirm-btn"
              onClick={executeDelete}
            >
              削除
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Settings;
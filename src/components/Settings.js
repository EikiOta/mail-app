// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../utils/data';
import { Modal } from './common/Modal';
import Pagination from './common/Pagination';

const Settings = ({ recipients = [] }) => {
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
  const itemsPerPage = 10;
  const [newTemplateData, setNewTemplateData] = useState({
    name: '',
    subject: '',
    content: ''
  });

  // 初期化
  useEffect(() => {
    // App.jsから受け取ったrecipientsがない場合は初期データを使用する
    if (recipients && recipients.length > 0) {
      setRecipientsData(recipients);
    }
  }, [recipients]);

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
    
    const newId = Math.max(...templates.map(t => t.id), 0) + 1;
    const newTemplate = {
      id: newId,
      name,
      subject,
      content
    };
    
    setTemplates([...templates, newTemplate]);
    setNewTemplateData({ name: '', subject: '', content: '' });
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

  // ページングされたデータを取得
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, recipientsData.length);
    
    return recipientsData.slice(startIndex, endIndex);
  };

  return (
    <div className="container" id="settings-page">
      <h1>設定</h1>
      
      <div className="app-tabs">
        <ul className="tab-nav">
          <li 
            className={`tab-item ${activeTab === 'recipients-settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('recipients-settings')}
          >
            宛先データ管理
          </li>
          <li 
            className={`tab-item ${activeTab === 'template-settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('template-settings')}
          >
            テンプレート管理
          </li>
        </ul>
        
        {/* タブコンテンツ */}
        <div className="tab-content">
          {/* 宛先データ管理タブ */}
          <div className={`tab-pane ${activeTab === 'recipients-settings' ? 'active' : ''}`} id="recipients-settings">
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <button 
                className="action-btn" 
                onClick={openSyncDialog}
              >
                顧客管理リストと同期
              </button>
            </div>
            
            <table className="recipients-table">
              <thead>
                <tr>
                  <th width="5%">#</th>
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
                    <td>{recipient.department}</td>
                    <td>{recipient.position}</td>
                    <td>{recipient.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <Pagination 
              currentPage={currentPage}
              totalItems={recipientsData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
          
          {/* テンプレート管理タブ */}
          <div className={`tab-pane ${activeTab === 'template-settings' ? 'active' : ''}`} id="template-settings">
            <div style={{ marginBottom: '20px' }}>
              <button 
                className="action-btn" 
                onClick={() => setShowAddTemplateModal(true)}
              >
                新規テンプレート追加
              </button>
            </div>
            
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="account-header">
                  <h3 className="account-title">{template.name}</h3>
                  <div className="account-actions">
                    <button 
                      className="log-details-btn edit-template-btn"
                      onClick={() => handleEditTemplate(template)}
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
                  <label>件名</label>
                  <input type="text" value={template.subject} disabled />
                </div>
                
                <div className="template-preview" dangerouslySetInnerHTML={{ 
                  __html: template.content.replace(/\n/g, '<br>') 
                }} />
              </div>
            ))}
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
                <textarea 
                  id="template-content"
                  value={currentTemplate.content}
                  onChange={(e) => setCurrentTemplate({
                    ...currentTemplate,
                    content: e.target.value
                  })}
                />
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
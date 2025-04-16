// src/components/Settings.js
import React, { useState } from 'react';
import { TEMPLATES } from '../utils/data';
import { Modal } from './common/Modal';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('recipients-settings');
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [showEditRecipientModal, setShowEditRecipientModal] = useState(false);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [templates, setTemplates] = useState(TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newTemplateData, setNewTemplateData] = useState({
    name: '',
    subject: '',
    content: ''
  });
  const [newRecipientData, setNewRecipientData] = useState({
    name: '',
    company: '',
    email: ''
  });

  // 初期のレシピエントデータ（デモ用）
  const [recipients, setRecipients] = useState([
    {
      id: 1,
      name: '佐藤 翔太',
      company: '富士通株式会社',
      email: 'sato.shota@fujitsu.co.jp',
      lastSent: '2025/04/15'
    },
    {
      id: 2,
      name: '鈴木 健太',
      company: 'トヨタ自動車株式会社',
      email: 'suzuki.kenta@toyota.co.jp',
      lastSent: '2025/04/10'
    },
    {
      id: 3,
      name: '高橋 大輔',
      company: '株式会社日立製作所',
      email: 'takahashi.daisuke@hitachi.co.jp',
      lastSent: '2025/03/22'
    },
    {
      id: 4,
      name: '田中 拓也',
      company: 'ソニーグループ株式会社',
      email: 'tanaka.takuya@sony.co.jp',
      lastSent: '2025/03/15'
    }
  ]);

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

  // 宛先編集処理
  const handleEditRecipient = (recipient) => {
    setCurrentRecipient(recipient);
    setShowEditRecipientModal(true);
  };

  // 宛先削除確認
  const handleDeleteRecipientConfirm = (recipient) => {
    setDeleteMessage(`宛先「${recipient.name}」を削除してもよろしいですか？`);
    setDeleteTarget({ type: 'recipient', id: recipient.id });
    setShowDeleteConfirmModal(true);
  };

  // 削除処理の実行
  const executeDelete = () => {
    if (deleteTarget.type === 'template') {
      setTemplates(templates.filter(t => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'recipient') {
      setRecipients(recipients.filter(r => r.id !== deleteTarget.id));
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

  // 新規宛先保存
  const saveNewRecipient = () => {
    const { name, company, email } = newRecipientData;
    
    if (!name || !company || !email) {
      alert('すべての項目を入力してください。');
      return;
    }
    
    const newId = Math.max(...recipients.map(r => r.id), 0) + 1;
    const newRecipient = {
      id: newId,
      name,
      company,
      email,
      lastSent: '-'
    };
    
    setRecipients([...recipients, newRecipient]);
    setNewRecipientData({ name: '', company: '', email: '' });
    setShowAddRecipientModal(false);
  };

  // 既存宛先更新
  const updateRecipient = () => {
    if (!currentRecipient) return;
    
    setRecipients(recipients.map(r => 
      r.id === currentRecipient.id ? currentRecipient : r
    ));
    
    setShowEditRecipientModal(false);
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
            <div style={{ marginBottom: '20px' }}>
              <button 
                className="action-btn" 
                onClick={() => setShowAddRecipientModal(true)}
              >
                新規宛先追加
              </button>
            </div>
            
            <table className="recipients-table">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="15%">宛先名</th>
                  <th width="20%">会社名</th>
                  <th width="20%">メールアドレス</th>
                  <th width="15%">最終送信日</th>
                  <th width="15%">アクション</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((recipient, index) => (
                  <tr key={recipient.id}>
                    <td>{index + 1}</td>
                    <td>{recipient.name}</td>
                    <td>{recipient.company}</td>
                    <td>{recipient.email}</td>
                    <td>{recipient.lastSent}</td>
                    <td>
                      <button 
                        className="log-details-btn edit-recipient-btn"
                        onClick={() => handleEditRecipient(recipient)}
                      >
                        編集
                      </button>
                      <button 
                        className="log-details-btn delete-btn"
                        onClick={() => handleDeleteRecipientConfirm(recipient)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      
      {/* 宛先編集モーダル */}
      {showEditRecipientModal && (
        <Modal onClose={() => setShowEditRecipientModal(false)}>
          <div className="modal-header">
            <h3 className="modal-title">宛先編集</h3>
          </div>
          
          <div className="modal-body">
            <div className="form-section">
              <label htmlFor="recipient-name">宛先名</label>
              <input 
                type="text" 
                id="recipient-name" 
                value={currentRecipient.name}
                onChange={(e) => setCurrentRecipient({
                  ...currentRecipient,
                  name: e.target.value
                })}
              />
            </div>
            
            <div className="form-section">
              <label htmlFor="recipient-company">会社名</label>
              <input 
                type="text" 
                id="recipient-company" 
                value={currentRecipient.company}
                onChange={(e) => setCurrentRecipient({
                  ...currentRecipient,
                  company: e.target.value
                })}
              />
            </div>
            
            <div className="form-section">
              <label htmlFor="recipient-email">メールアドレス</label>
              <input 
                type="email" 
                id="recipient-email" 
                value={currentRecipient.email}
                onChange={(e) => setCurrentRecipient({
                  ...currentRecipient,
                  email: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="cancel-btn"
              onClick={() => setShowEditRecipientModal(false)}
            >
              キャンセル
            </button>
            <button 
              className="confirm-btn"
              onClick={updateRecipient}
            >
              保存
            </button>
          </div>
        </Modal>
      )}
      
      {/* 新規宛先追加モーダル */}
      {showAddRecipientModal && (
        <Modal onClose={() => setShowAddRecipientModal(false)}>
          <div className="modal-header">
            <h3 className="modal-title">新規宛先追加</h3>
          </div>
          
          <div className="modal-body">
            <div className="form-section">
              <label htmlFor="new-recipient-name">宛先名</label>
              <input 
                type="text" 
                id="new-recipient-name" 
                placeholder="例：山田 太郎"
                value={newRecipientData.name}
                onChange={(e) => setNewRecipientData({
                  ...newRecipientData,
                  name: e.target.value
                })}
              />
            </div>
            
            <div className="form-section">
              <label htmlFor="new-recipient-company">会社名</label>
              <input 
                type="text" 
                id="new-recipient-company" 
                placeholder="例：株式会社サンプル"
                value={newRecipientData.company}
                onChange={(e) => setNewRecipientData({
                  ...newRecipientData,
                  company: e.target.value
                })}
              />
            </div>
            
            <div className="form-section">
              <label htmlFor="new-recipient-email">メールアドレス</label>
              <input 
                type="email" 
                id="new-recipient-email" 
                placeholder="例：yamada.taro@sample.co.jp"
                value={newRecipientData.email}
                onChange={(e) => setNewRecipientData({
                  ...newRecipientData,
                  email: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="cancel-btn"
              onClick={() => setShowAddRecipientModal(false)}
            >
              キャンセル
            </button>
            <button 
              className="confirm-btn"
              onClick={saveNewRecipient}
            >
              保存
            </button>
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
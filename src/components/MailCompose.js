// src/components/MailCompose.js
import React, { useState } from 'react';
import { TEMPLATES } from '../utils/data';
import { Modal } from './common/Modal';
import Pagination from './common/Pagination';

const MailCompose = ({ 
  recipients, 
  onConfirm, 
  updateSelection, 
  addCc,
  mailData,
  setMailData
}) => {
  const [attachments, setAttachments] = useState([]);
  const [showCcModal, setShowCcModal] = useState(false);
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [masterCurrentPage, setMasterCurrentPage] = useState(1);
  const [selectedCc, setSelectedCc] = useState([]); // CC選択状態をトップレベルで管理
  const [compressionType, setCompressionType] = useState('password'); // 圧縮方法: 'password', 'zip', 'none'
  const itemsPerPage = 10;

  // 選択された受信者のみを取得
  const selectedRecipients = recipients.filter(r => r.selected);

  // テンプレート選択時の処理
  const handleTemplateChange = (e) => {
    const templateId = parseInt(e.target.value);
    if (templateId) {
      const template = TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setMailData({
          ...mailData,
          subject: template.subject,
          content: template.content
        });
      }
    }
  };

  // 件名変更時の処理
  const handleSubjectChange = (e) => {
    setMailData({
      ...mailData,
      subject: e.target.value
    });
  };

  // 本文変更時の処理
  const handleContentChange = (e) => {
    setMailData({
      ...mailData,
      content: e.target.value
    });
  };

  // 圧縮設定変更時の処理
  const handleCompressionChange = (e) => {
    setCompressionType(e.target.value);
  };

  // ファイル添付時の処理
  const handleFileAttach = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileSize = file.size;
      let sizeStr;
      
      if (fileSize < 1024) {
        sizeStr = fileSize + ' B';
      } else if (fileSize < 1024 * 1024) {
        sizeStr = Math.round(fileSize / 1024) + ' KB';
      } else {
        sizeStr = Math.round(fileSize / (1024 * 1024) * 10) / 10 + ' MB';
      }
      
      setAttachments([...attachments, {
        name: file.name,
        size: sizeStr,
        file
      }]);
    }
  };

  // 添付ファイル削除時の処理
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // 全選択/解除の処理
  const toggleAllSelection = () => {
    const allSelected = recipients.every(r => r.selected);
    recipients.forEach(r => {
      updateSelection(r.id, !allSelected);
    });
  };

  // パスワード生成
  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // 8-12文字のランダムパスワードを生成
    const length = Math.floor(Math.random() * 5) + 8; // 8-12文字
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    // パスワード入力欄に設定
    const passwordInput = document.getElementById('attachment-password');
    if (passwordInput) {
      passwordInput.value = password;
    }
  };

  // 送信確認ボタンクリック時の処理
  const handleConfirmation = () => {
    // 入力検証
    if (selectedRecipients.length === 0) {
      alert('送信先が選択されていません。送信先を選択してください。');
      return;
    }
    
    if (!mailData.subject) {
      alert('件名が入力されていません。件名を入力してください。');
      return;
    }
    
    if (!mailData.content) {
      alert('本文が入力されていません。本文を入力してください。');
      return;
    }
    
    // 送信確認ページに移動
    const passwordInput = document.getElementById('attachment-password');
    const sendPasswordEmail = document.getElementById('send-password-email');
    
    onConfirm({
      ...mailData,
      attachments,
      compressionSettings: {
        type: compressionType,
        password: compressionType === 'password' ? passwordInput?.value : null,
        sendPasswordEmail: compressionType === 'password' ? sendPasswordEmail?.checked : false
      }
    });
  };

  // CCモーダルを開く処理
  const openCcModal = (recipientId) => {
    const recipient = recipients.find(r => r.id === recipientId);
    // 既存のCCリストを初期値として設定
    if (recipient) {
      setSelectedCc(recipient.cc || []);
    } else {
      setSelectedCc([]);
    }
    setCurrentRecipientId(recipientId);
    setShowCcModal(true);
  };

  // CCモーダルを閉じる処理
  const closeCcModal = () => {
    setShowCcModal(false);
    setCurrentRecipientId(null);
  };

  // 会社の連絡先を取得する処理
  const getCompanyContacts = (companyName, excludeEmail) => {
    return recipients
      .filter(r => r.company === companyName && r.email !== excludeEmail)
      .map(r => ({
        id: r.id,
        name: r.name,
        email: r.email
      }));
  };

  // CC選択状態を変更する処理
  const handleCcSelection = (checked, contact) => {
    if (checked) {
      setSelectedCc([...selectedCc, contact]);
    } else {
      setSelectedCc(selectedCc.filter(cc => cc.id !== contact.id));
    }
  };

  // CCを確定する処理
  const confirmCc = () => {
    if (currentRecipientId) {
      addCc(currentRecipientId, selectedCc);
    }
    closeCcModal();
  };

  // 選択された受信者の表示
  const renderSelectedRecipients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, selectedRecipients.length);
    
    return (
      <table className="recipients-table">
        <thead>
          <tr>
            <th width="5%">#</th>
            <th width="15%">宛先(To)</th>
            <th width="20%">会社名</th>
            <th width="40%">CC</th>
            <th width="20%">アクション</th>
          </tr>
        </thead>
        <tbody>
          {selectedRecipients.slice(startIndex, endIndex).map((recipient, index) => (
            <tr key={recipient.id}>
              <td>{startIndex + index + 1}</td>
              <td>{recipient.name}</td>
              <td>{recipient.company}</td>
              <td>
                <div className="cc-tags">
                  {recipient.cc.map((cc, ccIndex) => (
                    <span key={ccIndex} className="cc-tag" data-email={cc.email}>
                      {cc.name}
                      <span 
                        className="remove-cc" 
                        onClick={() => {
                          const newCcList = recipient.cc.filter((_, i) => i !== ccIndex);
                          addCc(recipient.id, newCcList);
                        }}
                      >
                        &times;
                      </span>
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="add-cc-btn" 
                    onClick={() => openCcModal(recipient.id)}
                  >
                    CCを追加
                  </button>
                  <button 
                    className="delete-recipient-btn" 
                    onClick={() => updateSelection(recipient.id, false)}
                  >
                    削除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 宛先マスタの表示
  const renderRecipientsMaster = () => {
    const startIndex = (masterCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, recipients.length);
    
    return (
      <table className="recipients-table">
        <thead>
          <tr>
            <th width="5%">選択</th>
            <th width="5%">#</th>
            <th width="15%">宛先(To)</th>
            <th width="20%">会社名</th>
            <th width="15%">メールアドレス</th>
          </tr>
        </thead>
        <tbody>
          {recipients.slice(startIndex, endIndex).map((recipient, index) => (
            <tr key={recipient.id}>
              <td>
                <input 
                  type="checkbox" 
                  className="recipient-checkbox" 
                  checked={recipient.selected} 
                  onChange={(e) => updateSelection(recipient.id, e.target.checked)}
                />
              </td>
              <td>{startIndex + index + 1}</td>
              <td title={recipient.email}>{recipient.name}</td>
              <td>{recipient.company}</td>
              <td>{recipient.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // CCモーダルのコンテンツ
  const renderCcModalContent = () => {
    if (!currentRecipientId) return null;
    
    const recipient = recipients.find(r => r.id === currentRecipientId);
    if (!recipient) return null;
    
    const contacts = getCompanyContacts(recipient.company, recipient.email);
    
    return (
      <div>
        <h3>CCを追加</h3>
        <input type="text" className="search-input" placeholder="名前で検索..." />
        
        <ul className="contact-list">
          {contacts.length === 0 ? (
            <li className="contact-item">同じ会社の他の連絡先はありません</li>
          ) : (
            contacts.map(contact => {
              const isChecked = selectedCc.some(cc => cc.id === contact.id);
              return (
                <li key={contact.id} className="contact-item">
                  <input 
                    type="checkbox" 
                    className="contact-checkbox" 
                    checked={isChecked}
                    onChange={(e) => handleCcSelection(e.target.checked, contact)}
                  />
                  <div>
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-email" style={{ fontSize: '12px', color: '#777' }}>
                      {contact.email}
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
        
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="cancel-btn" onClick={closeCcModal}>キャンセル</button>
          <button 
            className="confirm-btn" 
            onClick={confirmCc}
            style={{ marginLeft: '10px' }}
          >
            追加
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container" id="mail-compose-page">
      <h1>メール一斉送信</h1>
      
      {/* メール作成フォーム */}
      <div className="form-area">
        <div className="form-section">
          <label htmlFor="template-select">テンプレート選択</label>
          <select id="template-select" onChange={handleTemplateChange}>
            <option value="">テンプレートを選択してください</option>
            {TEMPLATES.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-section">
          <label htmlFor="subject">件名</label>
          <input 
            type="text" 
            id="subject" 
            placeholder="件名を入力してください"
            value={mailData.subject}
            onChange={handleSubjectChange}
          />
        </div>
        
        <div className="form-section">
          <label htmlFor="content">本文</label>
          <textarea 
            id="content"
            value={mailData.content}
            onChange={handleContentChange}
            style={{ minHeight: '400px' }} /* 本文入力欄を拡大 */
          />
        </div>
        
        <div className="form-section">
          <label>添付ファイル</label>
          <div className="attachment-settings">
            <input 
              type="file" 
              id="attachment-file"
              onChange={handleFileAttach}
              style={{ display: 'none' }}
            />
            <button 
              className="action-btn" 
              onClick={() => document.getElementById('attachment-file').click()}
            >
              ファイルを添付
            </button>
            
            <div className="attachment-list">
              {attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <div className="attachment-icon">📄</div>
                  <div className="attachment-name">{attachment.name}</div>
                  <div className="attachment-size">{attachment.size}</div>
                  <div className="attachment-actions">
                    <button 
                      className="log-details-btn remove-attachment-btn"
                      onClick={() => removeAttachment(index)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="compression-options">
              <h4>添付ファイルの設定</h4>
              <div className="radio-option-group">
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="compress-password" 
                    name="compression" 
                    value="password"
                    checked={compressionType === 'password'}
                    onChange={handleCompressionChange}
                  />
                  <label htmlFor="compress-password">ZIP圧縮してパスワードを設定（推奨）</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="compress-only" 
                    name="compression" 
                    value="zip"
                    checked={compressionType === 'zip'}
                    onChange={handleCompressionChange}
                  />
                  <label htmlFor="compress-only">ZIP圧縮のみ（パスワードなし）</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="no-compress" 
                    name="compression" 
                    value="none"
                    checked={compressionType === 'none'}
                    onChange={handleCompressionChange}
                  />
                  <label htmlFor="no-compress">圧縮しない</label>
                </div>
              </div>
              
              <div className={`form-section ${compressionType !== 'password' ? 'disabled' : ''}`} id="password-section">
                <label>パスワード</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    id="attachment-password" 
                    defaultValue="a8Xp2#7Z" 
                    style={{ flex: 1 }}
                    disabled={compressionType !== 'password'}
                  />
                  <button 
                    className="action-btn" 
                    id="generate-password-btn"
                    onClick={generatePassword}
                    disabled={compressionType !== 'password'}
                  >
                    生成
                  </button>
                </div>
              </div>
              
              <div className={`form-section ${compressionType !== 'password' ? 'disabled' : ''}`} style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    id="send-password-email" 
                    defaultChecked 
                    style={{ marginRight: '10px', width: 'auto' }}
                    disabled={compressionType !== 'password'}
                  />
                  <label 
                    htmlFor="send-password-email" 
                    style={{ display: 'inline', marginBottom: 0 }}
                  >
                    パスワードを別メールで送信する
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 選択した送信先テーブル */}
      <div className="form-section">
        <label>送信先一覧 <span>({selectedRecipients.length}件)</span></label>
        {renderSelectedRecipients()}
        
        {/* ページネーション */}
        <Pagination 
          currentPage={currentPage}
          totalItems={selectedRecipients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
      
      {/* 宛先マスタから選択 */}
      <div className="form-section">
        <label>
          宛先マスタ一覧 <span>({recipients.length}件)</span> 
          <button id="toggle-selection" className="toggle-btn" onClick={toggleAllSelection}>
            全選択/解除
          </button>
        </label>
        {renderRecipientsMaster()}
        
        {/* ページネーション（マスタ） */}
        <Pagination 
          currentPage={masterCurrentPage}
          totalItems={recipients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setMasterCurrentPage}
        />
      </div>
      
      <div className="clearfix">
        <button className="send-btn" onClick={handleConfirmation}>送信確認</button>
      </div>
      
      {/* CCモーダル */}
      {showCcModal && (
        <Modal onClose={closeCcModal}>
          {renderCcModalContent()}
        </Modal>
      )}
    </div>
  );
};

export default MailCompose;
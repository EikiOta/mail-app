// src/components/MailCompose.js
import React, { useState, useEffect } from 'react';
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
  // 状態管理の変数宣言部分は省略...
  const [attachments, setAttachments] = useState([]);
  const [showCcModal, setShowCcModal] = useState(false);
  const [showPasswordTemplateModal, setShowPasswordTemplateModal] = useState(false);
  const [showTemplateChangeConfirm, setShowTemplateChangeConfirm] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [masterCurrentPage, setMasterCurrentPage] = useState(1);
  const [selectedCc, setSelectedCc] = useState([]); // CC選択状態をトップレベルで管理
  const [compressionType, setCompressionType] = useState('password'); // 圧縮方法: 'password', 'none'
  const [searchQuery, setSearchQuery] = useState({ name: '', company: '' });
  const [ccSearchQuery, setCcSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // デフォルトは番号順
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState(null);
  const [passwordEmailTemplate, setPasswordEmailTemplate] = useState(
    `<<会社名>> <<宛先名>>様

いつもお世話になっております。xxxのyyyです。

先ほど送信いたしましたファイルのパスワードをお知らせいたします。
パスワード: <<パスワード>>

ご不明点がございましたら、お気軽にお問い合わせください。
よろしくお願いいたします。`
  );
  const itemsPerPage = 10;

  // 選択された受信者のみを取得
  const selectedRecipients = recipients.filter(r => r.selected);

  // 添付ファイルがあるかどうか
  const hasAttachments = attachments.length > 0;

  // テンプレート選択時の処理
  const handleTemplateChange = (e) => {
    const templateId = parseInt(e.target.value);
    setSelectedTemplateId(templateId);
    
    // 本文が空の場合は確認なしでテンプレートを適用
    if (!mailData.subject && !mailData.content) {
      applyTemplate(templateId);
    } else {
      // 本文があれば確認ダイアログを表示
      setShowTemplateChangeConfirm(true);
    }
  };

  // テンプレートを適用する
  const applyTemplate = (templateId) => {
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
    setShowTemplateChangeConfirm(false);
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

  // パスワードメールテンプレート変更時の処理
  const handlePasswordTemplateChange = (e) => {
    setPasswordEmailTemplate(e.target.value);
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

  // 検索クエリの変更処理
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    setMasterCurrentPage(1); // 検索条件が変わったらページを1に戻す
  };

  // CCモーダル内の検索クエリの変更処理
  const handleCcSearchChange = (e) => {
    setCcSearchQuery(e.target.value);
  };

  // 並べ替え処理
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ソートアイコンの取得
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '▼';
  };

  // パスワード生成
  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // 8文字のランダムパスワードを生成
    const length = 8;
    
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

  // パスワード入力値のバリデーション
  const validatePassword = (e) => {
    const inputValue = e.target.value;
    
    // 英数字と記号の12文字以下にバリデーション
    if (inputValue.length > 12) {
      e.target.value = inputValue.slice(0, 12);
    }
    
    // 許可された文字以外を削除（英数字と!@#$%^&*の記号を許可）
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*]/g, '');
  };

  // パスワード通知メールテンプレートモーダルを開く
  const openPasswordTemplateModal = () => {
    setShowPasswordTemplateModal(true);
  };

  // パスワード通知メールのプレビュー表示
  const renderPasswordEmailPreview = () => {
    // プレビュー例での置換
    return passwordEmailTemplate
      .replace('<<会社名>>', '株式会社サンプル')
      .replace('<<宛先名>>', '山田 太郎')
      .replace('<<パスワード>>', document.getElementById('attachment-password')?.value || 'a8Xp2Z');
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
    
    // 送信確認ページに移動（スクロールは行わない - App.jsで処理）
    const passwordInput = document.getElementById('attachment-password');
    const sendPasswordEmail = document.getElementById('send-password-email');
    
    onConfirm({
      ...mailData,
      attachments,
      compressionSettings: {
        type: compressionType,
        password: compressionType === 'password' ? passwordInput?.value : null,
        sendPasswordEmail: compressionType === 'password' ? sendPasswordEmail?.checked : false,
        passwordEmailTemplate: passwordEmailTemplate
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
    setCcSearchQuery('');
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

  // CC検索結果をフィルタリング
  const getFilteredContacts = (contacts) => {
    if (!ccSearchQuery) return contacts;
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(ccSearchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(ccSearchQuery.toLowerCase())
    );
  };

  // CC選択状態を変更する処理
  const handleCcSelection = (checked, contact) => {
    if (checked) {
      setSelectedCc([...selectedCc, contact]);
    } else {
      setSelectedCc(selectedCc.filter(cc => cc.id !== contact.id));
    }
  };

  // 会社ごとにグループ化したCC候補を取得
  const getGroupedContacts = () => {
    if (!currentRecipientId) return {};
    
    const recipient = recipients.find(r => r.id === currentRecipientId);
    if (!recipient) return {};
    
    const contacts = getCompanyContacts(recipient.company, recipient.email);
    
    // 会社名でグループ化
    const groupedContacts = {};
    contacts.forEach(contact => {
      if (!groupedContacts[recipient.company]) {
        groupedContacts[recipient.company] = [];
      }
      groupedContacts[recipient.company].push(contact);
    });
    
    return groupedContacts;
  };

  // CCを確定する処理
  const confirmCc = () => {
    if (currentRecipientId) {
      addCc(currentRecipientId, selectedCc);
    }
    closeCcModal();
  };

  // レシピエントデータをフィルタリングしてソートする
  const getFilteredAndSortedRecipients = () => {
    // 検索条件でフィルタリング
    let filteredRecipients = recipients.filter(recipient => {
      return recipient.name.toLowerCase().includes(searchQuery.name.toLowerCase()) &&
             recipient.company.toLowerCase().includes(searchQuery.company.toLowerCase());
    });
    
    // ソート
    if (sortConfig.key) {
      filteredRecipients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredRecipients;
  };

  // 送信先削除確認ダイアログを表示
  const confirmDeleteRecipient = (recipientId) => {
    setRecipientToDelete(recipientId);
    setShowDeleteConfirm(true);
  };

  // 送信先を削除
  const executeDeleteRecipient = () => {
    if (recipientToDelete) {
      updateSelection(recipientToDelete, false);
    }
    setShowDeleteConfirm(false);
    setRecipientToDelete(null);
  };

  // 選択された受信者の表示
  const renderSelectedRecipients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, selectedRecipients.length);
    
    return (
      <table className="recipients-table">
        <thead>
          <tr>
            <th width="5%">No</th>
            <th width="15%">宛先(To)</th>
            <th width="15%">会社名</th>
            <th width="10%">部署</th>
            <th width="10%">役職</th>
            <th width="25%">CC</th>
            <th width="20%"></th>
          </tr>
        </thead>
        <tbody>
          {selectedRecipients.slice(startIndex, endIndex).map((recipient, index) => (
            <tr key={recipient.id}>
              <td>{startIndex + index + 1}</td>
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
                    onClick={() => confirmDeleteRecipient(recipient.id)}
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
    const filteredRecipients = getFilteredAndSortedRecipients();
    const startIndex = (masterCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredRecipients.length);
    
    return (
      <>
        <div className="search-filters" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              name="name" 
              placeholder="宛先名で検索..." 
              value={searchQuery.name}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              name="company" 
              placeholder="会社名で検索..." 
              value={searchQuery.company}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        <table className="recipients-table">
          <thead>
            <tr>
              <th width="5%">選択</th>
              <th width="5%" onClick={() => handleSort('id')} className="sortable">
                No {getSortIcon('id')}
              </th>
              <th width="15%" onClick={() => handleSort('name')} className="sortable">
                宛先(To) {getSortIcon('name')}
              </th>
              <th width="15%" onClick={() => handleSort('company')} className="sortable">
                会社名 {getSortIcon('company')}
              </th>
              <th width="13%" onClick={() => handleSort('department')} className="sortable">
                部署 {getSortIcon('department')}
              </th>
              <th width="12%" onClick={() => handleSort('position')} className="sortable">
                役職 {getSortIcon('position')}
              </th>
              <th width="15%">メールアドレス</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipients.slice(startIndex, endIndex).map((recipient, index) => (
              <tr key={recipient.id}>
                <td className="center-align">
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
          currentPage={masterCurrentPage}
          totalItems={filteredRecipients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setMasterCurrentPage}
          noScroll={true}
        />
      </>
    );
  };

  // テンプレート選択のスタイルを調整して二重矢印を解消
  const selectStyle = {
    maxWidth: '300px',
    appearance: 'none', // auto から none に変更して二重表示を防止
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23333\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: '30px'
  };

  return (
    <div className="container" id="mail-compose-page">
      <h1>メール一斉送信</h1>
      
      {/* メール作成フォーム */}
      <div className="form-area" style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '20px' }}>
        <div className="form-section">
          <label htmlFor="template-select">テンプレート選択</label>
          <select 
            id="template-select" 
            onChange={handleTemplateChange}
            className="select-input"
            style={selectStyle}
          >
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
            
            <div className={`compression-options ${!hasAttachments ? 'disabled' : ''}`}>
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
                    disabled={!hasAttachments}
                  />
                  <label htmlFor="compress-password">ZIP圧縮してパスワードを設定（推奨）</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    id="no-compress" 
                    name="compression" 
                    value="none"
                    checked={compressionType === 'none'}
                    onChange={handleCompressionChange}
                    disabled={!hasAttachments}
                  />
                  <label htmlFor="no-compress">圧縮しない</label>
                </div>
              </div>
              
              <div className={`form-section ${compressionType !== 'password' || !hasAttachments ? 'disabled' : ''}`} id="password-section">
                <label>パスワード（英数字12文字以内）</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    id="attachment-password" 
                    defaultValue="a8Xp2Z" 
                    style={{ flex: 1 }}
                    onInput={validatePassword}
                    disabled={compressionType !== 'password' || !hasAttachments}
                  />
                  <button 
                    className="action-btn" 
                    id="generate-password-btn"
                    onClick={generatePassword}
                    disabled={compressionType !== 'password' || !hasAttachments}
                  >
                    生成
                  </button>
                </div>
              </div>
              
              <div className={`form-section ${compressionType !== 'password' || !hasAttachments ? 'disabled' : ''}`} style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <input 
                      type="checkbox" 
                      id="send-password-email" 
                      defaultChecked 
                      style={{ marginRight: '10px', width: 'auto' }}
                      disabled={compressionType !== 'password' || !hasAttachments}
                    />
                    <label 
                      htmlFor="send-password-email" 
                      style={{ display: 'inline', marginBottom: 0 }}
                    >
                      パスワードを別メールで送信する
                    </label>
                  </div>
                  <button 
                    className="password-template-btn"
                    onClick={openPasswordTemplateModal}
                    disabled={compressionType !== 'password' || !hasAttachments}
                    style={{ 
                      fontSize: '12px', 
                      padding: '5px 10px', 
                      backgroundColor: '#f0f8ff', 
                      border: '1px solid #3498db',
                      borderRadius: '4px',
                      color: '#2980b9', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>✉️</span>
                    通知メールテンプレート編集
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 選択した送信先テーブル */}
      <div className="form-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label>送信先一覧 <span>({selectedRecipients.length}件)</span></label>
        </div>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '15px' }}>
          {renderSelectedRecipients()}
          
          {/* ページネーション */}
          <Pagination 
            currentPage={currentPage}
            totalItems={selectedRecipients.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            noScroll={true}
          />
        </div>
      </div>
      
      {/* 宛先マスタから選択 */}
      <div className="form-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label>宛先マスタ一覧 <span>({getFilteredAndSortedRecipients().length}件)</span></label>
          <button id="toggle-selection" className="toggle-btn" onClick={toggleAllSelection}>
            全選択/解除
          </button>
        </div>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px', marginBottom: '15px' }}>
          {renderRecipientsMaster()}
        </div>
      </div>
      
      <div className="clearfix">
        <button className="send-btn" onClick={handleConfirmation}>送信確認</button>
      </div>
      
      {/* 各種モーダルなどの定義は省略 */}
    </div>
  );
};

export default MailCompose;
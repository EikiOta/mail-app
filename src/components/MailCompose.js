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
  const [showCcModal, setShowCcModal] = useState(false);
  const [showPasswordEmailModal, setShowPasswordEmailModal] = useState(false);
  const [showTemplateChangeConfirm, setShowTemplateChangeConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showAttachmentDeleteConfirm, setShowAttachmentDeleteConfirm] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [leavePage, setLeavePage] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [masterCurrentPage, setMasterCurrentPage] = useState(1);
  const [ccCurrentPage, setCcCurrentPage] = useState(1);
  const [selectedCc, setSelectedCc] = useState([]); // CC選択状態をトップレベルで管理
  const [compressionType, setCompressionType] = useState('password'); // 圧縮方法: 'password', 'none'
  const [searchQuery, setSearchQuery] = useState({ name: '', company: '' });
  const [ccDepartmentFilter, setCcDepartmentFilter] = useState('all'); // 部署フィルター追加
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // デフォルトは番号順
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState(null);
  const [passwordEmail, setPasswordEmail] = useState(
    `<<会社名>> <<宛先名>>様

いつもお世話になっております。xxxのyyyです。

先ほど送信いたしましたファイルのパスワードをお知らせいたします。
パスワード: <<パスワード>>

ご不明点がございましたら、お気軽にお問い合わせください。
よろしくお願いいたします。`
  );
  const itemsPerPage = 10;
  const ccItemsPerPage = 5; // CC候補は1ページ5人に設定

  // App.jsから渡されたmailData.attachmentsを直接使用
  const attachments = mailData.attachments || [];

  // 選択された受信者のみを取得
  const selectedRecipients = recipients.filter(r => r.selected);

  // 添付ファイルがあるかどうか
  const hasAttachments = attachments.length > 0;

  useEffect(() => {
    // 初期化時にコンポーネント内の圧縮設定をmailDataから設定
    if (mailData.compressionSettings) {
      setCompressionType(mailData.compressionSettings.type || 'password');
      setPasswordEmail(mailData.compressionSettings.passwordEmailTemplate || passwordEmail);
    }
  }, []);

  // ハッシュの変更を監視してページ遷移を検知
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && hash !== 'mail-compose') {
        const hasContent = mailData.subject || mailData.content || attachments.length > 0 || selectedRecipients.length > 0;
        
        if (hasContent) {
          setLeavePage(hash);
          setShowLeaveConfirm(true);
          // 遷移をキャンセルするためにハッシュを元に戻す
          window.location.hash = 'mail-compose';
        } else {
          // 内容がなければそのまま遷移
          if (typeof window.navigateToPage === 'function') {
            window.navigateToPage(hash);
          } else {
            window.location.href = '#' + hash;
          }
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // 依存配列を空にして再登録を防止

  // ページ離脱時の警告設定
  useEffect(() => {
    // 入力内容があるかどうかをチェック
    const hasContent = mailData.subject || mailData.content || attachments.length > 0 || selectedRecipients.length > 0;
    
    // beforeunload イベントハンドラ
    const handleBeforeUnload = (e) => {
      if (hasContent) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    // イベントリスナーを追加
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mailData, attachments, selectedRecipients]);

  // ページ遷移前の確認処理（Navigation.jsから呼ばれる）
  const handlePageNavigation = (page) => {
    // 入力内容があるかどうかをチェック
    const hasContent = mailData.subject || mailData.content || attachments.length > 0 || selectedRecipients.length > 0;
    
    if (hasContent) {
      setLeavePage(page);
      setShowLeaveConfirm(true);
      return false; // 遷移を中止
    }
    
    return true; // 通常通り遷移
  };

  // 実際のページ遷移処理
  const executeLeavePage = () => {
    setShowLeaveConfirm(false);
    
    // App.jsのsetCurrentPageにページ情報を渡す
    if (typeof window.navigateToPage === 'function') {
      window.navigateToPage(leavePage);
    } else {
      // fallback - 直接画面遷移（通常は使用されない）
      window.location.href = '#' + leavePage;
    }
  };

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

  // パスワード通知メール変更時の処理
  const handlePasswordEmailChange = (e) => {
    setPasswordEmail(e.target.value);
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
      
      // mailData.attachmentsを更新
      setMailData({
        ...mailData,
        attachments: [...attachments, {
          name: file.name,
          size: sizeStr,
          file
        }]
      });
    }
  };

  // 添付ファイル削除確認ダイアログを表示
  const confirmAttachmentDelete = (index) => {
    setAttachmentToDelete(index);
    setShowAttachmentDeleteConfirm(true);
  };

  // 添付ファイル削除時の処理
  const removeAttachment = () => {
    if (attachmentToDelete !== null) {
      // mailData.attachmentsから削除
      setMailData({
        ...mailData,
        attachments: attachments.filter((_, i) => i !== attachmentToDelete)
      });
      setAttachmentToDelete(null);
      setShowAttachmentDeleteConfirm(false);
    }
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

  // 部署フィルターの変更処理
  const handleDepartmentFilterChange = (e) => {
    setCcDepartmentFilter(e.target.value);
    setCcCurrentPage(1); // フィルター変更時にページを1に戻す
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
    
    // 6~12文字のランダムパスワードを生成
    const length = Math.floor(Math.random() * 7) + 6; // 6~12文字のランダムな長さ
    
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
    
    // 6~12文字の半角英数字記号にバリデーション
    if (inputValue.length > 12) {
      e.target.value = inputValue.slice(0, 12);
    }
    
    // 許可された文字以外を削除（英数字と!@#$%^&*の記号を許可）
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*]/g, '');
  };

  // パスワード通知メールモーダルを開く
  const openPasswordEmailModal = () => {
    setShowPasswordEmailModal(true);
  };

  // パスワード通知メールのプレビュー表示
  const renderPasswordEmailPreview = () => {
    // プレビュー例での置換
    return passwordEmail
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
        passwordEmailTemplate: passwordEmail
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
    setCcDepartmentFilter('all');
    setCcCurrentPage(1);
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
        email: r.email,
        department: r.department
      }));
  };

  // 部署リストを取得（フィルタリング用）
  const getDepartmentList = (contacts) => {
    const departments = new Set(contacts.map(c => c.department));
    return ['all', ...Array.from(departments)];
  };

  // CC検索結果をフィルタリング
  const getFilteredContacts = (contacts) => {
    if (ccDepartmentFilter === 'all') return contacts;
    
    return contacts.filter(contact => 
      contact.department === ccDepartmentFilter
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
                  {recipient.cc && recipient.cc.length > 0 ? (
                    recipient.cc.map((cc, ccIndex) => (
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
                    ))
                  ) : (
                    <span className="no-cc">なし</span>
                  )}
                </div>
              </td>
              <td>
                <div className="action-buttons" style={{ display: 'flex', gap: '15px' }}>
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

  // CCモーダルのレンダリング
  const renderCcModal = () => {
    if (!showCcModal) return null;
    
    const recipient = recipients.find(r => r.id === currentRecipientId);
    if (!recipient) return null;
    
    const groupedContacts = getGroupedContacts();
    const companyContacts = groupedContacts[recipient.company] || [];
    const departmentList = getDepartmentList(companyContacts);
    
    // 部署でフィルター
    const filteredContacts = getFilteredContacts(companyContacts);
    
    // ページネーション
    const startIndex = (ccCurrentPage - 1) * ccItemsPerPage;
    const endIndex = Math.min(startIndex + ccItemsPerPage, filteredContacts.length);
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);
    
    return (
      <Modal onClose={closeCcModal} fixedHeight={true}>
        <div className="modal-header" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px', marginBottom: '15px' }}>
          <h3 className="modal-title">CCを追加</h3>
        </div>
        
        <div className="modal-body" style={{ height: '400px', overflowY: 'auto' }}>
          <p style={{ marginBottom: '15px' }}>
            {recipient.name} ({recipient.company})宛のメールにCCを追加します。
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>部署でフィルター:</label>
              <select 
                value={ccDepartmentFilter} 
                onChange={handleDepartmentFilterChange}
                style={{ 
                  padding: '5px', 
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  width: '200px'
                }}
              >
                {departmentList.map(dept => (
                  <option key={dept} value={dept}>{dept === 'all' ? 'すべての部署' : dept}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>選択済みCC:</div>
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              {selectedCc.length > 0 ? (
                <div className="cc-tags">
                  {selectedCc.map((cc, index) => (
                    <span key={index} className="cc-tag">
                      {cc.name}
                      <span 
                        className="remove-cc" 
                        onClick={() => handleCcSelection(false, cc)}
                      >
                        &times;
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                "選択されていません"
              )}
            </div>
          </div>
          
          <div style={{ minHeight: '200px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>CC候補:</div>
            
            {paginatedContacts.length > 0 ? (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{recipient.company}</div>
                  <div>
                    {paginatedContacts.map(contact => {
                      const isSelected = selectedCc.some(cc => cc.id === contact.id);
                      
                      return (
                        <div key={contact.id} style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px',
                          borderBottom: '1px solid #eee',
                          lineHeight: '1.4'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => handleCcSelection(e.target.checked, contact)}
                            style={{ marginRight: '10px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div>{contact.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ color: '#666', fontSize: '14px' }}>{contact.email}</div>
                              <div style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>{contact.department}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* ページネーション */}
                  {filteredContacts.length > ccItemsPerPage && (
                    <div style={{ marginTop: '15px' }}>
                      <Pagination 
                        currentPage={ccCurrentPage}
                        totalItems={filteredContacts.length}
                        itemsPerPage={ccItemsPerPage}
                        onPageChange={setCcCurrentPage}
                        noScroll={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>選択した条件に該当する連絡先がありません。</p>
            )}
            
            {Object.keys(groupedContacts).length === 0 && (
              <p style={{ color: '#666', fontStyle: 'italic' }}>この会社の他の連絡先がありません。</p>
            )}
          </div>
        </div>
        
        <div className="modal-footer" style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '10px',
          borderTop: '1px solid #e0e0e0',
          paddingTop: '15px',
          marginTop: '15px'
        }}>
          <button 
            style={{ 
              padding: '8px 20px', 
              background: '#f5f5f5', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
            onClick={closeCcModal}
          >
            キャンセル
          </button>
          <button 
            style={{ 
              padding: '8px 20px', 
              background: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
            onClick={confirmCc}
          >
            確定
          </button>
        </div>
      </Modal>
    );
  };

  // テンプレート変更確認モーダルのレンダリング
  const renderTemplateChangeConfirmModal = () => {
    if (!showTemplateChangeConfirm) return null;
    
    return (
      <Modal onClose={() => setShowTemplateChangeConfirm(false)}>
        <div className="modal-header">
          <h3 className="modal-title">テンプレート適用確認</h3>
        </div>
        
        <div className="modal-body">
          <p>現在の件名と本文が上書きされます。よろしいですか？</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={() => setShowTemplateChangeConfirm(false)}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn"
            onClick={() => applyTemplate(selectedTemplateId)}
          >
            適用
          </button>
        </div>
      </Modal>
    );
  };

  // パスワード通知メール編集モーダルのレンダリング
  const renderPasswordEmailModal = () => {
    if (!showPasswordEmailModal) return null;
    
    return (
      <Modal onClose={() => setShowPasswordEmailModal(false)}>
        <div className="modal-header">
          <h3 className="modal-title">パスワード通知メール編集</h3>
        </div>
        
        <div className="modal-body">
          <div className="form-section">
            <p>パスワード通知メールの内容を編集してください。</p>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
              以下のプレースホルダーが使用できます：<br />
              <code>{'<<会社名>>'}</code> - 送信先の会社名<br />
              <code>{'<<宛先名>>'}</code> - 送信先の担当者名<br />
              <code>{'<<パスワード>>'}</code> - 設定したパスワード
            </p>
            
            <textarea 
              value={passwordEmail}
              onChange={handlePasswordEmailChange}
              style={{ width: '100%', minHeight: '200px' }}
            />
            
            <div style={{ marginTop: '15px' }}>
              <div className="section-label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>プレビュー:</div>
              <div style={{ 
                whiteSpace: 'pre-line', 
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                {renderPasswordEmailPreview()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={() => setShowPasswordEmailModal(false)}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn"
            onClick={() => setShowPasswordEmailModal(false)}
          >
            保存
          </button>
        </div>
      </Modal>
    );
  };
  
  // 削除確認モーダルのレンダリング
  const renderDeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    
    const recipient = recipients.find(r => r.id === recipientToDelete);
    if (!recipient) return null;
    
    return (
      <Modal onClose={() => setShowDeleteConfirm(false)}>
        <div className="modal-header">
          <h3 className="modal-title">送信先削除確認</h3>
        </div>
        
        <div className="modal-body">
          <p>
            <strong>{recipient.name}</strong> ({recipient.company})を送信先から削除してもよろしいですか？
          </p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={() => setShowDeleteConfirm(false)}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn"
            onClick={executeDeleteRecipient}
          >
            削除
          </button>
        </div>
      </Modal>
    );
  };

  // 添付ファイル削除確認モーダルのレンダリング
  const renderAttachmentDeleteConfirmModal = () => {
    if (!showAttachmentDeleteConfirm) return null;
    
    const attachment = attachments[attachmentToDelete];
    if (!attachment) return null;
    
    return (
      <Modal onClose={() => setShowAttachmentDeleteConfirm(false)}>
        <div className="modal-header">
          <h3 className="modal-title">添付ファイル削除確認</h3>
        </div>
        
        <div className="modal-body">
          <p>
            <strong>{attachment.name}</strong> を削除してもよろしいですか？
          </p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={() => setShowAttachmentDeleteConfirm(false)}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn"
            onClick={removeAttachment}
          >
            削除
          </button>
        </div>
      </Modal>
    );
  };

  // ページ離脱確認モーダルのレンダリング
  const renderLeaveConfirmModal = () => {
    if (!showLeaveConfirm) return null;
    
    return (
      <Modal onClose={() => setShowLeaveConfirm(false)}>
        <div className="modal-header">
          <h3 className="modal-title">ページ移動確認</h3>
        </div>
        
        <div className="modal-body">
          <p>作成中のメールは破棄されます。よろしいですか？</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={() => setShowLeaveConfirm(false)}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn"
            onClick={executeLeavePage}
          >
            移動する
          </button>
        </div>
      </Modal>
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
      <h1>メール作成</h1>
      
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
                      onClick={() => confirmAttachmentDelete(index)}
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
                <label>パスワード（6~12文字の半角英数字記号）</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    id="attachment-password" 
                    defaultValue={mailData.compressionSettings?.password || "a8Xp2Z"}
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
                      defaultChecked={mailData.compressionSettings?.sendPasswordEmail !== false}
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
                    onClick={openPasswordEmailModal}
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
                    パスワード通知メール編集
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
      
      {/* 各種モーダル */}
      {renderCcModal()}
      {renderTemplateChangeConfirmModal()}
      {renderPasswordEmailModal()}
      {renderDeleteConfirmModal()}
      {renderAttachmentDeleteConfirmModal()}
      {renderLeaveConfirmModal()}
    </div>
  );
};

// ページ遷移の確認メソッドをエクスポート
MailCompose.handlePageNavigation = (page) => {
  // このメソッドはApp.jsから呼ばれる予定
  // 実装はここでは行わず、App.jsでインスタンスメソッドとして扱う
  return true;
};

export default MailCompose;
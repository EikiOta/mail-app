// src/components/ConfirmPage.js
import React, { useState, useEffect } from 'react';
import { Modal } from './common/Modal';

const ConfirmPage = ({ 
  mailData, 
  selectedRecipients, 
  onBack, 
  onSend 
}) => {
  const [showSendingModal, setShowSendingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [recipientGreetings, setRecipientGreetings] = useState({});
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewRecipient, setPreviewRecipient] = useState(null);
  const [showPasswordEmailPreview, setShowPasswordEmailPreview] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // コンポーネントがマウントされた時に、各宛先ごとの挨拶文を初期化
  useEffect(() => {
    const greetings = {};
    
    selectedRecipients.forEach(recipient => {
      // 宛先に合わせた挨拶文を自動生成
      greetings[recipient.id] = `${recipient.company} ${recipient.name}様

`;
    });
    
    setRecipientGreetings(greetings);
  }, [selectedRecipients]);

  // クリーンアップ関数
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // 挨拶文の変更を処理する関数
  const handleGreetingChange = (recipientId, newGreeting) => {
    setRecipientGreetings(prev => ({
      ...prev,
      [recipientId]: newGreeting
    }));
  };

  // 送信実行時の処理
  const executeSend = () => {
    setShowSendingModal(true);
    setProgress(0);
    setProcessed(0);
    setCanceled(false);
    
    // 送信プロセスをシミュレート
    const totalCount = selectedRecipients.length;
    let count = 0;
    
    const interval = setInterval(() => {
      // キャンセルされた場合、処理を中断
      if (canceled) {
        clearInterval(interval);
        
        setTimeout(() => {
          setShowSendingModal(false);
          // 中断した状態で結果画面へ（送信済件数を渡す）
          onSend(processed);
        }, 500);
        return;
      }
      
      count++;
      const percent = Math.round((count / totalCount) * 100);
      
      setProgress(percent);
      setProcessed(count);
      
      if (count >= totalCount) {
        clearInterval(interval);
        
        // 全件処理完了後、少し待ってから結果画面へ
        setTimeout(() => {
          setShowSendingModal(false);
          onSend();
        }, 500);
      }
    }, 2000 / totalCount);
    
    // インターバルIDを保存して後でクリーンアップできるようにする
    setIntervalId(interval);
  };

  // 送信中止の処理 - 即座に中断するように修正
  const cancelSending = () => {
    if (window.confirm('送信を中止してもよろしいですか？')) {
      // 現在のインターバルをクリアして処理を停止
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      setCanceled(true);
      
      // 直ちに送信モーダルを閉じる
      setShowSendingModal(false);
      
      // 現在のprocessed数を使って結果画面へ遷移
      onSend(processed);
    }
  };

  // プレビューモーダルを開く
  const openPreviewModal = (recipient) => {
    setPreviewRecipient(recipient);
    setPreviewModalOpen(true);
  };

  // パスワード通知メールプレビューを表示
  const getPasswordEmailContent = (recipient) => {
    if (!mailData.compressionSettings || 
        mailData.compressionSettings.type !== 'password' || 
        !mailData.compressionSettings.sendPasswordEmail) {
      return null;
    }
    
    let template = mailData.compressionSettings.passwordEmailTemplate || '';
    return template
      .replace('<<会社名>>', recipient.company)
      .replace('<<宛先名>>', recipient.name)
      .replace('<<パスワード>>', mailData.compressionSettings.password || 'a8Xp2Z');
  };

  // 添付ファイル情報の表示
  const renderAttachmentInfo = () => {
    if (!mailData.attachments || mailData.attachments.length === 0) {
      return <div style={{ color: '#666' }}>添付ファイルはありません</div>;
    }
    
    // 圧縮設定の表示テキストを決定
    let compressionSettingText = '';
    if (mailData.compressionSettings) {
      if (mailData.compressionSettings.type === 'password') {
        compressionSettingText = `ZIP圧縮してパスワードを設定（パスワード: ${mailData.compressionSettings.password}）`;
        if (mailData.compressionSettings.sendPasswordEmail) {
          compressionSettingText += '　※パスワードは別メールで送信されます';
        }
      } else {
        compressionSettingText = '圧縮なし';
      }
    } else {
      compressionSettingText = 'ZIP圧縮してパスワードを設定（自動生成されたパスワード: a8Xp2Z）';
    }
    
    return (
      <div>
        {mailData.attachments.map((attachment, index) => (
          <div key={index} className="attachment-item">
            <div className="attachment-icon">📄</div>
            <div className="attachment-name">{attachment.name}</div>
            <div className="attachment-size">{attachment.size}</div>
          </div>
        ))}
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>設定:</strong> {compressionSettingText}
        </div>
      </div>
    );
  };

  // 送信中プログレスモーダルの表示
  const renderSendingProgressModal = () => {
    return (
      <Modal onClose={() => {}}>
        <div className="modal-content sending-progress">
          <h3>メール送信中...</h3>
          <div id="send-progress-bar">
            <div id="send-progress" style={{ width: `${progress}%` }}></div>
          </div>
          <div id="send-progress-text">{processed} / {selectedRecipients.length} 件完了</div>
          <div style={{ marginTop: '20px' }}>
            <button 
              id="cancel-sending-btn" 
              className="action-btn warning"
              onClick={cancelSending}
            >
              送信中止
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // メールプレビューモーダルを表示
  const renderPreviewModal = () => {
    if (!previewRecipient) return null;
    
    const greeting = recipientGreetings[previewRecipient.id] || '';
    const passwordEmailContent = getPasswordEmailContent(previewRecipient);
    
    return (
      <Modal onClose={() => setPreviewModalOpen(false)}>
        <div className="modal-header">
          <h3 className="modal-title">メールプレビュー</h3>
        </div>
        
        <div className="modal-body">
          <div className="confirmation-section" style={{ border: 'none', padding: '0' }}>
            <div className="confirmation-label">宛先</div>
            <div className="confirmation-value">
              {previewRecipient.name} ({previewRecipient.company})
            </div>
          </div>
          
          <div className="confirmation-section" style={{ border: 'none', padding: '0' }}>
            <div className="confirmation-label">件名</div>
            <div className="confirmation-value">{mailData.subject}</div>
          </div>
          
          <div className="confirmation-section" style={{ border: 'none', padding: '0' }}>
            <div className="confirmation-label">メール内容</div>
            <div className="confirmation-value" style={{ 
              whiteSpace: 'pre-line', 
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #e0e0e0' 
            }}>
              {greeting}{mailData.content}
            </div>
          </div>
          
          {mailData.attachments && mailData.attachments.length > 0 && (
            <div className="confirmation-section" style={{ border: 'none', padding: '0' }}>
              <div className="confirmation-label">添付ファイル</div>
              <div className="confirmation-value">
                {renderAttachmentInfo()}
              </div>
            </div>
          )}

          {passwordEmailContent && (
            <div className="confirmation-section" style={{ border: 'none', padding: '0' }}>
              <div className="confirmation-label">パスワード通知メール</div>
              <div className="confirmation-value" style={{ 
                whiteSpace: 'pre-line', 
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0', 
                color: '#333'
              }}>
                {passwordEmailContent}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="action-btn" onClick={() => setPreviewModalOpen(false)}>閉じる</button>
        </div>
      </Modal>
    );
  };

  // パスワード通知メールをプレビュー表示するモーダル
  const renderPasswordEmailPreviewModal = () => {
    if (!mailData.compressionSettings || 
        mailData.compressionSettings.type !== 'password' || 
        !mailData.compressionSettings.sendPasswordEmail) {
      return null;
    }

    // サンプル宛先を使ってプレビュー
    const sampleRecipient = selectedRecipients[0] || { company: '株式会社サンプル', name: '山田 太郎' };
    const previewContent = getPasswordEmailContent(sampleRecipient);
    
    return (
      <Modal onClose={() => setShowPasswordEmailPreview(false)}>
        <div className="modal-header">
          <h3 className="modal-title">パスワード通知メールプレビュー</h3>
        </div>
        
        <div className="modal-body">
          <p>各宛先に以下のフォーマットでパスワード通知メールが送信されます。</p>
          
          <div className="confirmation-section" style={{ border: 'none', padding: '0' }}>
            <div className="confirmation-label">プレビュー例</div>
            <div className="confirmation-value" style={{ 
              whiteSpace: 'pre-line', 
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #e0e0e0'
            }}>
              {previewContent}
            </div>
          </div>
          
          <p className="note" style={{ fontSize: '14px', color: '#666', marginTop: '15px' }}>
            ※ 実際には各宛先の情報（会社名、担当者名）が自動的に挿入されます。
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="action-btn" onClick={() => setShowPasswordEmailPreview(false)}>閉じる</button>
        </div>
      </Modal>
    );
  };

  // パスワード通知が有効かどうか
  const hasPasswordEmail = mailData.compressionSettings && 
                        mailData.compressionSettings.type === 'password' && 
                        mailData.compressionSettings.sendPasswordEmail;

  return (
    <div className="container" id="confirm-page">
      <h1>送信確認</h1>
      
      <div className="confirmation-section">
        <div className="confirmation-label">件名</div>
        <div className="confirmation-value">{mailData.subject}</div>
      </div>
      
      <div className="confirmation-section">
        <div className="confirmation-label">本文</div>
        <div className="confirmation-value" style={{ whiteSpace: 'pre-line' }}>
          {mailData.content}
        </div>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
          ※ 実際に送信されるメールには、各宛先ごとに適切な挨拶文が追加されます。下記の送信先一覧から挨拶文を確認・編集できます。
        </p>
      </div>
      
      <div className="confirmation-section">
        <div className="confirmation-label">添付ファイル</div>
        <div className="confirmation-value">
          {renderAttachmentInfo()}
        </div>
      </div>
      
      {hasPasswordEmail && (
        <div className="confirmation-section">
          <div className="confirmation-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>パスワード通知メール</span>
            <button 
              className="log-details-btn"
              onClick={() => setShowPasswordEmailPreview(true)}
              style={{ 
                backgroundColor: '#e8f5fe', 
                border: '1px solid #3498db',
                color: '#2980b9',
                fontSize: '12px'
              }}
            >
              プレビュー表示
            </button>
          </div>
          <div className="confirmation-value" style={{ color: '#666' }}>
            添付ファイルのパスワードを別メールで各宛先に送信します。
          </div>
        </div>
      )}
      
      <div className="confirmation-section">
        <div className="confirmation-label">送信先 (合計: {selectedRecipients.length}件)</div>
        <div className="confirmation-value confirmation-recipients">
          <table className="recipients-table">
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="15%">宛先(To)</th>
                <th width="15%">会社名</th>
                <th width="25%">挨拶文</th>
                <th width="25%">CC</th>
                <th width="15%"></th>
              </tr>
            </thead>
            <tbody>
              {selectedRecipients.map((recipient, index) => (
                <tr key={recipient.id}>
                  <td>{index + 1}</td>
                  <td>{recipient.name}</td>
                  <td>{recipient.company}</td>
                  <td>
                    <div style={{ 
                      maxHeight: '60px', 
                      overflow: 'hidden'
                      // position: 'relative' を削除
                    }}>
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {recipientGreetings[recipient.id]}
                      </div>
                      {/* フェードアウト効果のための背景グラデーションを削除 */}
                    </div>
                    <button 
                      className="log-details-btn" 
                      style={{ marginTop: '5px' }}
                      onClick={() => {
                        const newGreeting = prompt(
                          '挨拶文を編集してください', 
                          recipientGreetings[recipient.id]
                        );
                        if (newGreeting !== null) {
                          handleGreetingChange(recipient.id, newGreeting);
                        }
                      }}
                    >
                      編集
                    </button>
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
                    <button 
                      className="log-details-btn"
                      onClick={() => openPreviewModal(recipient)}
                    >
                      プレビュー
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="confirmation-footer">
        <button className="action-btn" onClick={onBack}>編集に戻る</button>
        <button className="action-btn success" onClick={executeSend}>送信実行</button>
      </div>
      
      {/* 送信プログレスモーダル */}
      {showSendingModal && renderSendingProgressModal()}
      
      {/* メールプレビューモーダル */}
      {previewModalOpen && renderPreviewModal()}

      {/* パスワード通知メールプレビューモーダル */}
      {showPasswordEmailPreview && renderPasswordEmailPreviewModal()}
    </div>
  );
};

export default ConfirmPage;
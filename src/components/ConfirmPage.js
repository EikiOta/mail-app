// src/components/ConfirmPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './common/Modal';
import Pagination from './common/Pagination';

const ConfirmPage = ({ 
  mailData, 
  selectedRecipients, 
  onBack, 
  onSend 
}) => {
  const [showSendingModal, setShowSendingModal] = useState(false);
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false); // 送信中止確認モーダル用の状態
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewRecipient, setPreviewRecipient] = useState(null);
  const [canceled, setCanceled] = useState(false);
  const [paused, setPaused] = useState(false); // 送信一時停止フラグを追加
  const [intervalId, setIntervalId] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leavePage, setLeavePage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 送信処理の状態を保持するためのref
  const sendingStateRef = useRef({
    totalCount: 0,
    lastProcessedCount: 0
  });
  
  const itemsPerPage = 10;

  // Navigation.jsのonPageChange経由の遷移を検知
  useEffect(() => {
    // 元のナビゲーション関数を保存（存在確認付き）
    const originalNavigateToPage = typeof window.navigateToPage === 'function' 
      ? window.navigateToPage 
      : null;
    
    // ナビゲーション関数をオーバーライド
    window.navigateToPage = (page) => {
      // 「編集に戻る」または「送信実行」以外の遷移時に警告
      if (page !== 'mail-compose' && page !== 'result') {
        setLeavePage(page);
        setShowLeaveConfirm(true);
        return false;
      } else {
        // mail-compose か result への遷移は許可
        if (originalNavigateToPage) {
          originalNavigateToPage(page);
        } else {
          // 元の関数がない場合はフォールバック処理
          window.location.hash = page;
        }
        return true;
      }
    };
    
    // クリーンアップ関数
    return () => {
      // 元のナビゲーション関数が存在する場合のみ戻す
      if (originalNavigateToPage) {
        window.navigateToPage = originalNavigateToPage;
      }
    };
  }, []);

  // ハッシュの変更を監視してページ遷移を検知
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && hash !== 'confirm') {
        // 「編集に戻る」または「送信実行」以外の遷移時に警告
        if (hash !== 'mail-compose' && hash !== 'result') {
          setLeavePage(hash);
          setShowLeaveConfirm(true);
        } else {
          // mail-compose か result への遷移は警告なしで許可
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
  }, []);

  // ページ離脱時の警告設定
  useEffect(() => {
    // beforeunload イベントハンドラ
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    // イベントリスナーを追加
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // クリーンアップ関数
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // 実際のページ遷移処理
  const executeLeavePage = () => {
    setShowLeaveConfirm(false);
    
    // App.jsのsetCurrentPageにページ情報を渡す
    if (typeof window.navigateToPage === 'function') {
      // 直接window.navigateToPageを呼び出すのではなく、
      // ハッシュを変更してApp.jsのイベントハンドラに検知させる
      window.location.hash = ''; // 現在のハッシュをクリア
      setTimeout(() => {
        window.location.hash = 'direct-' + leavePage; // 特殊なプレフィックスを追加
      }, 50);
    } else {
      // fallback - 直接画面遷移（通常は使用されない）
      window.location.href = '#' + leavePage;
    }
  };

  // 送信確認モーダルを表示
  const openSendConfirmModal = () => {
    setShowSendConfirmModal(true);
  };

  // 送信処理用インターバルを開始する関数
  const startSendingInterval = (initialCount = 0) => {
    // 現在のインターバルがあればクリア
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    const totalCount = selectedRecipients.length;
    let count = initialCount;
    
    // 状態をrefに保存
    sendingStateRef.current = {
      totalCount,
      lastProcessedCount: count
    };
    
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
      
      // refの状態も更新
      sendingStateRef.current.lastProcessedCount = count;
      
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
    
    return interval;
  };

  // 送信実行時の処理
  const executeSend = () => {
    setShowSendConfirmModal(false);
    setShowSendingModal(true);
    setProgress(0);
    setProcessed(0);
    setCanceled(false);
    setPaused(false);
    
    // 送信処理を開始
    startSendingInterval(0);
  };

  // 送信中止確認モーダルを表示し、送信を一時停止する
  const cancelSending = () => {
    // 現在のインターバルを停止（一時停止）
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    // 一時停止状態に設定
    setPaused(true);
    
    // 送信中止確認モーダルを表示
    setShowCancelConfirmModal(true);
  };

  // 送信中止をキャンセルして送信を再開する処理
  const resumeSending = () => {
    // 送信中止確認モーダルを閉じる
    setShowCancelConfirmModal(false);
    
    // 送信を再開
    setPaused(false);
    
    // 保存された状態から処理を再開
    const lastCount = sendingStateRef.current.lastProcessedCount;
    startSendingInterval(lastCount);
  };

  // 実際に送信を中止する処理
  const executeCancelSending = () => {
    // 現在のインターバルをクリアして処理を停止
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    setPaused(false);
    setCanceled(true);
    setShowCancelConfirmModal(false);
    
    // 直ちに送信モーダルを閉じる
    setShowSendingModal(false);
    
    // 現在のprocessed数を使って結果画面へ遷移
    onSend(processed);
  };

  // プレビューモーダルを開く
  const openPreviewModal = (recipient) => {
    setPreviewRecipient(recipient);
    setPreviewModalOpen(true);
  };

  // パスワード通知メールの内容を取得
  const getPasswordEmailContent = (recipient) => {
    if (!mailData.attachments || 
        mailData.attachments.length === 0 ||
        !mailData.compressionSettings || 
        mailData.compressionSettings.type !== 'password' || 
        !mailData.compressionSettings.sendPasswordEmail) {
      return null;
    }
    
    let template = mailData.compressionSettings.passwordEmailTemplate || '';
    return template
      .replace('<<会社名>>', recipient.company)
      .replace('<<名前>>', recipient.name)
      .replace('<<パスワード>>', mailData.compressionSettings.password || 'a8Xp2Z');
  };

  // サンプル宛先でパスワード通知メールの内容を表示
  const getPasswordEmailSample = () => {
    const sampleTemplate = mailData.compressionSettings?.passwordEmailTemplate || '';
    // プレースホルダーはそのまま表示
    return sampleTemplate;
  };

  // 拡張子を除去した名前を取得する関数
  const getFilenameWithoutExtension = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  // ファイル名を圧縮設定に応じて表示
  const getDisplayFileName = (attachment) => {
    if (mailData.compressionSettings && 
        mailData.compressionSettings.type === 'password' && 
        attachment) {
      const nameWithoutExt = getFilenameWithoutExtension(attachment.name);
      return `${nameWithoutExt}.zip`;
    }
    return attachment ? attachment.name : '';
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
            <div className="attachment-name">{getDisplayFileName(attachment)}</div>
            <div className="attachment-size">{attachment.size}</div>
          </div>
        ))}
        
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <strong>設定:</strong> {compressionSettingText}
        </div>
      </div>
    );
  };

  // 送信確認モーダルを表示
  const renderSendConfirmModal = () => {
    return (
      <Modal onClose={() => setShowSendConfirmModal(false)}>
        <div className="modal-header">
          <h3 className="modal-title">送信確認</h3>
        </div>
        <div className="modal-body">
          <p>選択した {selectedRecipients.length} 件の宛先にメールを送信します。よろしいですか？</p>
          <p style={{ color: '#666', fontSize: '14px' }}>※送信したメールは取り消しできません</p>
          
          {mailData.attachments && mailData.attachments.length > 0 && (
            <div style={{ 
              backgroundColor: '#f9f9f9', 
              padding: '10px', 
              marginTop: '10px', 
              borderRadius: '4px', 
              border: '1px solid #e0e0e0' 
            }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>添付ファイル情報:</p>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {mailData.attachments.map((attachment, index) => (
                  <li key={index}>{getDisplayFileName(attachment)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={() => setShowSendConfirmModal(false)}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn"
            onClick={executeSend}
          >
            送信する
          </button>
        </div>
      </Modal>
    );
  };

  // 送信中止確認モーダルのレンダリング
  const renderCancelConfirmModal = () => {
    return (
      <Modal onClose={resumeSending} highZIndex={true}>
        <div className="modal-header">
          <h3 className="modal-title">送信中止確認</h3>
        </div>
        <div className="modal-body">
          <p>送信を中止してもよろしいですか？</p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            中止した場合、現在までに送信されたメール（{processed}件）はキャンセルできません。
          </p>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            marginTop: '10px', 
            borderRadius: '4px', 
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            color: '#666'
          }}>
            ※ 送信処理は一時停止中です。キャンセルボタンをクリックすると送信を再開します。
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={resumeSending}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn warning"
            onClick={executeCancelSending}
          >
            送信中止
          </button>
        </div>
      </Modal>
    );
  };

  // 送信中プログレスモーダルの表示
  const renderSendingProgressModal = () => {
    // 送信一時停止中かどうかのステータステキスト
    const statusText = paused 
      ? "送信処理を一時停止中..." 
      : `${processed} / ${selectedRecipients.length} 件完了`;

    return (
      <Modal onClose={() => {}}>
        <div className="modal-content sending-progress">
          <h3>メール送信中{paused ? '（一時停止中）' : '...'}</h3>
          <div id="send-progress-bar">
            <div id="send-progress" style={{ 
              width: `${progress}%`,
              background: paused ? '#f39c12' : '#2ecc71'
            }}></div>
          </div>
          <div id="send-progress-text">{statusText}</div>
          <div style={{ marginTop: '20px' }}>
            <button 
              id="cancel-sending-btn" 
              className="action-btn warning"
              onClick={cancelSending}
              disabled={paused} // 一時停止中は送信中止ボタンを無効化
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
    
    // プレースホルダーを置換したメール本文
    const previewContent = mailData.content
      .replace('<<会社名>>', previewRecipient.company)
      .replace('<<名前>>', previewRecipient.name);
    
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
              {previewContent}
            </div>
          </div>
          
          {mailData.attachments && mailData.attachments.length > 0 && (
            <div className="confirmation-section" style={{ border: 'none', padding: '0' }}>
              <div className="confirmation-label">添付ファイル</div>
              <div className="confirmation-value">
                {mailData.attachments.map((attachment, index) => (
                  <div key={index} className="attachment-item" style={{ marginBottom: '5px' }}>
                    <div className="attachment-icon">📄</div>
                    <div className="attachment-name">{getDisplayFileName(attachment)}</div>
                    <div className="attachment-size">{attachment.size}</div>
                  </div>
                ))}
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

  // ページ離脱確認モーダルのレンダリング
  const renderLeaveConfirmModal = () => {
    if (!showLeaveConfirm) return null;
    
    return (
      <Modal onClose={() => setShowLeaveConfirm(false)}>
        <div className="modal-header">
          <h3 className="modal-title">ページ移動確認</h3>
        </div>
        
        <div className="modal-body">
          <p>送信確認中のメールは破棄されます。よろしいですか？</p>
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

  // ページング用の関数
  const getPaginatedRecipients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, selectedRecipients.length);
    return selectedRecipients.slice(startIndex, endIndex);
  };

  // パスワード通知が有効かどうか - 添付ファイルの有無もチェック
  const hasPasswordEmail = mailData.attachments && 
                        mailData.attachments.length > 0 &&
                        mailData.compressionSettings && 
                        mailData.compressionSettings.type === 'password' && 
                        mailData.compressionSettings.sendPasswordEmail;

  // パスワード通知メールのサンプル内容
  const passwordEmailSample = getPasswordEmailSample();

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
          ※ 送信時に「&lt;&lt;会社名&gt;&gt;」「&lt;&lt;名前&gt;&gt;」などのプレースホルダーは宛先ごとに自動的に置換されます。
          各宛先のプレビューは下記の送信先一覧から確認できます。
        </p>
      </div>
      
      <div className="confirmation-section">
        <div className="confirmation-label">添付ファイル</div>
        <div className="confirmation-value">
          {renderAttachmentInfo()}
        </div>
      </div>
      
      {/* パスワード通知メールを直接表示する方式に変更 */}
      {hasPasswordEmail && (
        <div className="confirmation-section">
          <div className="confirmation-label">パスワード通知メール</div>
          <div className="confirmation-value">
            <div style={{ 
              whiteSpace: 'pre-line',
              backgroundColor: '#f9f9f9',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #e0e0e0'
            }}>
              {passwordEmailSample}
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              ※ 各宛先ごとに会社名、担当者名が自動的に挿入されます。
            </p>
          </div>
        </div>
      )}
      
      <div className="confirmation-section">
        <div className="confirmation-label">送信先 (合計: {selectedRecipients.length}件)</div>
        <div className="confirmation-value confirmation-recipients">
          {selectedRecipients.length > 0 ? (
            <>
              <table className="recipients-table">
                <thead>
                  <tr>
                    <th width="5%">No</th>
                    <th width="20%">宛先(To)</th>
                    <th width="20%">会社名</th>
                    <th width="30%">CC</th>
                    <th width="25%"></th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedRecipients().map((recipient, index) => (
                    <tr key={recipient.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{recipient.name}</td>
                      <td>{recipient.company}</td>
                      <td>
                        <div className="cc-tags">
                          {recipient.cc && recipient.cc.length > 0 ? (
                            recipient.cc.map((cc, ccIndex) => (
                              <span key={ccIndex} className="cc-tag">
                                {cc.name}
                              </span>
                            ))
                          ) : (
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

              {/* ページネーション */}
              {selectedRecipients.length > itemsPerPage && (
                <Pagination 
                  currentPage={currentPage}
                  totalItems={selectedRecipients.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  noScroll={true}
                />
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              送信先が選択されていません。メール作成画面で送信先を選択してください。
            </div>
          )}
        </div>
      </div>
      
      <div className="confirmation-footer">
        <button className="action-btn" onClick={onBack}>編集に戻る</button>
        <button 
          className="action-btn success" 
          onClick={openSendConfirmModal}
          disabled={selectedRecipients.length === 0}
        >
          送信実行
        </button>
      </div>
      
      {/* 送信確認モーダル */}
      {showSendConfirmModal && renderSendConfirmModal()}
      
      {/* 送信プログレスモーダル */}
      {showSendingModal && renderSendingProgressModal()}
      
      {/* 送信中止確認モーダル - モーダルの順序を変更 */}
      {showCancelConfirmModal && renderCancelConfirmModal()}
      
      {/* メールプレビューモーダル */}
      {previewModalOpen && renderPreviewModal()}

      {/* ページ離脱確認モーダル */}
      {showLeaveConfirm && renderLeaveConfirmModal()}
    </div>
  );
};

// ページ遷移の確認メソッドをエクスポート（App.jsから呼び出せるように）
ConfirmPage.handlePageNavigation = (page) => {
  // このメソッドはApp.jsから呼ばれる予定
  if (page !== 'mail-compose' && page !== 'result') {
    // ここでモーダルを表示したいが、静的メソッドなのでstateにアクセスできない
    return false; // 遷移を中止（App.jsがこの結果を使って警告モーダルを表示する）
  }
  return true; // 通常通り遷移
};

export default ConfirmPage;
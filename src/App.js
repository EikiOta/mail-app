// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import MailCompose from './components/MailCompose';
import ConfirmPage from './components/ConfirmPage';
import ResultPage from './components/ResultPage';
import Settings from './components/Settings';
import Logs from './components/Logs';
import { generateDummyContacts } from './utils/data';
import './styles/styles.css';

function App() {
  // 現在のページ状態
  const [currentPage, setCurrentPage] = useState('home');
  
  // アプリの状態管理
  const [recipientsMaster, setRecipientsMaster] = useState([]);
  const [logs, setLogs] = useState([]);
  const [mailData, setMailData] = useState({
    subject: '',
    content: '',
    attachments: []
  });
  
  // MailComposeコンポーネントの参照を保持
  const mailComposeRef = useRef(null);
  const confirmPageRef = useRef(null);
  
  // 送信結果の状態
  const [sendResult, setSendResult] = useState({
    totalCount: 0,
    successCount: 0,
    errorCount: 0,
    canceled: false,
    processedCount: 0
  });

  // 顧客管理リスト最終同期日時
  const [lastImportDate, setLastImportDate] = useState('2025/04/10 15:30');

  // 現在のハッシュを監視する
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      
      // hashがあり、かつ現在のページと異なる場合だけ処理する
      if (hash && hash !== currentPage && hash !== 'direct-') {
        // "direct-"プレフィックスがついている場合は特別処理
        if (hash.startsWith('direct-')) {
          const targetPage = hash.replace('direct-', '');
          setCurrentPage(targetPage);
          window.location.hash = '';
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentPage]);

  // 初期化
  useEffect(() => {
    // グローバルにページ遷移関数を設定
    window.navigateToPage = (page) => {
      console.log(`[App] navigateToPage called with page: ${page}, currentPage: ${currentPage}`);
      
      const executePageChange = () => {
        // ナビゲーション実行（直接ページを変更）
        setCurrentPage(page);
        // ナビゲーション後にURLのハッシュを更新（オプショナル）
        window.location.hash = page;
      };
      
      // メール作成画面からの遷移
      if (currentPage === 'mail-compose') {
        // メール作成画面からの遷移を確認
        if (mailComposeRef.current && typeof mailComposeRef.current.handleNavigationRequest === 'function') {
          const canNavigate = mailComposeRef.current.handleNavigationRequest(page);
          if (!canNavigate) {
            // 遷移拒否（モーダル表示などが行われる）
            return;
          }
        }
      } 
      // 送信確認画面からの遷移
      else if (currentPage === 'confirm') {
        // 「編集に戻る」または「送信実行」以外の遷移は確認が必要
        if (page !== 'mail-compose' && page !== 'result') {
          if (confirmPageRef.current && typeof confirmPageRef.current.handleNavigationRequest === 'function') {
            const canNavigate = confirmPageRef.current.handleNavigationRequest(page);
            if (!canNavigate) {
              // 遷移拒否（モーダル表示などが行われる）
              return;
            }
          }
        }
      }
      
      // 特に条件なく遷移を許可
      executePageChange();
    };

    return () => {
      // クリーンアップ時に削除
      delete window.navigateToPage;
    };
  }, [currentPage]);

  // アプリの初期データをロード
  useEffect(() => {
    // 30件のダミーデータを生成
    const contacts = generateDummyContacts(30);
    setRecipientsMaster(contacts);
    
    // ダミーのログデータをセット
    setLogs([
      {
        id: 1,
        date: '2025/04/15 14:30',
        subject: '技術者のご紹介',
        totalCount: 25,
        successCount: 25,
        errorCount: 0,
        status: 'success',
        templateId: 1,
        passwordEmailSuccess: 25,
        passwordEmailError: 0
      },
      {
        id: 2,
        date: '2025/04/14 11:15',
        subject: '新規案件のご案内',
        totalCount: 42,
        successCount: 42,
        errorCount: 0,
        status: 'success',
        templateId: 2,
        passwordEmailSuccess: 42,
        passwordEmailError: 0
      },
      {
        id: 3,
        date: '2025/04/10 16:45',
        subject: '技術者のご紹介',
        totalCount: 18,
        successCount: 18,
        errorCount: 0,
        status: 'success',
        templateId: 1,
        passwordEmailSuccess: 18,
        passwordEmailError: 0
      },
      {
        id: 4,
        date: '2025/04/05 09:20',
        subject: '新規案件のご案内',
        totalCount: 15,
        successCount: 12,
        errorCount: 3,
        status: 'error',
        templateId: 2,
        passwordEmailSuccess: 10,
        passwordEmailError: 5
      },
      {
        id: 5,
        date: '2025/04/03 15:45',
        subject: '新規案件のご案内',
        totalCount: 30,
        successCount: 10,
        errorCount: 2,
        unprocessedCount: 18,
        status: 'canceled',
        templateId: 2,
        passwordEmailSuccess: 10,
        passwordEmailError: 0,
        canceled: true
      }
    ]);
  }, []);

  // useEffect でページ変更時のスクロール処理を行う
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // ページ遷移時の処理（Navigation.jsから呼ばれる）
  const handlePageChange = (page) => {
    console.log(`[App] handlePageChange called with page: ${page}, currentPage: ${currentPage}`);
    
    if (typeof window.navigateToPage === 'function') {
      // グローバルのナビゲーション関数を使用
      window.navigateToPage(page);
    } else {
      // フォールバック
      setCurrentPage(page);
    }
  };

  // 送信確認ページへの遷移
  const handleConfirmation = (data) => {
    setMailData(data);
    // まずページを変更
    setCurrentPage('confirm');
  };

  // テンプレートIDを取得（デフォルトは1または件名から推測）
  const getTemplateId = () => {
    // mailDataからテンプレートIDを取得
    // 件名から推測（簡易的な実装）
    if (mailData.subject.includes('技術者') || mailData.subject.includes('紹介')) {
      return 1; // 人材紹介メール
    } else if (mailData.subject.includes('案件')) {
      return 2; // 案件紹介メール
    }
    return 1; // デフォルト値
  };

  // 送信実行
  const executeSend = (processedCount = null) => {
    const selectedRecipients = recipientsMaster.filter(r => r.selected);
    const totalCount = selectedRecipients.length;
    const templateId = getTemplateId(); // テンプレートIDを取得
    
    // 送信中止された場合
    if (processedCount !== null) {
      setSendResult({
        totalCount: totalCount,
        successCount: processedCount,
        errorCount: 0,
        unprocessedCount: totalCount - processedCount,
        canceled: true,
        processedCount: processedCount
      });
      
      // 受信者の選択状態を更新（圧縮設定を含める）
      setRecipientsMaster(prevState => 
        prevState.map(recipient => 
          recipient.selected 
            ? {...recipient, compressionSettings: mailData.compressionSettings} 
            : recipient
        )
      );
      
      // 新しいログエントリを追加
      const now = new Date();
      const logDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // 新しいログを作成
      const newLog = {
        id: logs.length > 0 ? Math.max(...logs.map(log => log.id)) + 1 : 1,
        date: logDate,
        subject: mailData.subject,
        totalCount: totalCount,
        successCount: processedCount,
        errorCount: 0,
        unprocessedCount: totalCount - processedCount,
        status: 'canceled',
        templateId: templateId,
        passwordEmailSuccess: processedCount,
        passwordEmailError: 0,
        canceled: true
      };
      
      setLogs([newLog, ...logs]);
      
      // 結果ページに遷移
      setCurrentPage('result');
      return;
    }
    
    // 送信処理をシミュレート（実際は送信されない）
    // 5%の確率でエラーが発生すると仮定
    let successCount = 0;
    let errorCount = 0;
    
    selectedRecipients.forEach(() => {
      if (Math.random() > 0.05) {
        successCount++;
      } else {
        errorCount++;
      }
    });
    
    setSendResult({
      totalCount: totalCount,
      successCount,
      errorCount,
      unprocessedCount: 0,
      canceled: false,
      processedCount: totalCount
    });
    
    // 受信者の選択状態を更新（圧縮設定を含める）
    setRecipientsMaster(prevState => 
      prevState.map(recipient => 
        recipient.selected 
          ? {...recipient, compressionSettings: mailData.compressionSettings} 
          : recipient
      )
    );
    
    // 新しいログエントリを追加
    const now = new Date();
    const logDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // 新しいログを作成
    const newLog = {
      id: logs.length > 0 ? Math.max(...logs.map(log => log.id)) + 1 : 1,
      date: logDate,
      subject: mailData.subject,
      totalCount: totalCount,
      successCount,
      errorCount,
      status: errorCount > 0 ? 'error' : 'success',
      templateId: templateId,
      passwordEmailSuccess: successCount,
      passwordEmailError: errorCount
    };
    
    setLogs([newLog, ...logs]);
    
    // 結果ページに遷移
    setCurrentPage('result');
  };

  // 選択された受信者のリストを取得
  const getSelectedRecipients = () => {
    return recipientsMaster.filter(r => r.selected);
  };

  // 受信者の選択状態を更新
  const updateRecipientSelection = (id, selected) => {
    setRecipientsMaster(prevState => 
      prevState.map(recipient => 
        recipient.id === id ? {...recipient, selected} : recipient
      )
    );
  };

  // CCを追加
  const addCcToRecipient = (recipientId, ccList) => {
    setRecipientsMaster(prevState => 
      prevState.map(recipient => 
        recipient.id === recipientId ? {...recipient, cc: ccList} : recipient
      )
    );
  };

  // 新規メール作成
  const resetMailForm = () => {
    setMailData({
      subject: '',
      content: '',
      attachments: []
    });
    
    // 受信者の選択状態をリセット
    setRecipientsMaster(prevState => 
      prevState.map(recipient => ({
        ...recipient,
        selected: false,
        cc: []
      }))
    );
  };

  // 顧客管理リストの同期処理シミュレーション
  const handleImportSync = () => {
    // 同期日時を更新
    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLastImportDate(formattedDate);
  };

  // ページに応じてコンポーネントを表示
  const renderPage = () => {
    console.log(`[App] Rendering page: ${currentPage}`);
    
    switch (currentPage) {
      case 'home':
        return <Dashboard logs={logs} onCompose={() => handlePageChange('mail-compose')} lastImportDate={lastImportDate} onImportSync={handleImportSync} />;
      case 'mail-compose':
        return (
          <MailCompose 
            recipients={recipientsMaster}
            onConfirm={handleConfirmation}
            updateSelection={updateRecipientSelection}
            addCc={addCcToRecipient}
            mailData={mailData}
            setMailData={setMailData}
            ref={mailComposeRef}
          />
        );
      case 'confirm':
        return (
          <ConfirmPage 
            mailData={mailData}
            selectedRecipients={getSelectedRecipients()}
            onBack={() => handlePageChange('mail-compose')}
            onSend={executeSend}
            ref={confirmPageRef}
          />
        );
      case 'result':
        return (
          <ResultPage 
            result={sendResult}
            recipients={getSelectedRecipients()}
            onHome={() => handlePageChange('home')}
            onNewMail={() => {
              resetMailForm();
              handlePageChange('mail-compose');
            }}
          />
        );
      case 'settings':
        return <Settings recipients={recipientsMaster} lastImportDate={lastImportDate} onImportSync={handleImportSync} />;
      case 'logs':
        return <Logs logs={logs} />;
      default:
        return <Dashboard logs={logs} onCompose={() => handlePageChange('mail-compose')} lastImportDate={lastImportDate} onImportSync={handleImportSync} />;
    }
  };

  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
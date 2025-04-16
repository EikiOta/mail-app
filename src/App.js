// src/App.js
import React, { useState, useEffect } from 'react';
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
  
  // 送信結果の状態
  const [sendResult, setSendResult] = useState({
    totalCount: 0,
    successCount: 0,
    errorCount: 0
  });

  // 初期化
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
        templateId: 1
      },
      {
        id: 2,
        date: '2025/04/14 11:15',
        subject: '新規案件のご案内',
        totalCount: 42,
        successCount: 42,
        errorCount: 0,
        status: 'success',
        templateId: 2
      },
      {
        id: 3,
        date: '2025/04/10 16:45',
        subject: '技術者のご紹介',
        totalCount: 18,
        successCount: 18,
        errorCount: 0,
        status: 'success',
        templateId: 1
      },
      {
        id: 4,
        date: '2025/04/05 09:20',
        subject: '新規案件のご案内',
        totalCount: 15,
        successCount: 12,
        errorCount: 3,
        status: 'error',
        templateId: 2
      }
    ]);
  }, []);

  // 送信確認ページへの遷移
  const handleConfirmation = (data) => {
    setMailData(data);
    setCurrentPage('confirm');
  };

  // 送信実行
  const executeSend = () => {
    const selectedRecipients = recipientsMaster.filter(r => r.selected);
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
      totalCount: selectedRecipients.length,
      successCount,
      errorCount
    });
    
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

  // ページに応じてコンポーネントを表示
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard logs={logs} onCompose={() => setCurrentPage('mail-compose')} />;
      case 'mail-compose':
        return (
          <MailCompose 
            recipients={recipientsMaster}
            onConfirm={handleConfirmation}
            updateSelection={updateRecipientSelection}
            addCc={addCcToRecipient}
            mailData={mailData}
            setMailData={setMailData}
          />
        );
      case 'confirm':
        return (
          <ConfirmPage 
            mailData={mailData}
            selectedRecipients={getSelectedRecipients()}
            onBack={() => setCurrentPage('mail-compose')}
            onSend={executeSend}
          />
        );
      case 'result':
        return (
          <ResultPage 
            result={sendResult}
            recipients={getSelectedRecipients()}
            onHome={() => setCurrentPage('home')}
            onNewMail={() => {
              resetMailForm();
              setCurrentPage('mail-compose');
            }}
          />
        );
      case 'settings':
        return <Settings />;
      case 'logs':
        return <Logs logs={logs} />;
      default:
        return <Dashboard logs={logs} onCompose={() => setCurrentPage('mail-compose')} />;
    }
  };

  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
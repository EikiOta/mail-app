// src/utils/data.js

// 会社リスト（ダミーデータ用）
const COMPANIES = [
  '富士通株式会社', 'トヨタ自動車株式会社', '株式会社日立製作所', 'ソニーグループ株式会社', 
  '三菱電機株式会社', 'パナソニック株式会社', '株式会社東芝', '株式会社NTTデータ', 
  '株式会社野村総合研究所', 'KDDI株式会社'
];

// 部署リスト（ダミーデータ用）
const DEPARTMENTS = ['営業部', '技術部', '人事部', '総務部', '経理部', '企画部', '開発部', 'マーケティング部', '購買部', 'システム部'];

// 役職リスト（ダミーデータ用）
const POSITIONS = ['部長', '課長', '係長', '主任', '担当', 'マネージャー', 'リーダー', '社員', '主査', '専門職'];

// ダミーアカウントのプリセット
const DUMMY_ACCOUNTS = [
  { name: '佐藤 翔太', company: '富士通株式会社', department: '営業部', position: '部長', email: 'sato.shota@fujitsu.co.jp' },
  { name: '鈴木 健太', company: 'トヨタ自動車株式会社', department: '技術部', position: '課長', email: 'suzuki.kenta@toyota.co.jp' },
  { name: '高橋 大輔', company: '株式会社日立製作所', department: '人事部', position: '係長', email: 'takahashi.daisuke@hitachi.co.jp' },
  { name: '田中 拓也', company: 'ソニーグループ株式会社', department: '総務部', position: '主任', email: 'tanaka.takuya@sony.co.jp' },
  { name: '伊藤 直樹', company: '三菱電機株式会社', department: '経理部', position: '担当', email: 'ito.naoki@mitsubishi.co.jp' },
  { name: '渡辺 恵美', company: 'パナソニック株式会社', department: '企画部', position: 'マネージャー', email: 'watanabe.megumi@panasonic.co.jp' },
  { name: '山本 香織', company: '株式会社東芝', department: '開発部', position: 'リーダー', email: 'yamamoto.kaori@toshiba.co.jp' },
  { name: '中村 裕子', company: '株式会社NTTデータ', department: 'マーケティング部', position: '社員', email: 'nakamura.yuko@nttdata.co.jp' },
  { name: '小林 綾香', company: '株式会社野村総合研究所', department: '購買部', position: '主査', email: 'kobayashi.ayaka@nri.co.jp' },
  { name: '加藤 智子', company: 'KDDI株式会社', department: 'システム部', position: '専門職', email: 'kato.tomoko@kddi.co.jp' },
  { name: '吉田 健一', company: '富士通株式会社', department: '開発部', position: '課長', email: 'yoshida.kenichi@fujitsu.co.jp' },
  { name: '佐々木 真由美', company: 'トヨタ自動車株式会社', department: '人事部', position: '主任', email: 'sasaki.mayumi@toyota.co.jp' },
  { name: '山田 太郎', company: '株式会社日立製作所', department: 'システム部', position: '部長', email: 'yamada.taro@hitachi.co.jp' },
  { name: '伊藤 裕子', company: 'ソニーグループ株式会社', department: '営業部', position: '担当', email: 'ito.yuko@sony.co.jp' },
  { name: '鈴木 一郎', company: '三菱電機株式会社', department: '技術部', position: 'リーダー', email: 'suzuki.ichiro@mitsubishi.co.jp' },
  { name: '高橋 明美', company: 'パナソニック株式会社', department: '総務部', position: '係長', email: 'takahashi.akemi@panasonic.co.jp' },
  { name: '田中 正和', company: '株式会社東芝', department: '経理部', position: 'マネージャー', email: 'tanaka.masakazu@toshiba.co.jp' },
  { name: '渡辺 秀樹', company: '株式会社NTTデータ', department: '企画部', position: '社員', email: 'watanabe.hideki@nttdata.co.jp' },
  { name: '中村 和也', company: '株式会社野村総合研究所', department: 'マーケティング部', position: '主査', email: 'nakamura.kazuya@nri.co.jp' },
  { name: '山本 浩二', company: 'KDDI株式会社', department: '購買部', position: '専門職', email: 'yamamoto.koji@kddi.co.jp' },
  { name: '小林 誠', company: '富士通株式会社', department: 'システム部', position: '担当', email: 'kobayashi.makoto@fujitsu.co.jp' },
  { name: '加藤 健二', company: 'トヨタ自動車株式会社', department: '開発部', position: '部長', email: 'kato.kenji@toyota.co.jp' },
  { name: '吉田 幸子', company: '株式会社日立製作所', department: '営業部', position: '課長', email: 'yoshida.sachiko@hitachi.co.jp' },
  { name: '佐々木 大輔', company: 'ソニーグループ株式会社', department: '技術部', position: '係長', email: 'sasaki.daisuke@sony.co.jp' },
  { name: '山田 亜希子', company: '三菱電機株式会社', department: '人事部', position: '主任', email: 'yamada.akiko@mitsubishi.co.jp' },
  { name: '伊藤 誠', company: 'パナソニック株式会社', department: '総務部', position: 'リーダー', email: 'ito.makoto@panasonic.co.jp' },
  { name: '斎藤 健太', company: '株式会社東芝', department: '経理部', position: '社員', email: 'saito.kenta@toshiba.co.jp' },
  { name: '松本 明日香', company: '株式会社NTTデータ', department: '企画部', position: '主査', email: 'matsumoto.asuka@nttdata.co.jp' },
  { name: '井上 大輔', company: '株式会社野村総合研究所', department: 'マーケティング部', position: '専門職', email: 'inoue.daisuke@nri.co.jp' },
  { name: '木村 真由美', company: 'KDDI株式会社', department: '購買部', position: '担当', email: 'kimura.mayumi@kddi.co.jp' }
];

// ランダムなダミー連絡先を生成する関数
export const generateDummyContacts = (count) => {
  // プリセットのダミーデータを使用
  const dummyContacts = DUMMY_ACCOUNTS.slice(0, count);
  
  // 足りない場合はランダムに生成
  if (dummyContacts.length < count) {
    for (let i = dummyContacts.length; i < count; i++) {
      const companyIndex = i % COMPANIES.length;
      const company = COMPANIES[companyIndex];
      
      const department = DEPARTMENTS[i % DEPARTMENTS.length];
      const position = POSITIONS[i % POSITIONS.length];
      
      // メールアドレス生成用のドメイン部分
      let domain;
      if (company.includes('株式会社')) {
        if (company === '株式会社日立製作所') domain = 'hitachi';
        else if (company === '株式会社東芝') domain = 'toshiba';
        else if (company === '株式会社NTTデータ') domain = 'nttdata';
        else if (company === '株式会社野村総合研究所') domain = 'nri';
        else domain = company.replace('株式会社', '').trim().toLowerCase();
      } else {
        domain = company.replace(/[株式会社|合同会社]/g, '').trim().toLowerCase();
      }
      
      // 日本語を含まない英字のドメイン名に変換
      if (domain === '富士通') domain = 'fujitsu';
      else if (domain === 'トヨタ自動車') domain = 'toyota';
      else if (domain === 'ソニーグループ') domain = 'sony';
      else if (domain === '三菱電機') domain = 'mitsubishi';
      else if (domain === 'パナソニック') domain = 'panasonic';
      else if (domain === 'KDDI') domain = 'kddi';
      
      // メールアドレス生成
      const email = `user${i}@${domain}.co.jp`;
      
      dummyContacts.push({
        id: i + 1,
        name: `担当者${i + 1}`,
        email: email,
        company: company,
        department: department,
        position: position,
        cc: [],
        selected: i < 3 // 最初の3件は選択済みに
      });
    }
  } else {
    // 必要数より多い場合は制限
    dummyContacts.length = count;
  }
  
  // idと選択状態を設定
  return dummyContacts.map((contact, index) => ({
    ...contact,
    id: index + 1,
    cc: [],
    selected: index < 3 // 最初の3件は選択済みに
  }));
};

// テンプレートデータ
export const TEMPLATES = [
  {
    id: 1,
    name: '人材紹介メール',
    subject: '技術者のご紹介',
    content: `いつもお世話になっております。
xxxのyyyです。
技術者のご紹介をさせていただきます。
何かスキルマッチする案件がございましたら、ご連絡いただけますと幸いです。
お忙しい中恐れ入りますがご確認の程よろしくお願い致します。
※既にご存じの情報でしたらご了承ください。
------------------------------------------------------
【名前】
【最寄駅】
【所属】 
【技術】

【経験年数】
【稼働時期】
【単価】
【希望条件】
＜必須＞

【業務打ち合わせ可能日】

【備　考】
------------------------------------------------------
何卒よろしくお願い申し上げます。`
  },
  {
    id: 2,
    name: '案件紹介メール',
    subject: '新規案件のご案内',
    content: `お世話になっております。
xxxのyyyです。

新規案件のご案内をさせていただきます。
ご興味がございましたら、ぜひご連絡いただけますと幸いです。

【案件名】
【場所】
【期間】
【単価】
【作業内容】
【必須スキル】

【歓迎スキル】


何卒よろしくお願い申し上げます。`
  }
];
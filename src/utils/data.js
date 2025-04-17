// src/utils/data.js

// 会社リスト（ダミーデータ用）
const COMPANIES = [
  '富士通株式会社', 'トヨタ自動車株式会社', '株式会社日立製作所', 'ソニーグループ株式会社', 
  '三菱電機株式会社', 'パナソニック株式会社', '株式会社東芝', '株式会社NTTデータ', 
  '株式会社野村総合研究所', 'KDDI株式会社'
];

// 名前リスト（ダミーデータ用）
const FIRST_NAMES = ['翔太', '健太', '大輔', '拓也', '直樹', '恵美', '香織', '裕子', '綾香', '智子'];
const LAST_NAMES = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤'];

// 部署リスト（ダミーデータ用）
const DEPARTMENTS = ['営業部', '技術部', '人事部', '総務部', '経理部', '企画部', '開発部', 'マーケティング部', '購買部', 'システム部'];

// 役職リスト（ダミーデータ用）
const POSITIONS = ['部長', '課長', '係長', '主任', '担当', 'マネージャー', 'リーダー', '社員', '主査', '専門職'];

// 簡易的な日本語名をローマ字に変換する関数
const japaneseToRoman = (japaneseName) => {
  const conversion = {
    '佐藤': 'sato', '鈴木': 'suzuki', '高橋': 'takahashi', '田中': 'tanaka',
    '伊藤': 'ito', '渡辺': 'watanabe', '山本': 'yamamoto', '中村': 'nakamura',
    '小林': 'kobayashi', '加藤': 'kato',
    '翔太': 'shota', '健太': 'kenta', '大輔': 'daisuke', '拓也': 'takuya',
    '直樹': 'naoki', '恵美': 'megumi', '香織': 'kaori', '裕子': 'yuko',
    '綾香': 'ayaka', '智子': 'tomoko'
  };
  
  return conversion[japaneseName] || japaneseName;
};

// ランダムなダミー連絡先を生成する関数
export const generateDummyContacts = (count) => {
  const contacts = [];
  for (let i = 0; i < count; i++) {
    const companyIndex = Math.floor(i / 3) % COMPANIES.length; // 各会社に約3人の担当者
    const company = COMPANIES[companyIndex];
    
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const fullName = lastName + ' ' + firstName;
    
    // 部署と役職をランダムに選択
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    
    // 会社名から英字部分のみ抽出してドメイン名に使用
    let domain;
    if (company.includes('株式会社')) {
      domain = company.replace('株式会社', '').trim();
    } else {
      domain = company.replace(/[株式会社|合同会社]/g, '').trim();
    }
    
    // 日本語を含まない英字のドメイン名に変換
    if (domain === '富士通') domain = 'fujitsu';
    else if (domain === 'トヨタ自動車') domain = 'toyota';
    else if (domain === '日立製作所') domain = 'hitachi';
    else if (domain === 'ソニーグループ') domain = 'sony';
    else if (domain === '三菱電機') domain = 'mitsubishi';
    else if (domain === 'パナソニック') domain = 'panasonic';
    else if (domain === '東芝') domain = 'toshiba';
    else if (domain === 'NTTデータ') domain = 'nttdata';
    else if (domain === '野村総合研究所') domain = 'nri';
    else if (domain === 'KDDI') domain = 'kddi';
    else domain = 'example';
    
    // ローマ字のメールアドレスを生成
    const lastNameRoman = japaneseToRoman(lastName).toLowerCase();
    const firstNameRoman = japaneseToRoman(firstName).toLowerCase();
    
    contacts.push({
      id: i + 1,
      name: fullName,
      email: `${lastNameRoman}.${firstNameRoman}@${domain}.co.jp`,
      company: company,
      department: department,
      position: position,
      cc: [],
      selected: i < 3 // 最初の3件は選択済みに
    });
  }
  return contacts;
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
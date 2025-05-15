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

// 富士通株式会社の社員リスト（拡張版 - 計7名にして6-7人というリクエストに合わせる）
const FUJITSU_EMPLOYEES = [
  { name: '佐藤 翔太', company: '富士通株式会社', department: '営業部', position: '部長', email: 'sato.shota@fujitsu.co.jp' },
  { name: '吉田 健一', company: '富士通株式会社', department: '開発部', position: '課長', email: 'yoshida.kenichi@fujitsu.co.jp' },
  { name: '小林 誠', company: '富士通株式会社', department: 'システム部', position: '担当', email: 'kobayashi.makoto@fujitsu.co.jp' },
  { name: '田村 雄一', company: '富士通株式会社', department: '技術部', position: 'リーダー', email: 'tamura.yuichi@fujitsu.co.jp' },
  { name: '村田 和子', company: '富士通株式会社', department: '人事部', position: '主任', email: 'murata.kazuko@fujitsu.co.jp' },
  { name: '中西 健太', company: '富士通株式会社', department: '企画部', position: '課長', email: 'nakanishi.kenta@fujitsu.co.jp' },
  { name: '藤田 洋平', company: '富士通株式会社', department: '営業部', position: '担当', email: 'fujita.yohei@fujitsu.co.jp' }
];

// ダミーアカウントのプリセット（富士通株式会社以外の社員）
const OTHER_COMPANY_EMPLOYEES = [
  { name: '鈴木 健太', company: 'トヨタ自動車株式会社', department: '技術部', position: '課長', email: 'suzuki.kenta@toyota.co.jp' },
  { name: '高橋 大輔', company: '株式会社日立製作所', department: '人事部', position: '係長', email: 'takahashi.daisuke@hitachi.co.jp' },
  { name: '田中 拓也', company: 'ソニーグループ株式会社', department: '総務部', position: '主任', email: 'tanaka.takuya@sony.co.jp' },
  { name: '伊藤 直樹', company: '三菱電機株式会社', department: '経理部', position: '担当', email: 'ito.naoki@mitsubishi.co.jp' },
  { name: '渡辺 恵美', company: 'パナソニック株式会社', department: '企画部', position: 'マネージャー', email: 'watanabe.megumi@panasonic.co.jp' },
  { name: '山本 香織', company: '株式会社東芝', department: '開発部', position: 'リーダー', email: 'yamamoto.kaori@toshiba.co.jp' },
  { name: '中村 裕子', company: '株式会社NTTデータ', department: 'マーケティング部', position: '社員', email: 'nakamura.yuko@nttdata.co.jp' },
  { name: '小林 綾香', company: '株式会社野村総合研究所', department: '購買部', position: '主査', email: 'kobayashi.ayaka@nri.co.jp' },
  { name: '加藤 智子', company: 'KDDI株式会社', department: 'システム部', position: '専門職', email: 'kato.tomoko@kddi.co.jp' },
  { name: '佐々木 真由美', company: 'トヨタ自動車株式会社', department: '人事部', position: '主任', email: 'sasaki.mayumi@toyota.co.jp' },
  { name: '山田 太郎', company: '株式会社日立製作所', department: 'システム部', position: '部長', email: 'yamada.taro@hitachi.co.jp' },
  { name: '伊藤 裕子', company: 'ソニーグループ株式会社', department: '営業部', position: '担当', email: 'ito.yuko@sony.co.jp' },
  { name: '鈴木 一郎', company: '三菱電機株式会社', department: '技術部', position: 'リーダー', email: 'suzuki.ichiro@mitsubishi.co.jp' },
  { name: '高橋 明美', company: 'パナソニック株式会社', department: '総務部', position: '係長', email: 'takahashi.akemi@panasonic.co.jp' },
  { name: '田中 正和', company: '株式会社東芝', department: '経理部', position: 'マネージャー', email: 'tanaka.masakazu@toshiba.co.jp' },
  { name: '渡辺 秀樹', company: '株式会社NTTデータ', department: '企画部', position: '社員', email: 'watanabe.hideki@nttdata.co.jp' },
  { name: '中村 和也', company: '株式会社野村総合研究所', department: 'マーケティング部', position: '主査', email: 'nakamura.kazuya@nri.co.jp' },
  { name: '山本 浩二', company: 'KDDI株式会社', department: '購買部', position: '専門職', email: 'yamamoto.koji@kddi.co.jp' },
  { name: '加藤 健二', company: 'トヨタ自動車株式会社', department: '開発部', position: '部長', email: 'kato.kenji@toyota.co.jp' },
  { name: '吉田 幸子', company: '株式会社日立製作所', department: '営業部', position: '課長', email: 'yoshida.sachiko@hitachi.co.jp' },
  { name: '佐々木 大輔', company: 'ソニーグループ株式会社', department: '技術部', position: '係長', email: 'sasaki.daisuke@sony.co.jp' },
  { name: '山田 亜希子', company: '三菱電機株式会社', department: '人事部', position: '主任', email: 'yamada.akiko@mitsubishi.co.jp' },
  { name: '伊藤 誠', company: 'パナソニック株式会社', department: '総務部', position: 'リーダー', email: 'ito.makoto@panasonic.co.jp' }
];

// 合計で30人になるように他社の人数を調整（富士通7人＋他社23人=30人）
const ALL_DUMMY_ACCOUNTS = [...FUJITSU_EMPLOYEES, ...OTHER_COMPANY_EMPLOYEES.slice(0, 23)];

// ランダムなダミー連絡先を生成する関数
export const generateDummyContacts = (count) => {
  // 最大でALL_DUMMY_ACCOUNTSの数まで
  const actualCount = Math.min(count, ALL_DUMMY_ACCOUNTS.length);
  
  // プリセットのダミーデータからactualCount分を取得
  let dummyContacts = ALL_DUMMY_ACCOUNTS.slice(0, actualCount);

  // idと選択状態を設定して返す
  return dummyContacts.map((contact, index) => ({
    ...contact,
    id: index + 1,
    cc: [],
    selected: false // 初期状態では選択なしに変更
  }));
};

// テンプレートデータ - 挨拶文にプレースホルダーを追加
export const TEMPLATES = [
  {
    id: 1,
    name: '人材紹介メール',
    subject: '技術者のご紹介',
    content: `<<会社名>> <<名前>>様

いつもお世話になっております。
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
    content: `<<会社名>> <<名前>>様

お世話になっております。
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

// ログサンプル用のメール本文データ - プレースホルダーはそのままの形で表示
export const LOG_SAMPLE_CONTENT = {
  1: { // テンプレートID: 1 (人材紹介メール)
    subject: '技術者のご紹介',
    content: `<<会社名>> <<名前>>様

いつもお世話になっております。
xxxのyyyです。
技術者のご紹介をさせていただきます。
何かスキルマッチする案件がございましたら、ご連絡いただけますと幸いです。
お忙しい中恐れ入りますがご確認の程よろしくお願い致します。
※既にご存じの情報でしたらご了承ください。
------------------------------------------------------
【名前】伊藤 浩二
【最寄駅】JR新宿駅
【所属】正社員
【技術】Java, Spring Boot, MySQL, JavaScript, React

【経験年数】10年
【稼働時期】即日
【単価】95万円
【希望条件】
＜必須＞
・リモート勤務可能な案件
・フレックス制度のある案件

【業務打ち合わせ可能日】平日 10:00-18:00

【備　考】
前職ではプロジェクトリーダーとして5名のチームをまとめた経験があります。
------------------------------------------------------
何卒よろしくお願い申し上げます。`
  },
  2: { // テンプレートID: 2 (案件紹介メール)
    subject: '新規案件のご案内',
    content: `<<会社名>> <<名前>>様

お世話になっております。
xxxのyyyです。

新規案件のご案内をさせていただきます。
ご興味がございましたら、ぜひご連絡いただけますと幸いです。

【案件名】大手通信会社向けシステム開発
【場所】東京都千代田区（リモート可）
【期間】即日～6ヶ月（延長の可能性あり）
【単価】スキル見合い
【作業内容】
・既存システムの改修
・新機能の追加開発
・テスト計画の作成および実施

【必須スキル】
・Javaでの開発経験3年以上
・Spring Bootの経験
・データベース(OracleまたはMySQL)の知識

【歓迎スキル】
・AWS環境での開発経験
・Kubernetesの知識
・CI/CD環境の構築経験

何卒よろしくお願い申し上げます。`
  }
};
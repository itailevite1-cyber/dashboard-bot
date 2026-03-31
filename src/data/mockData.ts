export const latestTrade = {
  date: "2026-03-30",
  direction: "לונג",
  entry: 24250,
  exit: 24520,
  profit: 450,
  streak: 2,
};

export const updates = [
  {
    id: 2,
    title: "השקה של הדשבורד",
    date: "05/04/2026",
    content: "מוזמנים לעקוב אחר הביצועים והשלבים להתחברות לבוט.",
  },
  {
    id: 1,
    title: "עדכון אסטרטגיה",
    date: "29/03/2026",
    content: "התאמה של הבוט לסייקל האלגוריתם- רבעון שני של תיאוריית הרבעים",
  },
];

export interface GuideItem {
  id: number;
  title: string;
  link: string;
  type?: "document" | "video" | "checklist";
}

export interface GuideCategory {
  title: string;
  items: GuideItem[];
}

export const guideCategories: GuideCategory[] = [
  {
    title: "התחברות לבוט",
    items: [
      { id: 4, title: "רשימת ציוד", link: "/guides/רשימת ציוד.pdf", type: "document" },
      { id: 5, title: "סרטון התחברות לבוט", link: "#", type: "video" },
      { id: 6, title: "צ'קליסט וידוא התחברות", link: "#", type: "checklist" },
    ],
  },
  {
    title: "תפעול שוטף",
    items: [
      { id: 1, title: "חיבור לאחר עדכון", link: "/guides/הוראות עדכון גרסה בוט מסחר.pdf", type: "document" },
      { id: 2, title: "הפעלת ההתראה", link: "/guides/הוראות הפעלת התראה.pdf", type: "document" },
      { id: 3, title: "בדיקת תקינות", link: "/guides/בדיקת תקינות.pdf", type: "document" },
    ],
  },
];

export const faqData = [
  {
    question: "למה לא הייתה עסקה היום?",
    answer: "לא כל יום יש תנאים טובים למסחר. הבוט נכנס רק כשיש הזדמנות עם הסתברות גבוהה — אם אין תנאים, הוא פשוט לא סוחר.",
  },
  {
    question: "זה נורמלי שאין פעילות כמה ימים?",
    answer: "כן. יש תקופות שהשוק פחות מתאים, והבוט מחכה להזדמנויות טובות יותר.",
  },
  {
    question: "אני מפסיד – מה לעשות?",
    answer: "תן לבוט זמן לעבוד. מסחר נמדד לאורך תקופה, לא לפי יום או יומיים.",
  },
  {
    question: "איך אני יודע שהבוט מחובר?",
    answer: "אם ההתראה פועלת ויש סימן של חיצים ושעון הכל עובד.",
  },
];

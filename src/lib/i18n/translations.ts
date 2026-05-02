export type Lang = 'he' | 'en' | 'ar' | 'ru';
export const LANGS: { code: Lang; label: string; flag: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'he', label: 'עברית',   flag: '🇮🇱', dir: 'rtl' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', dir: 'ltr' },
];

export type Translations = {
  // Nav
  nav_home: string; nav_booking: string; nav_instructors: string;
  nav_science: string; nav_reviews: string; nav_contact: string;
  nav_login: string; nav_logout: string; nav_myarea: string;
  nav_book_immersion: string; nav_book_workshop: string; nav_book_now: string;

  // Hero
  hero_badge: string; hero_h1_line1: string; hero_h1_line2: string;
  hero_sub: string; hero_pill1: string; hero_pill2: string;
  hero_pill3: string; hero_pill4: string;
  hero_cta1: string; hero_cta2: string;
  hero_stat1_label: string; hero_stat1_sub: string;
  hero_stat2_label: string; hero_stat2_sub: string;
  hero_stat3_label: string; hero_stat3_sub: string;

  // Section titles
  sec_benefits_title: string; sec_benefits_sub: string;
  sec_workshops_title: string; sec_workshops_sub: string;
  sec_agenda_title: string; sec_agenda_sub: string;
  sec_testimonials_title: string;
  sec_faq_title: string; sec_faq_sub: string;
  sec_contact_title: string; sec_contact_sub: string;

  // Benefits
  ben1_title: string; ben1_desc: string; ben1_stat: string; ben1_stat_label: string;
  ben2_title: string; ben2_desc: string; ben2_stat: string; ben2_stat_label: string;
  ben3_title: string; ben3_desc: string; ben3_stat: string; ben3_stat_label: string;
  ben_read_more: string;

  // Workshop types
  ws_individual_title: string; ws_individual_sub: string; ws_individual_desc: string;
  ws_couple_title: string; ws_couple_sub: string; ws_couple_desc: string;
  ws_1on1_title: string; ws_1on1_sub: string; ws_1on1_desc: string;
  ws_team_title: string; ws_team_sub: string; ws_team_desc: string;
  ws_per_person: string; ws_for_two: string; ws_per_group: string;
  ws_duration: string; ws_capacity: string;
  ws_feat_breath: string; ws_feat_plunge: string; ws_feat_science: string;
  ws_feat_hot_drink: string; ws_feat_photo: string;
  ws_feat_private2: string; ws_feat_breathe_together: string;
  ws_feat_mutual_support: string; ws_feat_intimate: string; ws_feat_couple_photo: string;
  ws_feat_personal_coach: string; ws_feat_tailored: string; ws_feat_flexible: string;
  ws_feat_breath_plunge: string; ws_feat_followup: string;
  ws_feat_team_building: string; ws_feat_resilience: string; ws_feat_tailor: string;
  ws_feat_languages: string; ws_feat_outdoor: string;
  ws_90min: string; ws_up_to_10: string; ws_2_only: string; ws_1_only: string;
  ws_by_request: string; ws_from_5: string; ws_special_price: string;

  // Agenda
  ag1_title: string; ag1_desc: string;
  ag2_title: string; ag2_desc: string;
  ag3_title: string; ag3_desc: string;
  ag4_title: string; ag4_desc: string;
  ag5_title: string; ag5_desc: string;
  ag_min15: string; ag_min20: string; ag_min35: string; ag_min15b: string; ag_min5: string;

  // FAQ
  faq1_q: string; faq1_a: string;
  faq2_q: string; faq2_a: string;
  faq3_q: string; faq3_a: string;
  faq4_q: string; faq4_a: string;
  faq5_q: string; faq5_a: string;
  faq6_q: string; faq6_a: string;
  faq7_q: string; faq7_a: string;
  faq8_q: string; faq8_a: string;

  // Contact
  contact_details_title: string; contact_address: string; contact_complex: string;
  contact_whatsapp: string; contact_send_msg: string;
  contact_book_now: string;

  // CTA
  cta_book_now: string; cta_explore: string;
};

const he: Translations = {
  nav_home: 'בית', nav_booking: 'הזמנת מקום', nav_instructors: 'המדריכים שלנו',
  nav_science: 'המדע', nav_reviews: 'חוות דעת', nav_contact: 'צור קשר',
  nav_login: 'כניסה', nav_logout: 'יציאה', nav_myarea: 'האזור האישי שלי',
  nav_book_immersion: 'קבע טבילה', nav_book_workshop: 'קבע סדנה', nav_book_now: 'הזמן עכשיו',

  hero_badge: 'רחובות | רחוב סירני 52 | מתחם הבריכה הטיפולית',
  hero_h1_line1: 'נכנסים לקרח', hero_h1_line2: 'יוצאים חדים וחסינים',
  hero_sub: 'סדנאות אמבטיות קרח מקצועיות ומבוססות מחקר, בליווי מדריכים מוסמכים CWI',
  hero_pill1: 'חוסן מנטלי', hero_pill2: 'שיפור פוקוס',
  hero_pill3: 'הורדת סטרס', hero_pill4: 'עלייה באנרגיה',
  hero_cta1: 'הזמינו מקום בסדנה הקרובה', hero_cta2: 'גלו עוד ↓',
  hero_stat1_label: 'עלייה בנוראדרנלין', hero_stat1_sub: 'קרא עוד ↗',
  hero_stat2_label: 'טמפרטורת מים', hero_stat2_sub: 'פרוטוקול CWI',
  hero_stat3_label: "משך הסדנה", hero_stat3_sub: 'מבנה מלא ↓',

  sec_benefits_title: 'למה אמבטיות קרח?',
  sec_benefits_sub: 'שינויים ביוכימיים מוכחים מדעית שמתרחשים בגופך בכל טבילה',
  sec_workshops_title: 'סוגי הסדנאות', sec_workshops_sub: 'בחרו את הפורמט המתאים לכם',
  sec_agenda_title: 'מה מחכה לכם בסדנה?',
  sec_agenda_sub: 'סדנה בת כ-90 דקות מתוכננת ומבוצעת בקפידה',
  sec_testimonials_title: 'מה אומרים המשתתפים',
  sec_faq_title: 'שאלות נפוצות', sec_faq_sub: 'כל מה שרציתם לדעת לפני שמגיעים',
  sec_contact_title: 'איך מגיעים אלינו?',
  sec_contact_sub: 'ממוקמים בלב רחובות, נגישים בתחבורה ציבורית ובחניה פרטית',

  ben1_title: 'חוסן מנטלי',
  ben1_desc: 'טבילה חוזרת מאמנת את מערכת העצבים להתמודד עם לחץ, פחד ואי-ודאות. המוח לומד "אני יכול" ברמה מולקולרית.',
  ben1_stat: '+127%', ben1_stat_label: 'עלייה בנוראדרנלין',
  ben2_title: 'שיפור פוקוס',
  ben2_desc: 'הנוראדרנלין המשתחרר בטבילה משפר ערנות, ריכוז ותפקוד קוגניטיבי. אפקט נמשך שעות לאחר הסדנה.',
  ben2_stat: '↑ 40%', ben2_stat_label: 'שיפור בריכוז',
  ben3_title: 'הורדת סטרס',
  ben3_desc: 'חשיפה חוזרת מאזנת את ציר HPA ומפחיתה רמות קורטיזול בטווח הארוך. הגוף לומד להגיב לסטרס בצורה מבוקרת יותר.',
  ben3_stat: '↓ קורטיזול', ben3_stat_label: 'הסתגלות של ציר HPA',
  ben_read_more: '← קרא עוד',

  ws_individual_title: 'סדנת יחידים', ws_individual_sub: 'בתוך קבוצה קטנה ותומכת',
  ws_individual_desc: 'חוויה אישית עוצמתית בתוך קבוצה קטנה ותומכת. מתאים במיוחד למי שנמצא בעומס תעסוקתי, לימודי, או פשוט רוצה כלי עוצמתי לניהול לחץ — ללא צורך בניסיון קודם.',
  ws_couple_title: 'סדנת זוגות', ws_couple_sub: 'חוויה אינטימית ומחזקת',
  ws_couple_desc: 'חוויה בלתי נשכחת לשניים — בין אם אתם זוג רומנטי, חברים טובים, אחים, או קולגות. תמיכה הדדית בתוך המים יוצרת זיכרון משותף שמדברים עליו חודשים אחרי.',
  ws_1on1_title: 'סדנה אישית אחד על אחד', ws_1on1_sub: 'הדרכה פרטית ומותאמת אישית',
  ws_1on1_desc: 'מדריך אישי צמוד לכל אורך הסדנה. תוכנית מותאמת בדיוק לצרכים ולמטרות שלך, בגמישות מלאה בתיאום המועד. החוויה האינטנסיבית והיעילה ביותר.',
  ws_team_title: 'סדנת קבוצות', ws_team_sub: 'לצוותי עבודה ואירגונים',
  ws_team_desc: 'גיבוש צוות עוצמתי ובניית חוסן מנטלי קבוצתי. מגיעים אלינו: צוותי הייטק, מחלקות מכירות, קבוצות ספורט, יחידות צבאיות ועוד. מחיר מותאם לגודל הקבוצה.',
  ws_per_person: 'למשתתף', ws_for_two: 'לשניים', ws_per_group: 'לפי גודל הקבוצה',
  ws_duration: 'משך', ws_capacity: 'קיבולת',
  ws_feat_breath: 'תרגול נשימה מונחה', ws_feat_plunge: 'טבילה במי הקרח לפי היכולת האישית',
  ws_feat_science: 'פרוטוקול מבוסס מדעית', ws_feat_hot_drink: 'שתייה חמה + שיתוף לאחר',
  ws_feat_photo: 'צילום למזכרת לכל מי שירצה',
  ws_feat_private2: 'הדרכה פרטית לשניים', ws_feat_breathe_together: 'תרגול נשימה משותף',
  ws_feat_mutual_support: 'טבילה בתמיכה הדדית', ws_feat_intimate: 'אווירה אינטימית ואישית',
  ws_feat_couple_photo: 'תמונות זיכרון לזוג',
  ws_feat_personal_coach: 'מדריך אישי צמוד לכל הסדנה', ws_feat_tailored: 'תוכנית מותאמת אישית',
  ws_feat_flexible: 'גמישות מלאה בתיאום מועד', ws_feat_breath_plunge: 'תרגול נשימה + טבילה מלאה',
  ws_feat_followup: 'ליווי התהליך, גם לאחר הסדנא לפי הרצון והצורך',
  ws_feat_team_building: 'Team Building אמיתי', ws_feat_resilience: 'חוסן מנטלי קבוצתי',
  ws_feat_tailor: 'Tailor made workshop', ws_feat_languages: 'אפשרות לסדנאות בשפות שונות',
  ws_feat_outdoor: 'אפשרות לביצוע הסדנאות במקום העבודה / בטבע',
  ws_90min: 'כ-90 דקות', ws_up_to_10: 'עד 10 משתתפים', ws_2_only: '2 משתתפים בלבד',
  ws_1_only: 'משתתף אחד בלבד', ws_by_request: 'לפי הזמנה', ws_from_5: 'מדריך לכל קבוצה, החל מ-5 משתתפים',
  ws_special_price: 'מחיר מיוחד',

  ag1_title: 'קבלת פנים ותדריך', ag1_desc: 'היכרות עם הקבוצה, הסבר על התהליך, מילוי טופס בריאות',
  ag2_title: 'תרגול נשימה', ag2_desc: 'נשימות איטיות ועמוקות (5 שניות שאיפה / 5 שניות נשיפה) שמורידות דופק ומכינות את המוח לקור — מבוסס על פרוטוקול Wim Hof',
  ag3_title: 'טבילה מודרכת', ag3_desc: 'טבילות בליווי מדריך מוסמך CWI, 3-5 דקות ב-5°C. כל טבילה עם ניטור תחושות לאורך כל הדרך — אף אחד לא מחויב לזמן מינימלי.',
  ag4_title: 'התחממות ושיתוף', ag4_desc: 'התחממות הדרגתית, שתייה חמה, שיתוף חוויות בקבוצה',
  ag5_title: 'סיכום והכוונה להמשך', ag5_desc: 'הנחיות להמשך היום, הצגת הטבילות השגרתיות',
  ag_min15: "15 דק'", ag_min20: "20 דק'", ag_min35: "35 דק'", ag_min15b: "15 דק'", ag_min5: "5 דק'",

  faq1_q: 'מתי לא כדאי להגיע?', faq1_a: 'מומלץ להימנע מהסדנאות במצבים הבאים: מחלות לב לא מאוזנות, הריון, לחץ דם גבוה שאינו מטופל, תסמונת ריינו, פצעים פתוחים באזורי הטבילה. יש לך מצב רפואי שלא ברשימה? שלחו לנו וואטסאפ — נבחן ביחד.',
  faq2_q: 'האם צריך ניסיון קודם?', faq2_a: 'לא. הסדנאות מתאימות לכל רמת ניסיון — גם מי שמעולם לא נגע במים קרים. המדריכים מלווים כל משתתף בקצב האישי שלו, ואף אחד לא מחויב לזמן טבילה מינימלי.',
  faq3_q: 'מה הגיל המינימלי?', faq3_a: 'גיל 18+ לסדנאות הרגילות. צעירים מגיל 15, באישור וחתימה הורים.',
  faq4_q: 'מה להביא?', faq4_a: 'בגד ים, מגבת גדולה, בגדים חמים להחלפה.',
  faq5_q: 'כמה זמן עלי לטבול בשבוע כדי לקבל את האפקטים הרצויים לאורך זמן?', faq5_a: 'לפחות 11 דקות בשבוע בטמפרטורה מתחת ל-10°C, מחולקות ל-2 עד 4 פעמים.',
  faq6_q: 'כמה פעמים אפשר להגיע בשבוע?', faq6_a: 'מומלץ להתחיל בפעם אחת בשבוע ולהתקדם לפי תגובת הגוף. ישנם לקוחות שמגיעים 2-3 פעמים בשבוע.',
  faq7_q: 'מה מדיניות הביטולים?', faq7_a: 'ביטול עד 48 שעות – החזר מלא. 24-48 שעות – זיכוי לסדנה. פחות מ-24 שעות – ללא החזר.',
  faq8_q: 'מה זה CWI?', faq8_a: 'Cold Water Immersion. טבילה במים קרים. הסמכת CWI היא ההסמכה המקצועית הבינלאומית למדריכי טבילה קרה.',

  contact_details_title: 'פרטי התקשרות', contact_address: 'רחוב סירני 52, רחובות',
  contact_complex: 'מתחם הבריכה הטיפולית', contact_whatsapp: 'וואטסאפ',
  contact_send_msg: 'שלח לנו הודעה', contact_book_now: 'הזמינו מקום עכשיו',
  cta_book_now: 'הזמינו מקום עכשיו', cta_explore: 'גלו עוד',
};

const en: Translations = {
  nav_home: 'Home', nav_booking: 'Book a Session', nav_instructors: 'Our Instructors',
  nav_science: 'Science', nav_reviews: 'Reviews', nav_contact: 'Contact',
  nav_login: 'Login', nav_logout: 'Logout', nav_myarea: 'My Dashboard',
  nav_book_immersion: 'Book Immersion', nav_book_workshop: 'Book Workshop', nav_book_now: 'Book Now',

  hero_badge: 'Rehovot | 52 Sireni St. | Therapeutic Pool Complex',
  hero_h1_line1: 'Enter the Ice', hero_h1_line2: 'Come Out Sharp & Resilient',
  hero_sub: 'Professional, research-based ice bath workshops led by certified CWI instructors',
  hero_pill1: 'Mental Resilience', hero_pill2: 'Focus Boost',
  hero_pill3: 'Stress Relief', hero_pill4: 'Energy Surge',
  hero_cta1: 'Book Your Spot', hero_cta2: 'Explore ↓',
  hero_stat1_label: 'Noradrenaline surge', hero_stat1_sub: 'Read more ↗',
  hero_stat2_label: 'Water temperature', hero_stat2_sub: 'CWI Protocol',
  hero_stat3_label: 'Session duration', hero_stat3_sub: 'Full structure ↓',

  sec_benefits_title: 'Why Ice Baths?', sec_benefits_sub: 'Scientifically proven biochemical changes that happen in your body every plunge',
  sec_workshops_title: 'Workshop Types', sec_workshops_sub: 'Choose the format that fits you',
  sec_agenda_title: 'What Awaits You?', sec_agenda_sub: 'A ~90-minute workshop planned and executed with care',
  sec_testimonials_title: 'What Participants Say',
  sec_faq_title: 'FAQs', sec_faq_sub: 'Everything you want to know before arriving',
  sec_contact_title: 'How to Find Us?', sec_contact_sub: 'Located in the heart of Rehovot, accessible by public transport and private parking',

  ben1_title: 'Mental Resilience', ben1_desc: 'Repeated immersion trains the nervous system to handle stress, fear and uncertainty. The brain learns "I can" at a molecular level.', ben1_stat: '+127%', ben1_stat_label: 'Noradrenaline increase',
  ben2_title: 'Focus Boost', ben2_desc: 'Noradrenaline released during immersion improves alertness, concentration and cognitive function. The effect lasts hours after the session.', ben2_stat: '↑ 40%', ben2_stat_label: 'Focus improvement',
  ben3_title: 'Stress Reduction', ben3_desc: 'Repeated exposure balances the HPA axis and reduces cortisol levels long-term. The body learns to respond to stress in a more controlled way.', ben3_stat: '↓ Cortisol', ben3_stat_label: 'HPA axis adaptation',
  ben_read_more: 'Read more →',

  ws_individual_title: 'Individual Workshop', ws_individual_sub: 'In a small, supportive group',
  ws_individual_desc: 'A powerful personal experience within a small, supportive group. Ideal for those under work or study pressure, or anyone who wants a powerful stress-management tool — no prior experience needed.',
  ws_couple_title: 'Couples Workshop', ws_couple_sub: 'An intimate, strengthening experience',
  ws_couple_desc: 'An unforgettable experience for two — whether you are a romantic couple, close friends, siblings, or colleagues. Mutual support in the water creates a shared memory talked about for months.',
  ws_1on1_title: 'Private 1-on-1 Workshop', ws_1on1_sub: 'Fully personalised coaching',
  ws_1on1_desc: 'A dedicated personal instructor throughout the session. A program tailored exactly to your needs and goals, with full flexibility in scheduling. The most intensive and effective experience.',
  ws_team_title: 'Group / Team Workshop', ws_team_sub: 'For work teams and organisations',
  ws_team_desc: 'Powerful team building and collective mental resilience. We host: tech teams, sales departments, sports clubs, military units and more. Price adapted to group size.',
  ws_per_person: 'per person', ws_for_two: 'for two', ws_per_group: 'by group size',
  ws_duration: 'Duration', ws_capacity: 'Capacity',
  ws_feat_breath: 'Guided breathing practice', ws_feat_plunge: 'Ice plunge at your own pace',
  ws_feat_science: 'Science-based protocol', ws_feat_hot_drink: 'Hot drink + group sharing',
  ws_feat_photo: 'Photo for those who want a souvenir',
  ws_feat_private2: 'Private coaching for two', ws_feat_breathe_together: 'Shared breathing practice',
  ws_feat_mutual_support: 'Plunge with mutual support', ws_feat_intimate: 'Intimate, personal atmosphere',
  ws_feat_couple_photo: 'Couple memory photos',
  ws_feat_personal_coach: 'Personal instructor throughout', ws_feat_tailored: 'Fully tailored programme',
  ws_feat_flexible: 'Full scheduling flexibility', ws_feat_breath_plunge: 'Breathing + full plunge',
  ws_feat_followup: 'Process support, also after the session as needed',
  ws_feat_team_building: 'Real team building', ws_feat_resilience: 'Group mental resilience',
  ws_feat_tailor: 'Tailor-made workshop', ws_feat_languages: 'Sessions available in multiple languages',
  ws_feat_outdoor: 'Option: workplace or outdoor sessions',
  ws_90min: '~90 minutes', ws_up_to_10: 'Up to 10 participants', ws_2_only: '2 participants only',
  ws_1_only: '1 participant only', ws_by_request: 'By arrangement', ws_from_5: 'Instructor per group, from 5 participants',
  ws_special_price: 'Special price',

  ag1_title: 'Welcome & Briefing', ag1_desc: 'Group introductions, process explanation, health form completion',
  ag2_title: 'Breathing Practice', ag2_desc: 'Slow, deep breaths (5s inhale / 5s exhale) that lower heart rate and prepare the brain for cold — based on the Wim Hof protocol',
  ag3_title: 'Guided Plunge', ag3_desc: 'Immersions with a certified CWI instructor, 3-5 min at 5°C. Every plunge with sensation monitoring — no one is committed to a minimum time.',
  ag4_title: 'Warm-up & Sharing', ag4_desc: 'Gradual warming, hot drinks, group experience sharing',
  ag5_title: 'Wrap-up & Next Steps', ag5_desc: 'Guidance for the rest of the day, introduction to regular immersions',
  ag_min15: '15 min', ag_min20: '20 min', ag_min35: '35 min', ag_min15b: '15 min', ag_min5: '5 min',

  faq1_q: 'When should I NOT come?', faq1_a: 'We recommend avoiding workshops if you have: uncontrolled heart disease, pregnancy, untreated high blood pressure, Raynaud\'s syndrome, open wounds in immersion areas. Have a condition not listed? Send us a WhatsApp — we\'ll review together.',
  faq2_q: 'Do I need prior experience?', faq2_a: 'No. Workshops suit all experience levels — even those who have never touched cold water. Instructors accompany each participant at their own pace; no one is committed to a minimum immersion time.',
  faq3_q: 'What is the minimum age?', faq3_a: 'Age 18+ for regular workshops. Participants from age 15 with parental consent and signature.',
  faq4_q: 'What should I bring?', faq4_a: 'Swimwear, a large towel, warm clothes to change into.',
  faq5_q: 'How long per week to get the long-term effects?', faq5_a: 'At least 11 minutes per week below 10°C, split across 2 to 4 sessions.',
  faq6_q: 'How many times a week can I come?', faq6_a: 'We recommend starting once a week and progressing based on your body\'s response. Some clients come 2-3 times a week.',
  faq7_q: 'What is the cancellation policy?', faq7_a: 'Cancel up to 48h – full refund. 24-48h – credit for another session. Less than 24h – no refund.',
  faq8_q: 'What is CWI?', faq8_a: 'Cold Water Immersion. CWI certification is the international professional certification for cold immersion instructors.',

  contact_details_title: 'Contact Details', contact_address: '52 Sireni St., Rehovot',
  contact_complex: 'Therapeutic Pool Complex', contact_whatsapp: 'WhatsApp',
  contact_send_msg: 'Send us a message', contact_book_now: 'Book Your Spot Now',
  cta_book_now: 'Book Your Spot', cta_explore: 'Explore',
};

const ar: Translations = {
  nav_home: 'الرئيسية', nav_booking: 'احجز مكانًا', nav_instructors: 'مدربونا',
  nav_science: 'العلم', nav_reviews: 'آراء العملاء', nav_contact: 'تواصل معنا',
  nav_login: 'دخول', nav_logout: 'خروج', nav_myarea: 'لوحتي الشخصية',
  nav_book_immersion: 'احجز غطسًا', nav_book_workshop: 'احجز ورشة', nav_book_now: 'احجز الآن',

  hero_badge: 'رحوفوت | شارع سيريني 52 | مجمع المسبح العلاجي',
  hero_h1_line1: 'ادخل الثلج', hero_h1_line2: 'واخرج أقوى وأكثر مرونة',
  hero_sub: 'ورش غمر احترافية في الماء البارد مبنية على الأبحاث، بإشراف مدربين معتمدين CWI',
  hero_pill1: 'صمود نفسي', hero_pill2: 'تحسين التركيز',
  hero_pill3: 'تخفيف التوتر', hero_pill4: 'رفع الطاقة',
  hero_cta1: 'احجز مكانك الآن', hero_cta2: 'اكتشف المزيد ↓',
  hero_stat1_label: 'ارتفاع النورأدرينالين', hero_stat1_sub: 'اقرأ المزيد ↗',
  hero_stat2_label: 'درجة حرارة الماء', hero_stat2_sub: 'بروتوكول CWI',
  hero_stat3_label: 'مدة الجلسة', hero_stat3_sub: 'الهيكل الكامل ↓',

  sec_benefits_title: 'لماذا الحمامات الجليدية?',
  sec_benefits_sub: 'تغييرات بيوكيميائية مثبتة علميًا تحدث في جسمك عند كل غطسة',
  sec_workshops_title: 'أنواع الورش', sec_workshops_sub: 'اختر التنسيق المناسب لك',
  sec_agenda_title: 'ماذا ينتظرك في الورشة؟', sec_agenda_sub: 'ورشة مدتها ~90 دقيقة مخططة ومنفذة بعناية',
  sec_testimonials_title: 'ماذا يقول المشاركون',
  sec_faq_title: 'الأسئلة الشائعة', sec_faq_sub: 'كل ما تريد معرفته قبل الحضور',
  sec_contact_title: 'كيف تصل إلينا؟', sec_contact_sub: 'نقع في قلب رحوفوت، يسهل الوصول بالنقل العام أو السيارة',

  ben1_title: 'الصمود النفسي', ben1_desc: 'الغمر المتكرر يدرب الجهاز العصبي على التعامل مع الضغط والخوف وعدم اليقين. يتعلم الدماغ "أستطيع" على المستوى الجزيئي.', ben1_stat: '+127%', ben1_stat_label: 'زيادة النورأدرينالين',
  ben2_title: 'تحسين التركيز', ben2_desc: 'النورأدرينالين المُطلَق أثناء الغمر يُحسّن اليقظة والتركيز والأداء المعرفي. يستمر التأثير لساعات بعد الجلسة.', ben2_stat: '↑ 40%', ben2_stat_label: 'تحسن التركيز',
  ben3_title: 'تقليل التوتر', ben3_desc: 'يُوازن التعرض المتكرر محور HPA ويقلل مستويات الكورتيزول على المدى البعيد. يتعلم الجسم الاستجابة للضغط بشكل أكثر تحكمًا.', ben3_stat: '↓ كورتيزول', ben3_stat_label: 'تكيف محور HPA',
  ben_read_more: 'اقرأ المزيد →',

  ws_individual_title: 'ورشة فردية', ws_individual_sub: 'ضمن مجموعة صغيرة وداعمة',
  ws_individual_desc: 'تجربة شخصية قوية داخل مجموعة صغيرة وداعمة. مناسب بشكل خاص لمن يعاني من ضغط العمل أو الدراسة، أو يريد أداة قوية لإدارة الضغط — دون الحاجة إلى خبرة مسبقة.',
  ws_couple_title: 'ورشة الأزواج', ws_couple_sub: 'تجربة حميمة ومعززة',
  ws_couple_desc: 'تجربة لا تُنسى لاثنين — سواء كنتما زوجين رومانسيين أو أصدقاء مقربين أو أشقاء أو زملاء. الدعم المتبادل داخل الماء يخلق ذكرى مشتركة يتحدث عنها لأشهر.',
  ws_1on1_title: 'ورشة خاصة فردية', ws_1on1_sub: 'تدريب خاص ومخصص',
  ws_1on1_desc: 'مدرب شخصي مخصص طوال الجلسة. برنامج مصمم بدقة وفق احتياجاتك وأهدافك، بمرونة كاملة في تحديد المواعيد. التجربة الأكثر كثافة وفعالية.',
  ws_team_title: 'ورشة المجموعات', ws_team_sub: 'لفرق العمل والمؤسسات',
  ws_team_desc: 'بناء فريق قوي وتطوير المرونة النفسية الجماعية. نستضيف: فرق التقنية، وأقسام المبيعات، والفرق الرياضية، والوحدات العسكرية وغيرها. السعر مكيّف حسب حجم المجموعة.',
  ws_per_person: 'للمشارك', ws_for_two: 'للاثنين', ws_per_group: 'حسب حجم المجموعة',
  ws_duration: 'المدة', ws_capacity: 'السعة',
  ws_feat_breath: 'تدريب على التنفس الموجَّه', ws_feat_plunge: 'الغمر الجليدي بحسب قدرتك الشخصية',
  ws_feat_science: 'بروتوكول مبني على العلم', ws_feat_hot_drink: 'مشروب ساخن + مشاركة جماعية',
  ws_feat_photo: 'تصوير تذكاري لمن يرغب',
  ws_feat_private2: 'تدريب خاص لاثنين', ws_feat_breathe_together: 'تدريب تنفس مشترك',
  ws_feat_mutual_support: 'غمر بدعم متبادل', ws_feat_intimate: 'أجواء حميمة وشخصية',
  ws_feat_couple_photo: 'صور ذكريات للزوجين',
  ws_feat_personal_coach: 'مدرب شخصي طوال الجلسة', ws_feat_tailored: 'برنامج مخصص بالكامل',
  ws_feat_flexible: 'مرونة كاملة في الجدولة', ws_feat_breath_plunge: 'تنفس + غمر كامل',
  ws_feat_followup: 'دعم العملية، حتى بعد الجلسة حسب الحاجة',
  ws_feat_team_building: 'بناء فريق حقيقي', ws_feat_resilience: 'مرونة نفسية جماعية',
  ws_feat_tailor: 'ورشة مصممة خصيصًا', ws_feat_languages: 'جلسات بلغات متعددة',
  ws_feat_outdoor: 'خيار: جلسات في مكان العمل أو الطبيعة',
  ws_90min: '~90 دقيقة', ws_up_to_10: 'حتى 10 مشاركين', ws_2_only: 'مشاركان فقط',
  ws_1_only: 'مشارك واحد فقط', ws_by_request: 'بالتنسيق المسبق', ws_from_5: 'مدرب لكل مجموعة، من 5 مشاركين',
  ws_special_price: 'سعر خاص',

  ag1_title: 'الاستقبال والإحاطة', ag1_desc: 'التعارف مع المجموعة، شرح العملية، ملء نموذج الصحة',
  ag2_title: 'تدريب التنفس', ag2_desc: 'أنفاس بطيئة وعميقة (5 ثواني شهيق / 5 ثواني زفير) تخفض معدل ضربات القلب وتهيئ الدماغ للبرد — مبني على بروتوكول Wim Hof',
  ag3_title: 'الغمر الموجَّه', ag3_desc: 'غمرات بإشراف مدرب CWI معتمد، 3-5 دقائق عند 5°C. كل غطسة مع مراقبة الأحاسيس — لا أحد ملزم بوقت أدنى.',
  ag4_title: 'الإحماء والمشاركة', ag4_desc: 'إحماء تدريجي، مشروب ساخن، مشاركة التجارب مع المجموعة',
  ag5_title: 'الختام والتوجيه', ag5_desc: 'إرشادات لبقية اليوم، التعريف بالغمرات المنتظمة',
  ag_min15: '15 د', ag_min20: '20 د', ag_min35: '35 د', ag_min15b: '15 د', ag_min5: '5 د',

  faq1_q: 'متى لا ينصح بالحضور؟', faq1_a: 'يُنصح بتجنب الورش في الحالات التالية: أمراض القلب غير المضبوطة، الحمل، ضغط الدم المرتفع غير المعالج، متلازمة رينو، الجروح المفتوحة في مناطق الغمر. لديك حالة طبية غير مدرجة؟ أرسل لنا واتساب — سنراجع معًا.',
  faq2_q: 'هل أحتاج خبرة مسبقة؟', faq2_a: 'لا. الورش مناسبة لجميع مستويات الخبرة — حتى من لم يلمس الماء البارد قط. يرافق المدربون كل مشارك بوتيرته الخاصة، ولا أحد ملزم بوقت غمر أدنى.',
  faq3_q: 'ما الحد الأدنى للسن؟', faq3_a: 'عمر 18+ للورش العادية. من عمر 15 عامًا بموافقة وتوقيع الوالدين.',
  faq4_q: 'ماذا أحضر؟', faq4_a: 'ملابس سباحة، منشفة كبيرة، ملابس دافئة للتغيير.',
  faq5_q: 'كم دقيقة أسبوعيًا للحصول على التأثيرات المطلوبة؟', faq5_a: 'على الأقل 11 دقيقة أسبوعيًا تحت 10°C، موزعة على 2-4 مرات.',
  faq6_q: 'كم مرة يمكنني الحضور في الأسبوع؟', faq6_a: 'يُنصح بالبدء مرة أسبوعيًا والتقدم حسب استجابة جسمك. بعض العملاء يحضرون 2-3 مرات أسبوعيًا.',
  faq7_q: 'ما سياسة الإلغاء؟', faq7_a: 'إلغاء قبل 48 ساعة – استرداد كامل. 24-48 ساعة – رصيد لجلسة أخرى. أقل من 24 ساعة – لا استرداد.',
  faq8_q: 'ما هو CWI؟', faq8_a: 'Cold Water Immersion (الغمر في الماء البارد). شهادة CWI هي الاعتماد المهني الدولي لمدربي الغمر البارد.',

  contact_details_title: 'معلومات التواصل', contact_address: 'شارع سيريني 52، رحوفوت',
  contact_complex: 'مجمع المسبح العلاجي', contact_whatsapp: 'واتساب',
  contact_send_msg: 'أرسل لنا رسالة', contact_book_now: 'احجز مكانك الآن',
  cta_book_now: 'احجز مكانك الآن', cta_explore: 'اكتشف',
};

const ru: Translations = {
  nav_home: 'Главная', nav_booking: 'Забронировать', nav_instructors: 'Наши инструкторы',
  nav_science: 'Наука', nav_reviews: 'Отзывы', nav_contact: 'Контакты',
  nav_login: 'Войти', nav_logout: 'Выйти', nav_myarea: 'Мой кабинет',
  nav_book_immersion: 'Забронировать погружение', nav_book_workshop: 'Забронировать воркшоп', nav_book_now: 'Забронировать',

  hero_badge: 'Реховот | ул. Сирени 52 | Комплекс терапевтического бассейна',
  hero_h1_line1: 'Войди в лёд', hero_h1_line2: 'Выйди сильным и стойким',
  hero_sub: 'Профессиональные воркшопы по ледяным ваннам на основе исследований, под руководством сертифицированных инструкторов CWI',
  hero_pill1: 'Психостойкость', hero_pill2: 'Улучшение фокуса',
  hero_pill3: 'Снижение стресса', hero_pill4: 'Прилив энергии',
  hero_cta1: 'Забронировать место', hero_cta2: 'Узнать больше ↓',
  hero_stat1_label: 'Рост норадреналина', hero_stat1_sub: 'Читать далее ↗',
  hero_stat2_label: 'Температура воды', hero_stat2_sub: 'Протокол CWI',
  hero_stat3_label: 'Продолжительность', hero_stat3_sub: 'Полная структура ↓',

  sec_benefits_title: 'Зачем ледяные ванны?', sec_benefits_sub: 'Научно доказанные биохимические изменения, происходящие в вашем теле при каждом погружении',
  sec_workshops_title: 'Виды воркшопов', sec_workshops_sub: 'Выберите подходящий формат',
  sec_agenda_title: 'Что вас ждёт?', sec_agenda_sub: 'Воркшоп ~90 минут, тщательно спланированный и проведённый',
  sec_testimonials_title: 'Что говорят участники',
  sec_faq_title: 'Частые вопросы', sec_faq_sub: 'Всё, что хотите знать перед приходом',
  sec_contact_title: 'Как нас найти?', sec_contact_sub: 'В центре Реховота, доступно на общественном транспорте и с парковкой',

  ben1_title: 'Психостойкость', ben1_desc: 'Повторные погружения тренируют нервную систему справляться со стрессом, страхом и неопределённостью. Мозг учится «я могу» на молекулярном уровне.', ben1_stat: '+127%', ben1_stat_label: 'Рост норадреналина',
  ben2_title: 'Улучшение фокуса', ben2_desc: 'Норадреналин, выделяемый при погружении, улучшает бдительность, концентрацию и когнитивные функции. Эффект длится часами после сессии.', ben2_stat: '↑ 40%', ben2_stat_label: 'Улучшение концентрации',
  ben3_title: 'Снижение стресса', ben3_desc: 'Повторное воздействие балансирует ось HPA и снижает уровень кортизола в долгосрочной перспективе. Тело учится реагировать на стресс более контролируемо.', ben3_stat: '↓ Кортизол', ben3_stat_label: 'Адаптация оси HPA',
  ben_read_more: 'Читать далее →',

  ws_individual_title: 'Индивидуальный воркшоп', ws_individual_sub: 'В небольшой поддерживающей группе',
  ws_individual_desc: 'Мощный личный опыт в небольшой поддерживающей группе. Идеально подходит для тех, кто испытывает рабочую или учебную нагрузку, или просто хочет мощный инструмент управления стрессом — без предварительного опыта.',
  ws_couple_title: 'Воркшоп для пар', ws_couple_sub: 'Интимный, укрепляющий опыт',
  ws_couple_desc: 'Незабываемый опыт для двоих — романтическая пара, близкие друзья, братья/сёстры или коллеги. Взаимная поддержка в воде создаёт общее воспоминание, о котором говорят ещё месяцами.',
  ws_1on1_title: 'Личный воркшоп 1 на 1', ws_1on1_sub: 'Полностью персонализированный коучинг',
  ws_1on1_desc: 'Личный инструктор рядом на протяжении всей сессии. Программа, точно адаптированная под ваши нужды и цели, с полной гибкостью в выборе времени. Самый интенсивный и эффективный опыт.',
  ws_team_title: 'Групповой/корпоративный воркшоп', ws_team_sub: 'Для рабочих команд и организаций',
  ws_team_desc: 'Мощное тимбилдинговое мероприятие и развитие коллективной психостойкости. К нам приходят: IT-команды, отделы продаж, спортивные клубы, военные подразделения и другие. Цена адаптирована к размеру группы.',
  ws_per_person: 'за человека', ws_for_two: 'за двоих', ws_per_group: 'по размеру группы',
  ws_duration: 'Длительность', ws_capacity: 'Вместимость',
  ws_feat_breath: 'Управляемая дыхательная практика', ws_feat_plunge: 'Погружение в ледяную воду в своём темпе',
  ws_feat_science: 'Научно-обоснованный протокол', ws_feat_hot_drink: 'Горячий напиток + групповой обмен',
  ws_feat_photo: 'Фото на память для желающих',
  ws_feat_private2: 'Частный инструктаж для двоих', ws_feat_breathe_together: 'Совместная дыхательная практика',
  ws_feat_mutual_support: 'Погружение с взаимной поддержкой', ws_feat_intimate: 'Интимная, личная атмосфера',
  ws_feat_couple_photo: 'Фото на память для пары',
  ws_feat_personal_coach: 'Личный инструктор на протяжении всей сессии', ws_feat_tailored: 'Полностью индивидуальная программа',
  ws_feat_flexible: 'Полная гибкость в расписании', ws_feat_breath_plunge: 'Дыхание + полное погружение',
  ws_feat_followup: 'Поддержка процесса, включая после сессии по необходимости',
  ws_feat_team_building: 'Настоящий тимбилдинг', ws_feat_resilience: 'Групповая психостойкость',
  ws_feat_tailor: 'Воркшоп под заказ', ws_feat_languages: 'Сессии на разных языках',
  ws_feat_outdoor: 'Вариант: сессии на рабочем месте или на природе',
  ws_90min: '~90 минут', ws_up_to_10: 'До 10 участников', ws_2_only: 'Только 2 участника',
  ws_1_only: 'Только 1 участник', ws_by_request: 'По договорённости', ws_from_5: 'Инструктор на группу, от 5 участников',
  ws_special_price: 'Специальная цена',

  ag1_title: 'Приветствие и инструктаж', ag1_desc: 'Знакомство с группой, объяснение процесса, заполнение медицинской формы',
  ag2_title: 'Дыхательная практика', ag2_desc: 'Медленные, глубокие вдохи (5с вдох / 5с выдох), снижающие пульс и подготавливающие мозг к холоду — на основе протокола Вим Хофа',
  ag3_title: 'Управляемое погружение', ag3_desc: 'Погружения под руководством сертифицированного инструктора CWI, 3-5 мин при 5°C. Каждое погружение с мониторингом ощущений — никто не обязан соблюдать минимальное время.',
  ag4_title: 'Разогрев и обмен', ag4_desc: 'Постепенное согревание, горячий напиток, обмен впечатлениями в группе',
  ag5_title: 'Итоги и следующие шаги', ag5_desc: 'Рекомендации на остаток дня, знакомство с регулярными погружениями',
  ag_min15: '15 мин', ag_min20: '20 мин', ag_min35: '35 мин', ag_min15b: '15 мин', ag_min5: '5 мин',

  faq1_q: 'Когда не стоит приходить?', faq1_a: 'Рекомендуем избегать воркшопов при: неконтролируемых болезнях сердца, беременности, нелеченном высоком давлении, синдроме Рейно, открытых ранах в зонах погружения. Есть состояние, которого нет в списке? Напишите в WhatsApp — обсудим вместе.',
  faq2_q: 'Нужен ли предыдущий опыт?', faq2_a: 'Нет. Воркшопы подходят для любого уровня опыта — даже тем, кто никогда не касался холодной воды. Инструкторы сопровождают каждого участника в его темпе; никто не обязан соблюдать минимальное время погружения.',
  faq3_q: 'Каков минимальный возраст?', faq3_a: 'От 18 лет для обычных воркшопов. От 15 лет с разрешения и подписи родителей.',
  faq4_q: 'Что взять с собой?', faq4_a: 'Купальник/плавки, большое полотенце, тёплую одежду для смены.',
  faq5_q: 'Сколько минут в неделю для долгосрочных эффектов?', faq5_a: 'Не менее 11 минут в неделю при температуре ниже 10°C, разделённых на 2-4 сессии.',
  faq6_q: 'Сколько раз в неделю можно приходить?', faq6_a: 'Рекомендуем начинать раз в неделю и прогрессировать по реакции тела. Некоторые клиенты приходят 2-3 раза в неделю.',
  faq7_q: 'Какова политика отмены?', faq7_a: 'Отмена за 48ч – полный возврат. 24-48ч – кредит на другую сессию. Менее 24ч – без возврата.',
  faq8_q: 'Что такое CWI?', faq8_a: 'Cold Water Immersion (погружение в холодную воду). Сертификат CWI — международная профессиональная сертификация для инструкторов по холодному погружению.',

  contact_details_title: 'Контактные данные', contact_address: 'ул. Сирени 52, Реховот',
  contact_complex: 'Комплекс терапевтического бассейна', contact_whatsapp: 'WhatsApp',
  contact_send_msg: 'Написать нам', contact_book_now: 'Забронировать место',
  cta_book_now: 'Забронировать место', cta_explore: 'Узнать больше',
};

export const translations: Record<Lang, Translations> = { he, en, ar, ru };

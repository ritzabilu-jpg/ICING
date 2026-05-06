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
  nav_admin: string; nav_instructor_role: string; nav_sessions_left: string;

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

  // A11y menu (Header)
  a11y_title: string; a11y_font_size: string; a11y_normal: string; a11y_large: string; a11y_xlarge: string;
  a11y_contrast: string; a11y_underline: string; a11y_reset: string; a11y_statement: string; a11y_contact: string;
  a11y_open: string; a11y_close: string;

  // Footer
  footer_desc: string; footer_quick_nav: string;
  footer_home: string; footer_booking: string; footer_team: string;
  footer_workshop_types: string; footer_agenda: string; footer_faq: string;
  footer_contact_title: string; footer_address: string; footer_complex: string;
  footer_maps: string; footer_copyright: string; footer_privacy: string;
  footer_terms: string; footer_accessibility: string;

  // StickyCTA
  sticky_book: string; sticky_whatsapp: string;

  // WelcomeGreeting
  greeting_mandatory_title: string; greeting_mandatory_desc: string; greeting_mandatory_btn: string;
  greeting_return_text: string; greeting_book_btn: string; greeting_journal_btn: string; greeting_health_btn: string;

  // LoginModal
  login_title: string; login_otp_title: string; login_name_label: string; login_name_placeholder: string;
  login_email_label: string; login_otp_hint: string; login_send_btn: string; login_sending_btn: string;
  login_otp_sent: string; login_code_label: string; login_enter_btn: string; login_verifying_btn: string;
  login_back_btn: string; login_error_send: string; login_error_code: string;

  // Contact page
  contact_page_title: string; contact_page_sub: string;
  contact_field_name: string; contact_field_phone: string; contact_field_email: string; contact_field_message: string;
  contact_send_btn: string; contact_sending_btn: string;
  contact_success_title: string; contact_success_sub: string; contact_send_another: string;
  contact_error_general: string; contact_error_network: string;
  contact_required: string;

  // Science page
  science_badge: string; science_title: string; science_sub: string;
  science_topic1_title: string; science_topic1_desc: string; science_topic1_stat: string;
  science_topic2_title: string; science_topic2_desc: string; science_topic2_stat: string;
  science_topic3_title: string; science_topic3_desc: string; science_topic3_stat: string;
  science_topic4_title: string; science_topic4_desc: string; science_topic4_stat: string;
  science_studies_title: string; science_topics_title: string; science_book_cta: string;
  science_stat1_sub: string; science_stat2_sub: string;
  science_stat3_val: string; science_stat3_label: string; science_stat3_sub: string;
  science_stat4_label: string; science_stat4_sub: string;
  science_topics_sub: string; science_read_more: string; science_coming_soon: string;
  science_cta_title: string; science_cta_sub: string;
  science_topic5_title: string; science_topic5_desc: string;
  science_topic6_title: string; science_topic6_desc: string;

  // Booking page
  booking_title: string; booking_sub: string;
  booking_tab_immersions: string; booking_tab_workshops: string;
  booking_step_type: string; booking_step_date: string; booking_step_payment: string;
  booking_choose_workshop: string; booking_choose_package: string;
  booking_choose_immersion: string; booking_loading: string;
  booking_immersions_desc: string; booking_workshops_desc: string;

  // Instructors page
  instructors_title: string; instructors_sub: string; instructors_cert_title: string;
  instructors_cert_desc: string; instructors_theory: string; instructors_practice: string;
  instructors_exam: string; instructors_contact_cta: string; instructors_book_cta: string;
  instructors_theory_desc: string; instructors_practice_desc: string; instructors_exam_desc: string;

  // Reviews page
  reviews_title: string; reviews_sub: string;
  reviews_stat1_label: string; reviews_stat2_label: string; reviews_stat3_label: string; reviews_stat4_label: string;
  reviews_share_title: string; reviews_type_individual: string; reviews_type_couple: string;
  reviews_type_group: string; reviews_type_immersion: string;

  // Checkout flow
  checkout_step1: string; checkout_step2: string; checkout_step3: string;
  checkout_step4: string; checkout_step5: string; checkout_step6: string;
  checkout_of5: string; checkout_loading: string; checkout_continue: string;
  checkout_next: string; checkout_saving: string;
  checkout_name_ph: string; checkout_phone_ph: string; checkout_city_ph: string;
  checkout_participants_label: string; checkout_back: string; checkout_back_payment: string;
  checkout_credit: string; checkout_credit_secured: string; checkout_unavailable: string;
  checkout_reserve: string;
  checkout_bit_quick: string; checkout_bit_title: string; checkout_bit_direct: string;
  checkout_amount: string; checkout_bit_number_label: string; checkout_bit_steps: string;
  checkout_bit_step1: string; checkout_bit_step3: string; checkout_bit_opened: string;
  checkout_bit_wait: string; checkout_bit_paid: string; checkout_bit_not_yet: string;
  checkout_paybox_digital: string;
  checkout_phone_callback: string; checkout_phone_desc: string; checkout_phone_sent: string;
  checkout_phone_email_ph: string;
  checkout_hours_any: string; checkout_hours_any_label: string;
  checkout_hours_morning: string; checkout_hours_noon: string; checkout_hours_afternoon: string;
  checkout_phone_send: string; checkout_phone_24h: string;
  checkout_confirmed_credit: string; checkout_confirmed_bit: string; checkout_confirmed_phone: string;
  checkout_confirm_code: string; checkout_home: string; checkout_science_link: string; checkout_my_bookings: string;
  // Health declaration (used in checkout)
  health_before: string; health_condition: string; health_pregnant: string;
  health_raynauds: string; health_hypertension: string; health_wounds: string;
  health_full_name: string; health_participant_ph: string; health_agree: string;
  health_submit: string; health_skip: string; health_saving: string;
  health_confirm_required: string; health_name_required: string;
  // Daily health check page
  hc_title: string; hc_hello: string; hc_before: string;
  hc_healthy: string; hc_no_fever: string; hc_feeling_good: string;
  hc_submit: string; hc_sending: string; hc_warning: string;
  hc_done_title: string; hc_done_sub: string; hc_back_dashboard: string;
  // Dashboard
  dash_hello: string; dash_role_admin: string; dash_role_instructor: string; dash_personal_area: string;
  dash_health_alert: string; dash_health_done: string; dash_book_btn: string;
  dash_stat_week: string; dash_stat_total_time: string; dash_stat_total: string;
  dash_tab_bookings: string; dash_tab_journal: string; dash_tab_clients: string;
  dash_bookings_title: string; dash_journal_title: string;
  dash_future_title: string; dash_future_desc: string; dash_future_btn: string;
  dash_loading: string; dash_no_bookings: string; dash_paid_label: string; dash_pending_label: string; dash_total_bookings: string;
  dash_col_type: string; dash_col_event: string; dash_col_date: string;
  dash_col_status: string; dash_col_payment: string; dash_col_amount: string; dash_col_code: string; dash_col_health: string;
  dash_status_confirmed: string; dash_status_pending: string; dash_status_cancelled: string;
  dash_pay_paid: string; dash_pay_unpaid: string; dash_pay_refunded: string;
  dash_no_sessions: string; dash_clients_title: string; dash_no_clients: string;
  dash_health_filled_today: string; dash_health_not_filled: string;
  dash_health_checked: string; dash_health_not_checked: string;
  dash_back_list: string; dash_add_session: string; dash_add_session_btn: string;
  dash_add_open: string; dash_close_form: string; dash_close: string;
  dash_session_date: string; dash_session_time: string; dash_session_status: string;
  dash_session_temp: string; dash_session_duration: string; dash_session_instructor: string;
  dash_session_done: string; dash_session_planned: string; dash_session_cancelled: string;
  dash_form_date: string; dash_form_time: string; dash_form_temp: string;
  dash_form_duration: string; dash_form_status: string; dash_form_photo: string;
  dash_form_instructor: string; dash_form_visitor_notes: string; dash_form_instructor_notes: string;
  dash_form_save: string; dash_form_saving: string;
  dash_planned: string; dash_done: string; dash_cancelled: string;
  // Journal page
  journal_title: string; journal_add_title: string; journal_schedule_title: string; journal_upcoming: string;
  journal_date: string; journal_time: string; journal_duration: string; journal_temp: string;
  journal_instructor: string; journal_notes: string; journal_notes_ph: string;
  journal_duration_future: string; journal_save: string; journal_save_future: string;
  journal_duration_required: string;
  journal_no_sessions: string; journal_no_sessions_sub: string;
  journal_col_date: string; journal_col_temp: string; journal_col_duration: string;
  journal_col_instructor: string; journal_col_notes: string;
  journal_stat_cur_week: string; journal_stat_prev_week: string;
  journal_stat_avg_temp: string; journal_stat_total: string;
  journal_minutes: string; journal_upd_same: string; journal_upd_sub: string;
  journal_cur_week: string; journal_all_time: string;

  // Payment page
  payment_title: string; payment_amount: string; payment_back: string;
  payment_credit: string; payment_bit: string; payment_paybox: string; payment_phone: string;
  payment_secured: string; payment_bit_desc: string; payment_paybox_desc: string;
  failed_title: string; failed_desc: string; failed_retry: string; failed_call: string;
  // Immersion page
  immersion_hero_title: string; immersion_hero_sub: string;
  immersion_loading_slots: string; immersion_prev_month: string; immersion_next_month: string;
  immersion_legend_free: string; immersion_legend_selected: string; immersion_legend_none: string;
  immersion_slot_free: string; immersion_slot_taken: string; immersion_no_slots_date: string;
  immersion_step1: string; immersion_step2: string; immersion_step3: string; immersion_step4: string;
  immersion_summary_title: string; immersion_summary_date: string; immersion_summary_time: string;
  immersion_summary_pkg: string; immersion_summary_total: string; immersion_proceed_btn: string;
  immersion_error_no_slot: string; immersion_error_submit: string;
  immersion_done_title: string; immersion_done_sub: string; immersion_home_btn: string;
  immersion_sessions_unit: string; immersion_pkg_savings: string; immersion_pkg_unlimited: string;
  immersion_pkg_single_title: string; immersion_pkg_single_desc: string;
  immersion_pkg_5pack_title: string; immersion_pkg_5pack_desc: string;
  immersion_pkg_10pack_title: string; immersion_pkg_10pack_desc: string;
  immersion_pkg_monthly_title: string; immersion_pkg_monthly_desc: string;
  // booking/success page
  bsuccess_loading: string; bsuccess_title: string; bsuccess_paid_sub: string; bsuccess_pending_sub: string;
  bsuccess_code_label: string; bsuccess_code_save: string;
  bsuccess_details_title: string; bsuccess_workshop_col: string; bsuccess_datetime_col: string;
  bsuccess_instructor_col: string; bsuccess_participants_col: string; bsuccess_total_col: string;
  bsuccess_bring_title: string;
  bsuccess_bring1: string; bsuccess_bring2: string; bsuccess_bring3: string; bsuccess_bring4: string; bsuccess_bring5: string;
  bsuccess_location_title: string; bsuccess_address: string; bsuccess_complex: string; bsuccess_waze: string; bsuccess_gmaps: string;
  bsuccess_load_error: string; bsuccess_check_email: string; bsuccess_book_another: string; bsuccess_home: string;
  // checkout/success page
  csuccess_paid_title: string; csuccess_pending_title: string;
  csuccess_paid_desc: string; csuccess_pending_desc: string;
  csuccess_order_num: string; csuccess_home: string; csuccess_book_more: string;
  // checkout errors + misc
  checkout_error_load_ws: string; checkout_error_load_slot: string; checkout_error_draft: string;
  checkout_error_network: string; checkout_error_fill: string; checkout_error_confirm: string; checkout_error_phone_req: string;
  checkout_callback_by: string; checkout_bit_step2: string;
  // contact page additional
  contact_name_ph: string; contact_message_ph: string; contact_phone_label: string; contact_address_info: string;
  // science title lines
  science_title_line1: string; science_title_line2: string;
};

const he: Translations = {
  nav_home: 'בית', nav_booking: 'הזמנת מקום', nav_instructors: 'המדריכים שלנו',
  nav_science: 'המדע', nav_reviews: 'חוות דעת', nav_contact: 'צור קשר',
  nav_login: 'כניסה', nav_logout: 'יציאה', nav_myarea: 'האזור האישי שלי',
  nav_book_immersion: 'קבע טבילה', nav_book_workshop: 'קבע סדנה', nav_book_now: 'הזמן עכשיו',
  nav_admin: 'מנהל', nav_instructor_role: 'מדריך', nav_sessions_left: 'נשארו {n}',

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

  a11y_title: 'אפשרויות נגישות', a11y_font_size: 'גודל טקסט',
  a11y_normal: 'רגיל', a11y_large: 'גדול', a11y_xlarge: 'גדול מאוד',
  a11y_contrast: 'ניגודיות גבוהה', a11y_underline: 'הדגשת קישורים',
  a11y_reset: 'איפוס הגדרות', a11y_statement: 'הצהרת נגישות',
  a11y_contact: 'פנייה בנושא נגישות: 08-9310715',
  a11y_open: 'פתח תפריט נגישות', a11y_close: 'סגור',

  footer_desc: 'מרכז הטבילה במי קרח. סדנאות מקצועיות ומדעיות לחיזוק חוסן מנטלי, שיפור פוקוס והורדת סטרס. בליווי מדריכים מוסמכים CWI.',
  footer_quick_nav: 'ניווט מהיר', footer_home: 'דף הבית', footer_booking: 'הזמנת מקום',
  footer_team: 'הצוות שלנו', footer_workshop_types: 'סוגי הסדנאות',
  footer_agenda: 'מה מחכה לכם', footer_faq: 'שאלות נפוצות',
  footer_contact_title: 'פרטי קשר', footer_address: 'רחוב סירני 52, רחובות',
  footer_complex: 'מתחם הבריכה הטיפולית', footer_maps: 'פתח ב-Google Maps',
  footer_copyright: 'ליאור כ"ץ. כל הזכויות שמורות.',
  footer_privacy: 'מדיניות פרטיות', footer_terms: 'תנאי שימוש', footer_accessibility: 'נגישות',

  sticky_book: 'הזמן מקום', sticky_whatsapp: 'וואטסאפ',

  greeting_mandatory_title: '⚠️ שלום {name}! יש לך טבילה היום.',
  greeting_mandatory_desc: 'חובה למלא הצהרת בריאות לפני הטבילה',
  greeting_mandatory_btn: '📋 מלא הצהרת בריאות עכשיו',
  greeting_return_text: 'שלום {name}! ברוך שובך',
  greeting_book_btn: '📅 קבע טבילה / סדנה',
  greeting_journal_btn: '📖 יומן טבילות',
  greeting_health_btn: '✅ הצהרת בריאות',

  login_title: 'כניסה / הרשמה', login_otp_title: 'אמת את האימייל',
  login_name_label: 'שם מלא', login_name_placeholder: 'הכנס שמך',
  login_email_label: 'אימייל', login_otp_hint: 'נשלח אליך קוד אימות חד-פעמי באימייל',
  login_send_btn: 'שלח קוד לאימייל', login_sending_btn: 'שולח קוד...',
  login_otp_sent: 'שלחנו קוד 6 ספרות לכתובת',
  login_code_label: 'קוד אימות', login_enter_btn: 'כניסה', login_verifying_btn: 'מאמת...',
  login_back_btn: 'חזור / שלח קוד חדש',
  login_error_send: 'שגיאה בשליחת הקוד', login_error_code: 'קוד שגוי',

  contact_page_title: 'צור קשר', contact_page_sub: 'נשמח לענות על כל שאלה – מלאו את הטופס ונחזור אליכם בהקדם.',
  contact_field_name: 'שם מלא', contact_field_phone: 'טלפון',
  contact_field_email: 'מייל (אופציונלי)', contact_field_message: 'הודעה',
  contact_send_btn: 'שלח הודעה', contact_sending_btn: 'שולח...',
  contact_success_title: 'ההודעה נשלחה בהצלחה!', contact_success_sub: 'ניצור איתך קשר בהקדם.',
  contact_send_another: 'שלח הודעה נוספת',
  contact_error_general: 'שגיאה בשליחה, נסה שוב', contact_error_network: 'שגיאת רשת, בדוק את החיבור ונסה שוב',
  contact_required: '*',

  science_badge: 'מדע הטבילה', science_title: 'המדע מאחורי טבילת מי קרח', science_sub: 'מה שקורה בגוף שלך בכל טבילה',
  science_topic1_title: 'נוראדרנלין', science_topic1_stat: '+127%',
  science_topic1_desc: 'טבילה במים קרים מגבירה את הנוראדרנלין עד פי 3 מהרמה הבסיסית. זה מוביל לעירנות, ריכוז ותחושת עוצמה.',
  science_topic2_title: 'קורטיזול וסטרס', science_topic2_stat: '↓ קורטיזול',
  science_topic2_desc: 'חשיפה מבוקרת לקור מאמנת את ציר HPA. הגוף לומד לווסת את תגובת הסטרס ולהתמודד ביעילות רבה יותר.',
  science_topic3_title: 'דופמין ומוטיבציה', science_topic3_stat: '+250%',
  science_topic3_desc: 'עלייה חדה ברמות הדופמין לאחר טבילה קרה — בדומה לאפקט של פעילות גופנית אינטנסיבית, אך במשך ממושך יותר.',
  science_topic4_title: 'מערכת חיסון ודלקת', science_topic4_stat: '↓ IL-6',
  science_topic4_desc: 'מחקרים מראים ירידה במדדי דלקת ושיפור בתפקוד מערכת החיסון עם חשיפה קבועה למים קרים.',
  science_studies_title: 'מחקרי מפתח', science_topics_title: 'נושאים מדעיים',
  science_book_cta: 'הזמינו מקום בסדנה — חוו בעצמכם',
  science_stat1_sub: 'טבילה ב-5°C', science_stat2_sub: 'לאחר הטבילה',
  science_stat3_val: '↓ קורטיזול', science_stat3_label: 'סטרס', science_stat3_sub: 'בחשיפה חוזרת',
  science_stat4_label: 'ירידה ב-IL-6', science_stat4_sub: 'מדדי דלקת',
  science_topics_sub: 'לחץ על נושא לקריאה מפורטת עם סימוכין',
  science_read_more: 'קרא עוד', science_coming_soon: 'בקרוב',
  science_cta_title: 'רוצה לחוות את המדע בגוף?',
  science_cta_sub: 'הצטרף לסדנת טבילה מודרכת ותרגיש את ההשפעות בעצמך',
  science_topic5_title: 'שריפת שומן חום', science_topic5_desc: 'הפעלת רקמת שומן חום (BAT) ועלייה בשריפת קלוריות.',
  science_topic6_title: 'מערכת העצבים הווגאלית', science_topic6_desc: 'חיזוק עצב הוואגוס, שיפור ויסות עצמי ורגיעה לאחר סטרס.',

  booking_title: 'הזמינו חוויה', booking_sub: 'בחרו את סוג הפעילות שמתאים לכם',
  booking_tab_immersions: 'טבילות', booking_tab_workshops: 'סדנאות',
  booking_step_type: 'בחרו סדנה', booking_step_date: 'בחרו תאריך', booking_step_payment: 'פרטים ותשלום',
  booking_choose_workshop: 'בחר סדנה ›', booking_choose_package: 'בחר חבילה ›',
  booking_choose_immersion: '🧊 קבע טבילה/ות', booking_loading: 'טוען...',
  booking_immersions_desc: 'בחר תאריכים עתידיים לטבילות במי הקרח',
  booking_workshops_desc: 'בחר מתוך סוגי הסדנאות השונים',

  instructors_title: 'הצוות שלנו', instructors_sub: 'מדריכים מוסמכים CWI עם ניסיון וידע',
  instructors_cert_title: '🎓 הסמכת CWI Instructor',
  instructors_cert_desc: 'כל המדריכים שלנו עברו הכשרה מקיפה בפרוטוקולי טבילה קרה, בטיחות ואנטומיה.',
  instructors_theory: 'תיאוריה רפואית', instructors_practice: 'תרגול מעשי', instructors_exam: 'מבחן מסכם',
  instructors_contact_cta: 'רוצה לשמוע פרטים על קורס מדריכי CWI? פנה אלינו',
  instructors_book_cta: 'הזמינו סדנה עם הצוות שלנו',
  instructors_theory_desc: 'Cold Shock Response, תרמורגולציה, הורמזיס, פרוטוקולי בטיחות',
  instructors_practice_desc: 'הדרכת קבוצות, ניהול סיכונים, טיפול בחירום',
  instructors_exam_desc: 'מבחנים מסכמים וסטאז׳ כדרישה להסמכה',

  reviews_title: 'מה אומרים המשתתפים?', reviews_sub: 'חוויות אמיתיות מאנשים שהיו בטבילה',
  reviews_stat1_label: 'שביעות רצון', reviews_stat2_label: 'משתתפים', reviews_stat3_label: 'דירוג ממוצע', reviews_stat4_label: 'חוזרים לסדנה',
  reviews_share_title: 'שתף את החוויה שלך',
  reviews_type_individual: 'סדנת יחידים', reviews_type_couple: 'סדנת זוגות',
  reviews_type_group: 'סדנת קבוצות', reviews_type_immersion: 'טבילה אישית',

  payment_title: 'בחרו אמצעי תשלום', payment_amount: 'סכום לתשלום', payment_back: '← חזרה להזמנה',
  payment_credit: 'תשלום בכרטיס אשראי', payment_bit: 'תשלום ב-Bit',
  payment_paybox: 'תשלום ב-Paybox', payment_phone: 'תשלום בטלפון', payment_secured: 'מאובטח דרך Tranzila',
  payment_bit_desc: 'העברה מהירה בביט', payment_paybox_desc: 'העברה מהירה בפייבוקס',
  failed_title: 'התשלום לא הצליח', failed_desc: 'לצערנו, עיבוד התשלום נכשל. ניתן לנסות שנית או לצור קשר:',
  failed_retry: 'נסו שנית', failed_call: 'התקשרו אלינו',

  checkout_step1: 'סיכום ההזמנה', checkout_step2: 'כניסה / הרשמה', checkout_step3: 'פרטי משתתפים',
  checkout_step4: 'הצהרת בריאות', checkout_step5: 'בחירת תשלום', checkout_step6: 'ההזמנה אושרה!',
  checkout_of5: 'שלב {n} מתוך 5', checkout_loading: 'טוען...', checkout_continue: 'המשך לרכישה ›',
  checkout_next: 'המשך ›', checkout_saving: 'שומר...',
  checkout_name_ph: 'שם מלא', checkout_phone_ph: 'טלפון נייד', checkout_city_ph: 'עיר מגורים',
  checkout_participants_label: 'מספר משתתפים', checkout_back: '← חזרה לשלב הקודם', checkout_back_payment: '← חזרה לבחירת תשלום',
  checkout_credit: '💳 כרטיס אשראי', checkout_credit_secured: 'מאובטח על-ידי טרנזילה',
  checkout_unavailable: 'שיטת התשלום הזו לא מחוברת כרגע אבל אל דאגה! המקום ישמר לך באישור קבלת שיחת טלפון.',
  checkout_reserve: 'שמור מקום עבורי ✓',
  checkout_bit_quick: 'העברה מהירה ממש עכשיו', checkout_bit_title: 'תשלום בביט', checkout_bit_direct: 'העברה ישירה לעסק',
  checkout_amount: 'סכום לתשלום', checkout_bit_number_label: 'מספר הביט לתשלום', checkout_bit_steps: 'שלבים לתשלום:',
  checkout_bit_step1: '1. פתח את אפליקציית Bit בנייד', checkout_bit_step3: '3. חזור לכאן ולחץ "שילמתי" ↓',
  checkout_bit_opened: 'פתחתי את Bit — עברתי לשלם ›', checkout_bit_wait: '⏳ לאחר שביצעת את ההעברה בביט, לחץ/י למטה',
  checkout_bit_paid: 'שילמתי בביט ✓', checkout_bit_not_yet: 'עוד לא שילמתי — חזרה להוראות',
  checkout_paybox_digital: 'תשלום דיגיטלי',
  checkout_phone_callback: 'תשלום טלפוני', checkout_phone_desc: 'ניצור קשר ונסגור את ההזמנה יחד',
  checkout_phone_sent: 'הפנייה נשלחה!', checkout_phone_email_ph: 'כתובת אימייל (לקבלת אישור)',
  checkout_hours_any: 'בכל שעה', checkout_hours_any_label: 'באיזה שעות נוח לך?',
  checkout_hours_morning: 'בוקר 08:00–12:00', checkout_hours_noon: 'צהריים 12:00–16:00', checkout_hours_afternoon: 'אחה״צ 16:00–20:00',
  checkout_phone_send: 'שלח פנייה — נחזור אליך ›', checkout_phone_24h: 'נחזור אליך תוך 24 שעות',
  checkout_confirmed_credit: 'התשלום התקבל. נשלח אישור לאימייל שלך.',
  checkout_confirmed_bit: 'קיבלנו את אישורך. נאמת ב-24 שעות ונשלח אישור למייל.',
  checkout_confirmed_phone: 'נחזור אליך תוך 24 שעות לסיום התשלום.',
  checkout_confirm_code: 'קוד אישור', checkout_home: 'חזרה לדף הבית',
  checkout_science_link: '🔬 המדע שמאחורי הטבילה', checkout_my_bookings: '📋 צפייה בהזמנות שלי',

  health_before: 'נדרש לפני כל השתתפות. סמן/י את הפריטים הרלוונטיים אליך.',
  health_condition: 'אני סובל/ת ממצב לב', health_pregnant: 'אני בהריון',
  health_raynauds: 'אני סובל/ת מתסמונת Raynaud', health_hypertension: 'יש לי לחץ דם גבוה',
  health_wounds: 'יש לי פצעים פתוחים', health_full_name: 'שם מלא', health_participant_ph: 'שם המשתתף',
  health_agree: 'אני מאשר/ת שקראתי את ההצהרה לעיל, המידע שמסרתי מדויק, ואני מסכים/ה לתנאי ההשתתפות.',
  health_submit: 'אשר הצהרה ✓', health_skip: 'דלג', health_saving: 'שומר...',
  health_confirm_required: 'יש לאשר את ההצהרה', health_name_required: 'יש למלא שם משתתף',

  hc_title: 'הצהרת בריאות יומית', hc_hello: 'שלום {name}', hc_before: 'לפני כל טבילה יש לאשר את הדברים הבאים:',
  hc_healthy: 'אני מרגיש/ה בריא/ה כיום', hc_no_fever: 'אין לי חום (מתחת ל-37.5°C)',
  hc_feeling_good: 'אני מרגיש/ה טוב ומסוגל/ת לטבילה',
  hc_submit: '✅ אני מצהיר/ה ומאשר/ת — קדימה לטבילה!', hc_sending: 'שולח...',
  hc_warning: 'אם אינך מרגיש/ה טוב, אנא הימנע/י מהטבילה ופנה/י לצוות',
  hc_done_title: 'הצהרת הבריאות הוגשה', hc_done_sub: 'תודה {name}! אתה מוכן לטבילה להיום.',
  hc_back_dashboard: 'חזור לדשבורד',

  dash_hello: 'שלום {name}! 👋', dash_role_admin: '👑 מנהל מערכת', dash_role_instructor: '🏊 מדריך',
  dash_personal_area: 'האזור האישי שלך', dash_health_alert: '⚠️ מלא הצהרת בריאות',
  dash_health_done: '✅ הצהרת בריאות מולאה', dash_book_btn: '📅 הזמן טבילה',
  dash_stat_week: 'שבוע אחרון', dash_stat_total_time: 'סה"כ כל הזמן', dash_stat_total: 'סה"כ טבילות',
  dash_tab_bookings: '📋 הזמנות', dash_tab_journal: '📖 יומן טבילות', dash_tab_clients: '👥 לקוחות',
  dash_bookings_title: '📋 הזמנות שלי', dash_journal_title: '📖 יומן הטבילות',
  dash_future_title: '📅 הזמנות עתידיות', dash_future_desc: 'להזמנת טבילה או סדנה הקלק/י על הכפתור:',
  dash_future_btn: '📅 הזמן טבילה / סדנה', dash_loading: 'טוען...', dash_no_bookings: 'לא נמצאו הזמנות',
  dash_paid_label: 'שולם', dash_pending_label: 'ממתין', dash_total_bookings: 'סה"כ הזמנות',
  dash_col_type: 'סוג', dash_col_event: 'אירוע', dash_col_date: 'תאריך',
  dash_col_status: 'סטטוס', dash_col_payment: 'תשלום', dash_col_amount: 'סכום', dash_col_code: 'קוד', dash_col_health: 'הצהרה',
  dash_status_confirmed: 'מאושר', dash_status_pending: 'ממתין', dash_status_cancelled: 'בוטל',
  dash_pay_paid: '✅ שולם', dash_pay_unpaid: '⏳ לא שולם', dash_pay_refunded: '↩ הוחזר',
  dash_no_sessions: 'עדיין אין טבילות מתועדות', dash_clients_title: 'רשימת לקוחות',
  dash_no_clients: 'אין לקוחות רשומים עדיין',
  dash_health_filled_today: '✅ מילא הצהרת בריאות להיום', dash_health_not_filled: '⚠️ לא מילא הצהרת בריאות היום',
  dash_health_checked: '✓ מילא היום', dash_health_not_checked: '⚠ לא מילא',
  dash_back_list: '▶ חזור לרשימה', dash_add_session: 'הוסף כניסת טבילה',
  dash_add_session_btn: '+ הוסף כניסת טבילה', dash_add_open: '+ הוסף כניסה',
  dash_close_form: 'סגור טופס', dash_close: 'סגור',
  dash_session_date: 'תאריך', dash_session_time: 'שעה', dash_session_status: 'סטטוס',
  dash_session_temp: 'טמפרטורה', dash_session_duration: 'משך טבילה', dash_session_instructor: 'שם מדריך',
  dash_session_done: 'בוצע', dash_session_planned: 'מתוכנן', dash_session_cancelled: 'בוטל',
  dash_form_date: 'תאריך', dash_form_time: 'שעה', dash_form_temp: 'טמפרטורה (°C)',
  dash_form_duration: 'משך (דקות) *', dash_form_status: 'סטטוס', dash_form_photo: 'תמונת טבילה (URL)',
  dash_form_instructor: 'שם מדריך', dash_form_visitor_notes: 'הערות מטביל', dash_form_instructor_notes: 'הערות מדריך',
  dash_form_save: '+ הוסף', dash_form_saving: 'שומר...',
  dash_planned: 'מתוכנן', dash_done: 'בוצע', dash_cancelled: 'בוטל',

  journal_title: '📖 יומן הטבילות', journal_add_title: '+ הוסף טבילה', journal_schedule_title: '📅 קבע טבילה עתידית',
  journal_upcoming: '📅 טבילות קרובות',
  journal_date: 'תאריך', journal_time: 'שעה', journal_duration: 'משך (דקות)', journal_temp: 'טמפרטורה ממוצעת (°C)',
  journal_instructor: 'מדריך אחראי', journal_notes: 'הערות (אופציונלי)',
  journal_notes_ph: 'הרגשתי טוב, מעט סחרחורת בסוף...',
  journal_duration_future: 'יתעדכן לאחר הטבילה', journal_save: '💾 שמור טבילה',
  journal_save_future: '📅 שמור תאריך טבילה', journal_duration_required: 'יש להזין משך טבילה',
  journal_no_sessions: 'עדיין אין טבילות מתועדות', journal_no_sessions_sub: 'הוסף את הטבילה הראשונה שלך למעלה',
  journal_col_date: 'תאריך', journal_col_temp: 'טמפ׳', journal_col_duration: 'משך',
  journal_col_instructor: 'מדריך', journal_col_notes: 'הערות',
  journal_stat_cur_week: 'שבוע נוכחי', journal_stat_prev_week: 'שבוע שעבר',
  journal_stat_avg_temp: 'ממוצע טמפרטורה', journal_stat_total: 'סה"כ טבילות',
  journal_minutes: "דק'", journal_upd_same: 'כמו שבוע שעבר', journal_upd_sub: 'סה"כ דקות טבילה',
  journal_cur_week: 'שבוע נוכחי', journal_all_time: 'כל הזמן',

  immersion_hero_title: 'קבע מועד לטבילה', immersion_hero_sub: 'בהדרכת מדריך מוסמך · רחובות',
  immersion_loading_slots: 'טוען מועדים...', immersion_prev_month: 'חודש קודם', immersion_next_month: 'חודש הבא',
  immersion_legend_free: 'פנוי', immersion_legend_selected: 'נבחר', immersion_legend_none: 'אין מועדים',
  immersion_slot_free: 'פנוי', immersion_slot_taken: 'תפוס', immersion_no_slots_date: 'אין מועדים זמינים בתאריך זה.',
  immersion_step1: 'בחר תאריך', immersion_step2: 'בחר שעה', immersion_step3: 'בחר חבילה', immersion_step4: 'סיכום והמשך לתשלום',
  immersion_summary_title: 'סיכום הזמנה', immersion_summary_date: 'תאריך', immersion_summary_time: 'שעה',
  immersion_summary_pkg: 'חבילה', immersion_summary_total: 'סה״כ לתשלום', immersion_proceed_btn: 'המשך לפרטים ותשלום →',
  immersion_error_no_slot: 'יש לבחור מועד טבילה', immersion_error_submit: 'שגיאה בהרשמה',
  immersion_done_title: 'הרשמה התקבלה!', immersion_done_sub: '{name}, נרשמת בהצלחה.', immersion_home_btn: 'חזרה לדף הבית',
  immersion_sessions_unit: 'טבילות', immersion_pkg_savings: 'חיסכון של ₪50', immersion_pkg_unlimited: '∞ ללא הגבלה',
  immersion_pkg_single_title: 'טבילה בודדת',
  immersion_pkg_single_desc: 'טבילה באמבטיית קרח בהדרכת מדריך מוסמך. בסביבה מבוקרת ובטוחה, עד עשר דקות, תוך פיקוח מקצועי.',
  immersion_pkg_5pack_title: 'חבילת 5 טבילות',
  immersion_pkg_5pack_desc: '5 טבילות בהדרכה מקצועית. כל טבילה נקבעת בנפרד לפי לוח הזמנים הזמין.',
  immersion_pkg_10pack_title: 'חבילת 10 טבילות',
  immersion_pkg_10pack_desc: '10 טבילות בהדרכה מקצועית. חבילת השגרה המומלצת להתקדמות ממשית.',
  immersion_pkg_monthly_title: 'חופשי חודשי',
  immersion_pkg_monthly_desc: 'גישה חופשית לכל הטבילות במשך חודש קלנדרי אחד. ללא הגבלת מספר טבילות.',

  bsuccess_loading: 'טוען פרטי הזמנה...', bsuccess_title: 'ההזמנה אושרה!',
  bsuccess_paid_sub: 'התשלום התקבל בהצלחה. נשלח אישור למייל שלך.',
  bsuccess_pending_sub: 'ההזמנה נקלטה בהצלחה. אישור נשלח למייל שלך.',
  bsuccess_code_label: 'קוד אישור ההזמנה שלך', bsuccess_code_save: 'שמרו קוד זה לצורך כניסה לסדנה',
  bsuccess_details_title: 'פרטי הסדנה', bsuccess_workshop_col: 'סדנה', bsuccess_datetime_col: 'תאריך ושעה',
  bsuccess_instructor_col: 'מדריך', bsuccess_participants_col: 'משתתפים', bsuccess_total_col: 'סה"כ',
  bsuccess_bring_title: 'מה להביא לסדנה?',
  bsuccess_bring1: 'בגד ים או בגד ספורט צמוד', bsuccess_bring2: 'מגבת גדולה וחמה',
  bsuccess_bring3: 'בגדים חמים להחלפה לאחר הסדנה', bsuccess_bring4: 'שתייה חמה בתרמוס (אופציונלי)',
  bsuccess_bring5: 'להגיע 10 דקות לפני תחילת הסדנה',
  bsuccess_location_title: 'מיקום', bsuccess_address: 'רחוב סירני 52, רחובות',
  bsuccess_complex: 'מתחם הבריכה הטיפולית', bsuccess_waze: 'נווט בWaze', bsuccess_gmaps: 'Google Maps',
  bsuccess_load_error: 'לא ניתן לטעון פרטי הזמנה', bsuccess_check_email: 'בדקו את תיבת המייל שלכם לאישור ההזמנה',
  bsuccess_book_another: 'הזמינו סדנה נוספת', bsuccess_home: 'חזרה לדף הבית',

  csuccess_paid_title: 'התשלום התקבל!', csuccess_pending_title: 'ההזמנה נרשמה',
  csuccess_paid_desc: 'תודה! אישור ישלח לאימייל שלך בקרוב.',
  csuccess_pending_desc: 'קיבלנו את פרטיך. נחזור אליך לאישור סופי.',
  csuccess_order_num: 'מספר הזמנה', csuccess_home: 'חזרה לדף הבית', csuccess_book_more: 'הזמן טבילה נוספת',

  checkout_error_load_ws: 'שגיאה בטעינת הסדנה', checkout_error_load_slot: 'שגיאה בטעינת חלון הטבילה',
  checkout_error_draft: 'שגיאה ביצירת הזמנה', checkout_error_network: 'שגיאת רשת — נסה שנית',
  checkout_error_fill: 'יש למלא שם וטלפון', checkout_error_confirm: 'שגיאה באישור התשלום',
  checkout_error_phone_req: 'שגיאה בשליחת הפנייה',
  checkout_callback_by: 'נחזור אליך {deadline}', checkout_bit_step2: 'שלח ₪{amount} למספר',

  contact_name_ph: 'ישראל ישראלי', contact_message_ph: 'כתבו את הודעתכם כאן...',
  contact_phone_label: 'טלפון', contact_address_info: 'סירני 52, רחובות',

  science_title_line1: 'המדע מאחורי', science_title_line2: 'טבילת מי קרח',
};

const en: Translations = {
  nav_home: 'Home', nav_booking: 'Book a Session', nav_instructors: 'Our Instructors',
  nav_science: 'Science', nav_reviews: 'Reviews', nav_contact: 'Contact',
  nav_login: 'Login', nav_logout: 'Logout', nav_myarea: 'My Dashboard',
  nav_book_immersion: 'Book Immersion', nav_book_workshop: 'Book Workshop', nav_book_now: 'Book Now',
  nav_admin: 'Admin', nav_instructor_role: 'Instructor', nav_sessions_left: '{n} left',

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

  a11y_title: 'Accessibility Options', a11y_font_size: 'Font size',
  a11y_normal: 'Normal', a11y_large: 'Large', a11y_xlarge: 'Extra large',
  a11y_contrast: 'High contrast', a11y_underline: 'Underline links',
  a11y_reset: 'Reset settings', a11y_statement: 'Accessibility statement',
  a11y_contact: 'Accessibility contact: 08-9310715',
  a11y_open: 'Open accessibility menu', a11y_close: 'Close',

  footer_desc: 'Ice bath immersion centre. Professional, research-based workshops for mental resilience, focus and stress reduction. Led by certified CWI instructors.',
  footer_quick_nav: 'Quick navigation', footer_home: 'Home', footer_booking: 'Book a session',
  footer_team: 'Our team', footer_workshop_types: 'Workshop types',
  footer_agenda: 'What awaits you', footer_faq: 'FAQs',
  footer_contact_title: 'Contact', footer_address: '52 Sireni St., Rehovot',
  footer_complex: 'Therapeutic Pool Complex', footer_maps: 'Open in Google Maps',
  footer_copyright: 'ICING. All rights reserved.',
  footer_privacy: 'Privacy policy', footer_terms: 'Terms of use', footer_accessibility: 'Accessibility',

  sticky_book: 'Book Now', sticky_whatsapp: 'WhatsApp',

  greeting_mandatory_title: '⚠️ Hi {name}! You have an immersion today.',
  greeting_mandatory_desc: 'You must complete the health declaration before your immersion',
  greeting_mandatory_btn: '📋 Complete health declaration now',
  greeting_return_text: 'Hello {name}! Welcome back',
  greeting_book_btn: '📅 Book immersion / workshop',
  greeting_journal_btn: '📖 Immersion journal',
  greeting_health_btn: '✅ Health declaration',

  login_title: 'Login / Register', login_otp_title: 'Verify your email',
  login_name_label: 'Full name', login_name_placeholder: 'Enter your name',
  login_email_label: 'Email', login_otp_hint: 'We will send you a one-time verification code by email',
  login_send_btn: 'Send code to email', login_sending_btn: 'Sending code...',
  login_otp_sent: 'We sent a 6-digit code to',
  login_code_label: 'Verification code', login_enter_btn: 'Login', login_verifying_btn: 'Verifying...',
  login_back_btn: 'Back / Send new code',
  login_error_send: 'Error sending code', login_error_code: 'Incorrect code',

  contact_page_title: 'Contact Us', contact_page_sub: 'Happy to answer any question – fill in the form and we will get back to you.',
  contact_field_name: 'Full name', contact_field_phone: 'Phone',
  contact_field_email: 'Email (optional)', contact_field_message: 'Message',
  contact_send_btn: 'Send message', contact_sending_btn: 'Sending...',
  contact_success_title: 'Message sent successfully!', contact_success_sub: 'We will get back to you soon.',
  contact_send_another: 'Send another message',
  contact_error_general: 'Error sending, please try again', contact_error_network: 'Network error, check your connection',
  contact_required: '*',

  science_badge: 'The Science', science_title: 'The Science Behind Ice Water Immersion', science_sub: 'What happens in your body with every plunge',
  science_topic1_title: 'Noradrenaline', science_topic1_stat: '+127%',
  science_topic1_desc: 'Cold water immersion raises noradrenaline up to 3× baseline. This leads to increased alertness, focus and a sense of power.',
  science_topic2_title: 'Cortisol & Stress', science_topic2_stat: '↓ Cortisol',
  science_topic2_desc: 'Controlled cold exposure trains the HPA axis. The body learns to regulate its stress response and cope more efficiently.',
  science_topic3_title: 'Dopamine & Motivation', science_topic3_stat: '+250%',
  science_topic3_desc: 'Sharp rise in dopamine levels after a cold plunge — similar to intense exercise but lasting longer.',
  science_topic4_title: 'Immune System & Inflammation', science_topic4_stat: '↓ IL-6',
  science_topic4_desc: 'Studies show reduced inflammatory markers and improved immune function with regular cold water exposure.',
  science_studies_title: 'Key Studies', science_topics_title: 'Scientific Topics',
  science_book_cta: 'Book your spot — experience it yourself',
  science_stat1_sub: 'immersion at 5°C', science_stat2_sub: 'after plunge',
  science_stat3_val: '↓ Cortisol', science_stat3_label: 'Stress', science_stat3_sub: 'repeated exposure',
  science_stat4_label: '↓ IL-6', science_stat4_sub: 'inflammation markers',
  science_topics_sub: 'Click a topic for detailed reading with references',
  science_read_more: 'Read more', science_coming_soon: 'Coming soon',
  science_cta_title: 'Want to experience the science yourself?',
  science_cta_sub: 'Join a guided immersion session and feel the effects firsthand',
  science_topic5_title: 'Brown fat burning', science_topic5_desc: 'Activation of brown adipose tissue (BAT) and increased calorie burning.',
  science_topic6_title: 'Vagal nervous system', science_topic6_desc: 'Strengthening the vagus nerve, improving self-regulation and recovery after stress.',

  booking_title: 'Book an Experience', booking_sub: 'Choose the type of activity that suits you',
  booking_tab_immersions: 'Immersions', booking_tab_workshops: 'Workshops',
  booking_step_type: 'Choose workshop', booking_step_date: 'Choose date', booking_step_payment: 'Details & payment',
  booking_choose_workshop: 'Choose workshop ›', booking_choose_package: 'Choose package ›',
  booking_choose_immersion: '🧊 Book immersion(s)', booking_loading: 'Loading...',
  booking_immersions_desc: 'Choose future dates for ice water immersions',
  booking_workshops_desc: 'Choose from the different workshop types',

  instructors_title: 'Our Team', instructors_sub: 'Certified CWI instructors with experience and knowledge',
  instructors_cert_title: '🎓 CWI Instructor Certification',
  instructors_cert_desc: 'All our instructors completed comprehensive training in cold immersion protocols, safety and anatomy.',
  instructors_theory: 'Medical theory', instructors_practice: 'Practical training', instructors_exam: 'Final exam',
  instructors_contact_cta: 'Want to know about CWI instructor courses? Contact us',
  instructors_book_cta: 'Book a session with our team',
  instructors_theory_desc: 'Cold Shock Response, thermoregulation, hormesis, safety protocols',
  instructors_practice_desc: 'Group instruction, risk management, emergency response',
  instructors_exam_desc: 'Final exams and internship as certification requirements',

  reviews_title: 'What Participants Say', reviews_sub: 'Real experiences from people who took the plunge',
  reviews_stat1_label: 'Satisfaction', reviews_stat2_label: 'Participants', reviews_stat3_label: 'Average rating', reviews_stat4_label: 'Return for more',
  reviews_share_title: 'Share your experience',
  reviews_type_individual: 'Individual workshop', reviews_type_couple: 'Couples workshop',
  reviews_type_group: 'Group workshop', reviews_type_immersion: 'Personal immersion',

  payment_title: 'Choose payment method', payment_amount: 'Amount to pay', payment_back: '← Back to booking',
  payment_credit: 'Credit card payment', payment_bit: 'Pay with Bit',
  payment_paybox: 'Pay with Paybox', payment_phone: 'Phone payment', payment_secured: 'Secured via Tranzila',
  payment_bit_desc: 'Quick transfer via Bit', payment_paybox_desc: 'Quick transfer via Paybox',
  failed_title: 'Payment failed', failed_desc: 'Unfortunately the payment could not be processed. Try again or contact us:',
  failed_retry: 'Try again', failed_call: 'Call us',

  checkout_step1: 'Order Summary', checkout_step2: 'Login / Register', checkout_step3: 'Participant Details',
  checkout_step4: 'Health Declaration', checkout_step5: 'Choose Payment', checkout_step6: 'Booking Confirmed!',
  checkout_of5: 'Step {n} of 5', checkout_loading: 'Loading...', checkout_continue: 'Continue to purchase ›',
  checkout_next: 'Continue ›', checkout_saving: 'Saving...',
  checkout_name_ph: 'Full name', checkout_phone_ph: 'Mobile phone', checkout_city_ph: 'City',
  checkout_participants_label: 'Number of participants', checkout_back: '← Back to previous step', checkout_back_payment: '← Back to payment options',
  checkout_credit: '💳 Credit Card', checkout_credit_secured: 'Secured by Tranzila',
  checkout_unavailable: "This payment method isn't connected yet, but don't worry! Your spot will be saved pending our confirmation call.",
  checkout_reserve: 'Reserve my spot ✓',
  checkout_bit_quick: 'Quick transfer right now', checkout_bit_title: 'Pay with Bit', checkout_bit_direct: 'Direct business transfer',
  checkout_amount: 'Amount to pay', checkout_bit_number_label: 'Bit number for payment', checkout_bit_steps: 'Payment steps:',
  checkout_bit_step1: '1. Open the Bit app on your phone', checkout_bit_step3: '3. Return here and click "I paid" ↓',
  checkout_bit_opened: 'Opened Bit — going to pay ›', checkout_bit_wait: '⏳ After completing the Bit transfer, click below',
  checkout_bit_paid: 'I paid with Bit ✓', checkout_bit_not_yet: 'Not yet paid — back to instructions',
  checkout_paybox_digital: 'Digital payment',
  checkout_phone_callback: 'Phone payment', checkout_phone_desc: "We'll contact you to complete the booking",
  checkout_phone_sent: 'Request sent!', checkout_phone_email_ph: 'Email address (for confirmation)',
  checkout_hours_any: 'Any time', checkout_hours_any_label: 'What hours suit you?',
  checkout_hours_morning: 'Morning 08:00–12:00', checkout_hours_noon: 'Noon 12:00–16:00', checkout_hours_afternoon: 'Afternoon 16:00–20:00',
  checkout_phone_send: "Send request — we'll call you ›", checkout_phone_24h: "We'll contact you within 24 hours",
  checkout_confirmed_credit: "Payment received. We'll send a confirmation to your email.",
  checkout_confirmed_bit: "We received your confirmation. We'll verify within 24 hours and send an email.",
  checkout_confirmed_phone: "We'll contact you within 24 hours to complete payment.",
  checkout_confirm_code: 'Confirmation code', checkout_home: 'Back to homepage',
  checkout_science_link: '🔬 The science behind cold immersion', checkout_my_bookings: '📋 View my bookings',

  health_before: 'Required before each session. Check all items that apply to you.',
  health_condition: 'I have a heart condition', health_pregnant: 'I am pregnant',
  health_raynauds: "I have Raynaud's syndrome", health_hypertension: 'I have high blood pressure',
  health_wounds: 'I have open wounds', health_full_name: 'Full name', health_participant_ph: 'Participant name',
  health_agree: "I confirm I've read the declaration above, the information I provided is accurate, and I agree to the participation terms.",
  health_submit: 'Confirm declaration ✓', health_skip: 'Skip', health_saving: 'Saving...',
  health_confirm_required: 'You must confirm the declaration', health_name_required: 'Please enter participant name',

  hc_title: 'Daily Health Declaration', hc_hello: 'Hello {name}', hc_before: 'Before each immersion, please confirm the following:',
  hc_healthy: 'I feel healthy today', hc_no_fever: 'I have no fever (below 37.5°C)',
  hc_feeling_good: 'I feel well and ready for immersion',
  hc_submit: "✅ I declare and confirm — let's go!", hc_sending: 'Sending...',
  hc_warning: "If you don't feel well, please avoid the immersion and contact the team",
  hc_done_title: 'Health declaration submitted', hc_done_sub: "Thank you {name}! You're ready for today's immersion.",
  hc_back_dashboard: 'Back to dashboard',

  dash_hello: 'Hello {name}! 👋', dash_role_admin: '👑 System Admin', dash_role_instructor: '🏊 Instructor',
  dash_personal_area: 'Your personal area', dash_health_alert: '⚠️ Fill health declaration',
  dash_health_done: '✅ Health declaration filled', dash_book_btn: '📅 Book immersion',
  dash_stat_week: 'Last week', dash_stat_total_time: 'All time total', dash_stat_total: 'Total immersions',
  dash_tab_bookings: '📋 Bookings', dash_tab_journal: '📖 Immersion journal', dash_tab_clients: '👥 Clients',
  dash_bookings_title: '📋 My bookings', dash_journal_title: '📖 Immersion journal',
  dash_future_title: '📅 Upcoming bookings', dash_future_desc: 'To book an immersion or workshop:',
  dash_future_btn: '📅 Book immersion / workshop', dash_loading: 'Loading...', dash_no_bookings: 'No bookings found',
  dash_paid_label: 'Paid', dash_pending_label: 'Pending', dash_total_bookings: 'Total bookings',
  dash_col_type: 'Type', dash_col_event: 'Event', dash_col_date: 'Date',
  dash_col_status: 'Status', dash_col_payment: 'Payment', dash_col_amount: 'Amount', dash_col_code: 'Code', dash_col_health: 'Health',
  dash_status_confirmed: 'Confirmed', dash_status_pending: 'Pending', dash_status_cancelled: 'Cancelled',
  dash_pay_paid: '✅ Paid', dash_pay_unpaid: '⏳ Unpaid', dash_pay_refunded: '↩ Refunded',
  dash_no_sessions: 'No immersions recorded yet', dash_clients_title: 'Client list',
  dash_no_clients: 'No clients registered yet',
  dash_health_filled_today: "✅ Completed today's health declaration", dash_health_not_filled: "⚠️ Health declaration not filled today",
  dash_health_checked: '✓ Filled today', dash_health_not_checked: '⚠ Not filled',
  dash_back_list: '▶ Back to list', dash_add_session: 'Add immersion entry',
  dash_add_session_btn: '+ Add immersion entry', dash_add_open: '+ Add entry',
  dash_close_form: 'Close form', dash_close: 'Close',
  dash_session_date: 'Date', dash_session_time: 'Time', dash_session_status: 'Status',
  dash_session_temp: 'Temperature', dash_session_duration: 'Duration', dash_session_instructor: 'Instructor',
  dash_session_done: 'Done', dash_session_planned: 'Planned', dash_session_cancelled: 'Cancelled',
  dash_form_date: 'Date', dash_form_time: 'Time', dash_form_temp: 'Temperature (°C)',
  dash_form_duration: 'Duration (min) *', dash_form_status: 'Status', dash_form_photo: 'Photo URL',
  dash_form_instructor: 'Instructor', dash_form_visitor_notes: 'Participant notes', dash_form_instructor_notes: 'Instructor notes',
  dash_form_save: '+ Add', dash_form_saving: 'Saving...',
  dash_planned: 'Planned', dash_done: 'Done', dash_cancelled: 'Cancelled',

  journal_title: '📖 Immersion Journal', journal_add_title: '+ Add immersion', journal_schedule_title: '📅 Schedule future immersion',
  journal_upcoming: '📅 Upcoming immersions',
  journal_date: 'Date', journal_time: 'Time', journal_duration: 'Duration (min)', journal_temp: 'Avg temperature (°C)',
  journal_instructor: 'Instructor', journal_notes: 'Notes (optional)',
  journal_notes_ph: 'I felt great, slight dizziness at the end...',
  journal_duration_future: 'Will update after immersion', journal_save: '💾 Save immersion',
  journal_save_future: '📅 Save immersion date', journal_duration_required: 'Please enter immersion duration',
  journal_no_sessions: 'No immersions recorded yet', journal_no_sessions_sub: 'Add your first immersion above',
  journal_col_date: 'Date', journal_col_temp: 'Temp', journal_col_duration: 'Duration',
  journal_col_instructor: 'Instructor', journal_col_notes: 'Notes',
  journal_stat_cur_week: 'This week', journal_stat_prev_week: 'Last week',
  journal_stat_avg_temp: 'Avg temperature', journal_stat_total: 'Total immersions',
  journal_minutes: 'min', journal_upd_same: 'Same as last week', journal_upd_sub: 'Total immersion minutes',
  journal_cur_week: 'This week', journal_all_time: 'All time',

  immersion_hero_title: 'Schedule a Plunge', immersion_hero_sub: 'With a certified instructor · Rehovot',
  immersion_loading_slots: 'Loading slots...', immersion_prev_month: 'Previous month', immersion_next_month: 'Next month',
  immersion_legend_free: 'Available', immersion_legend_selected: 'Selected', immersion_legend_none: 'No slots',
  immersion_slot_free: 'Free', immersion_slot_taken: 'Full', immersion_no_slots_date: 'No available slots on this date.',
  immersion_step1: 'Choose date', immersion_step2: 'Choose time', immersion_step3: 'Choose package', immersion_step4: 'Summary & payment',
  immersion_summary_title: 'Order summary', immersion_summary_date: 'Date', immersion_summary_time: 'Time',
  immersion_summary_pkg: 'Package', immersion_summary_total: 'Total to pay', immersion_proceed_btn: 'Continue to details & payment →',
  immersion_error_no_slot: 'Please select a time slot', immersion_error_submit: 'Registration error',
  immersion_done_title: 'Registration confirmed!', immersion_done_sub: '{name}, you are registered.', immersion_home_btn: 'Back to home',
  immersion_sessions_unit: 'sessions', immersion_pkg_savings: 'Save ₪50', immersion_pkg_unlimited: '∞ Unlimited',
  immersion_pkg_single_title: 'Single Plunge',
  immersion_pkg_single_desc: 'Cold water immersion with a certified instructor. In a controlled, safe environment, up to ten minutes, with professional supervision.',
  immersion_pkg_5pack_title: '5 Plunges Pack',
  immersion_pkg_5pack_desc: '5 plunges with professional instruction. Each session is scheduled separately according to availability.',
  immersion_pkg_10pack_title: '10 Plunges Pack',
  immersion_pkg_10pack_desc: '10 plunges with professional instruction. The recommended routine package for real progress.',
  immersion_pkg_monthly_title: 'Monthly Pass',
  immersion_pkg_monthly_desc: 'Free access to all plunges for one calendar month. Unlimited number of sessions.',

  bsuccess_loading: 'Loading booking details...', bsuccess_title: 'Booking confirmed!',
  bsuccess_paid_sub: 'Payment received. A confirmation email has been sent.',
  bsuccess_pending_sub: 'Booking received. A confirmation email has been sent.',
  bsuccess_code_label: 'Your booking confirmation code', bsuccess_code_save: 'Keep this code for workshop entry',
  bsuccess_details_title: 'Workshop details', bsuccess_workshop_col: 'Workshop', bsuccess_datetime_col: 'Date & time',
  bsuccess_instructor_col: 'Instructor', bsuccess_participants_col: 'Participants', bsuccess_total_col: 'Total',
  bsuccess_bring_title: 'What to bring to the workshop?',
  bsuccess_bring1: 'Swimwear or tight sportswear', bsuccess_bring2: 'A large warm towel',
  bsuccess_bring3: 'Warm clothes to change into after the workshop', bsuccess_bring4: 'Hot drink in a thermos (optional)',
  bsuccess_bring5: 'Arrive 10 minutes before the workshop starts',
  bsuccess_location_title: 'Location', bsuccess_address: '52 Sireni St, Rehovot',
  bsuccess_complex: 'Therapeutic Pool Complex', bsuccess_waze: 'Navigate via Waze', bsuccess_gmaps: 'Google Maps',
  bsuccess_load_error: 'Could not load booking details', bsuccess_check_email: 'Check your email for booking confirmation',
  bsuccess_book_another: 'Book another workshop', bsuccess_home: 'Back to home',

  csuccess_paid_title: 'Payment received!', csuccess_pending_title: 'Booking registered',
  csuccess_paid_desc: 'Thank you! A confirmation will be sent to your email shortly.',
  csuccess_pending_desc: 'We received your details. We will contact you for final confirmation.',
  csuccess_order_num: 'Order number', csuccess_home: 'Back to home', csuccess_book_more: 'Book another plunge',

  checkout_error_load_ws: 'Error loading workshop', checkout_error_load_slot: 'Error loading slot',
  checkout_error_draft: 'Error creating booking', checkout_error_network: 'Network error — please try again',
  checkout_error_fill: 'Please fill in name and phone', checkout_error_confirm: 'Error confirming payment',
  checkout_error_phone_req: 'Error sending request',
  checkout_callback_by: "We'll call you back {deadline}", checkout_bit_step2: 'Send ₪{amount} to',

  contact_name_ph: 'John Smith', contact_message_ph: 'Write your message here...',
  contact_phone_label: 'Phone', contact_address_info: '52 Sireni St, Rehovot',

  science_title_line1: 'The science behind', science_title_line2: 'cold water immersion',
};

const ar: Translations = {
  nav_home: 'الرئيسية', nav_booking: 'احجز مكانًا', nav_instructors: 'مدربونا',
  nav_science: 'العلم', nav_reviews: 'آراء العملاء', nav_contact: 'تواصل معنا',
  nav_login: 'دخول', nav_logout: 'خروج', nav_myarea: 'لوحتي الشخصية',
  nav_book_immersion: 'احجز غطسًا', nav_book_workshop: 'احجز ورشة', nav_book_now: 'احجز الآن',
  nav_admin: 'مدير', nav_instructor_role: 'مدرب', nav_sessions_left: 'تبقّى {n}',

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

  a11y_title: 'خيارات إمكانية الوصول', a11y_font_size: 'حجم الخط',
  a11y_normal: 'عادي', a11y_large: 'كبير', a11y_xlarge: 'كبير جداً',
  a11y_contrast: 'تباين عالٍ', a11y_underline: 'تسطير الروابط',
  a11y_reset: 'إعادة الضبط', a11y_statement: 'بيان إمكانية الوصول',
  a11y_contact: 'تواصل بشأن إمكانية الوصول: 08-9310715',
  a11y_open: 'فتح قائمة إمكانية الوصول', a11y_close: 'إغلاق',

  footer_desc: 'مركز غمر في الماء البارد. ورش احترافية مبنية على الأبحاث لتعزيز الصمود النفسي، التركيز، وتقليل التوتر. بإشراف مدربين معتمدين CWI.',
  footer_quick_nav: 'روابط سريعة', footer_home: 'الرئيسية', footer_booking: 'احجز مكانًا',
  footer_team: 'فريقنا', footer_workshop_types: 'أنواع الورش',
  footer_agenda: 'ما ينتظرك', footer_faq: 'الأسئلة الشائعة',
  footer_contact_title: 'تواصل معنا', footer_address: 'شارع سيريني 52، رحوفوت',
  footer_complex: 'مجمع المسبح العلاجي', footer_maps: 'فتح في Google Maps',
  footer_copyright: 'ICING. جميع الحقوق محفوظة.',
  footer_privacy: 'سياسة الخصوصية', footer_terms: 'شروط الاستخدام', footer_accessibility: 'إمكانية الوصول',

  sticky_book: 'احجز الآن', sticky_whatsapp: 'واتساب',

  greeting_mandatory_title: '⚠️ مرحباً {name}! لديك غطسة اليوم.',
  greeting_mandatory_desc: 'يجب إكمال تصريح الصحة قبل الغطسة',
  greeting_mandatory_btn: '📋 أكمل تصريح الصحة الآن',
  greeting_return_text: 'مرحباً {name}! أهلاً بعودتك',
  greeting_book_btn: '📅 احجز غطسة / ورشة',
  greeting_journal_btn: '📖 سجل الغطسات',
  greeting_health_btn: '✅ تصريح صحي',

  login_title: 'دخول / تسجيل', login_otp_title: 'تحقق من بريدك الإلكتروني',
  login_name_label: 'الاسم الكامل', login_name_placeholder: 'أدخل اسمك',
  login_email_label: 'البريد الإلكتروني', login_otp_hint: 'سنرسل لك رمز تحقق لمرة واحدة عبر البريد الإلكتروني',
  login_send_btn: 'إرسال الرمز إلى البريد', login_sending_btn: 'جارٍ الإرسال...',
  login_otp_sent: 'أرسلنا رمزاً من 6 أرقام إلى',
  login_code_label: 'رمز التحقق', login_enter_btn: 'دخول', login_verifying_btn: 'جارٍ التحقق...',
  login_back_btn: 'رجوع / إرسال رمز جديد',
  login_error_send: 'خطأ في إرسال الرمز', login_error_code: 'رمز غير صحيح',

  contact_page_title: 'تواصل معنا', contact_page_sub: 'يسعدنا الإجابة على أي سؤال – املأ النموذج وسنتواصل معك قريباً.',
  contact_field_name: 'الاسم الكامل', contact_field_phone: 'الهاتف',
  contact_field_email: 'البريد الإلكتروني (اختياري)', contact_field_message: 'الرسالة',
  contact_send_btn: 'إرسال الرسالة', contact_sending_btn: 'جارٍ الإرسال...',
  contact_success_title: 'تم إرسال الرسالة بنجاح!', contact_success_sub: 'سنتواصل معك قريباً.',
  contact_send_another: 'إرسال رسالة أخرى',
  contact_error_general: 'خطأ في الإرسال، حاول مرة أخرى', contact_error_network: 'خطأ في الشبكة، تحقق من الاتصال',
  contact_required: '*',

  science_badge: 'العلم', science_title: 'العلم وراء الغمر في الماء البارد', science_sub: 'ما يحدث في جسمك عند كل غطسة',
  science_topic1_title: 'النورأدرينالين', science_topic1_stat: '+127%',
  science_topic1_desc: 'يرفع الغمر في الماء البارد النورأدرينالين حتى 3 أضعاف مستواه الأساسي، مما يعزز اليقظة والتركيز وشعور بالقوة.',
  science_topic2_title: 'الكورتيزول والتوتر', science_topic2_stat: '↓ كورتيزول',
  science_topic2_desc: 'يُدرّب التعرض المبكر للبرد محور HPA، ويتعلم الجسم تنظيم استجابة التوتر بكفاءة أعلى.',
  science_topic3_title: 'الدوبامين والتحفيز', science_topic3_stat: '+250%',
  science_topic3_desc: 'ارتفاع حاد في مستويات الدوبامين بعد الغطسة — مشابه للتمرين المكثف لكن لفترة أطول.',
  science_topic4_title: 'الجهاز المناعي والالتهاب', science_topic4_stat: '↓ IL-6',
  science_topic4_desc: 'تُظهر الدراسات انخفاضاً في مؤشرات الالتهاب وتحسناً في وظيفة الجهاز المناعي مع التعرض المنتظم للماء البارد.',
  science_studies_title: 'الدراسات الرئيسية', science_topics_title: 'المواضيع العلمية',
  science_book_cta: 'احجز مكانك — اختبره بنفسك',
  science_stat1_sub: 'غطس عند 5°C', science_stat2_sub: 'بعد الغطسة',
  science_stat3_val: '↓ كورتيزول', science_stat3_label: 'التوتر', science_stat3_sub: 'تعرض متكرر',
  science_stat4_label: '↓ IL-6', science_stat4_sub: 'مؤشرات الالتهاب',
  science_topics_sub: 'انقر على موضوع للقراءة التفصيلية مع المراجع',
  science_read_more: 'اقرأ المزيد', science_coming_soon: 'قريباً',
  science_cta_title: 'هل تريد تجربة العلم بجسدك؟',
  science_cta_sub: 'انضم إلى جلسة غمر إرشادية وشعر بالتأثيرات بنفسك',
  science_topic5_title: 'حرق الدهون البنية', science_topic5_desc: 'تفعيل نسيج الدهون البنية (BAT) وزيادة حرق السعرات الحرارية.',
  science_topic6_title: 'الجهاز العصبي المبهمي', science_topic6_desc: 'تقوية العصب المبهم وتحسين التنظيم الذاتي والتعافي من التوتر.',

  booking_title: 'احجز تجربة', booking_sub: 'اختر نوع النشاط المناسب لك',
  booking_tab_immersions: 'غطسات', booking_tab_workshops: 'ورش عمل',
  booking_step_type: 'اختر ورشة', booking_step_date: 'اختر تاريخاً', booking_step_payment: 'التفاصيل والدفع',
  booking_choose_workshop: 'اختر ورشة ›', booking_choose_package: 'اختر باقة ›',
  booking_choose_immersion: '🧊 احجز غطسة/ات', booking_loading: 'جارٍ التحميل...',
  booking_immersions_desc: 'اختر تواريخ مستقبلية للغطسات في الماء البارد',
  booking_workshops_desc: 'اختر من بين أنواع ورش العمل المختلفة',

  instructors_title: 'فريقنا', instructors_sub: 'مدربون معتمدون CWI ذوو خبرة ومعرفة',
  instructors_cert_title: '🎓 شهادة CWI Instructor',
  instructors_cert_desc: 'اجتاز جميع مدربينا تدريباً شاملاً في بروتوكولات الغمر البارد والسلامة والتشريح.',
  instructors_theory: 'النظرية الطبية', instructors_practice: 'التدريب العملي', instructors_exam: 'الامتحان النهائي',
  instructors_contact_cta: 'تريد معرفة تفاصيل دورة مدربي CWI؟ تواصل معنا',
  instructors_book_cta: 'احجز ورشة مع فريقنا',
  instructors_theory_desc: 'استجابة الصدمة الباردة، التنظيم الحراري، الهرميسيس، بروتوكولات السلامة',
  instructors_practice_desc: 'توجيه المجموعات، إدارة المخاطر، التعامل مع الطوارئ',
  instructors_exam_desc: 'امتحانات ختامية وتدريب عملي كمتطلبات للشهادة',

  reviews_title: 'ماذا يقول المشاركون؟', reviews_sub: 'تجارب حقيقية من أشخاص خاضوا الغمر',
  reviews_stat1_label: 'الرضا', reviews_stat2_label: 'المشاركون', reviews_stat3_label: 'متوسط التقييم', reviews_stat4_label: 'يعودون للمزيد',
  reviews_share_title: 'شارك تجربتك',
  reviews_type_individual: 'ورشة فردية', reviews_type_couple: 'ورشة للأزواج',
  reviews_type_group: 'ورشة جماعية', reviews_type_immersion: 'غمر شخصي',

  payment_title: 'اختر طريقة الدفع', payment_amount: 'المبلغ المستحق', payment_back: '← العودة للحجز',
  payment_credit: 'الدفع ببطاقة الائتمان', payment_bit: 'الدفع بـ Bit',
  payment_paybox: 'الدفع بـ Paybox', payment_phone: 'الدفع هاتفياً', payment_secured: 'مؤمَّن عبر Tranzila',
  payment_bit_desc: 'تحويل سريع عبر Bit', payment_paybox_desc: 'تحويل سريع عبر Paybox',
  failed_title: 'فشل الدفع', failed_desc: 'للأسف لم تتم معالجة الدفع. حاول مجدداً أو تواصل معنا:',
  failed_retry: 'حاول مجدداً', failed_call: 'اتصل بنا',

  checkout_step1: 'ملخص الطلب', checkout_step2: 'تسجيل الدخول', checkout_step3: 'تفاصيل المشاركين',
  checkout_step4: 'إقرار صحي', checkout_step5: 'اختيار الدفع', checkout_step6: 'تأكيد الحجز!',
  checkout_of5: 'خطوة {n} من 5', checkout_loading: 'جارٍ التحميل...', checkout_continue: 'المتابعة للشراء ›',
  checkout_next: 'المتابعة ›', checkout_saving: 'جارٍ الحفظ...',
  checkout_name_ph: 'الاسم الكامل', checkout_phone_ph: 'الهاتف المحمول', checkout_city_ph: 'المدينة',
  checkout_participants_label: 'عدد المشاركين', checkout_back: '→ العودة للخطوة السابقة', checkout_back_payment: '→ العودة لخيارات الدفع',
  checkout_credit: '💳 بطاقة ائتمان', checkout_credit_secured: 'مؤمَّن عبر Tranzila',
  checkout_unavailable: 'هذه الطريقة غير متاحة حالياً، لكن لا تقلق! سيُحفظ مكانك بانتظار اتصالنا.',
  checkout_reserve: 'احجز مكاني ✓',
  checkout_bit_quick: 'تحويل سريع الآن', checkout_bit_title: 'الدفع عبر Bit', checkout_bit_direct: 'تحويل مباشر',
  checkout_amount: 'المبلغ للدفع', checkout_bit_number_label: 'رقم Bit للدفع', checkout_bit_steps: 'خطوات الدفع:',
  checkout_bit_step1: '1. افتح تطبيق Bit', checkout_bit_step3: '3. عد وانقر "دفعت" ↓',
  checkout_bit_opened: 'فتحت Bit — أذهب للدفع ›', checkout_bit_wait: '⏳ بعد إتمام التحويل، انقر أدناه',
  checkout_bit_paid: 'دفعت عبر Bit ✓', checkout_bit_not_yet: 'لم أدفع بعد — عودة للتعليمات',
  checkout_paybox_digital: 'دفع رقمي',
  checkout_phone_callback: 'الدفع الهاتفي', checkout_phone_desc: 'سنتصل بك لإتمام الحجز',
  checkout_phone_sent: 'تم إرسال الطلب!', checkout_phone_email_ph: 'البريد الإلكتروني (للتأكيد)',
  checkout_hours_any: 'في أي وقت', checkout_hours_any_label: 'ما الأوقات المناسبة لك؟',
  checkout_hours_morning: 'صباحاً 08:00–12:00', checkout_hours_noon: 'ظهراً 12:00–16:00', checkout_hours_afternoon: 'عصراً 16:00–20:00',
  checkout_phone_send: 'أرسل الطلب ›', checkout_phone_24h: 'سنتصل بك خلال 24 ساعة',
  checkout_confirmed_credit: 'تم استلام الدفع. سنرسل تأكيداً لبريدك الإلكتروني.',
  checkout_confirmed_bit: 'تلقينا تأكيدك. سنتحقق خلال 24 ساعة ونرسل تأكيداً.',
  checkout_confirmed_phone: 'سنتصل بك خلال 24 ساعة لإتمام الدفع.',
  checkout_confirm_code: 'رمز التأكيد', checkout_home: 'العودة للصفحة الرئيسية',
  checkout_science_link: '🔬 علم الغمر في الماء البارد', checkout_my_bookings: '📋 عرض حجوزاتي',

  health_before: 'مطلوب قبل كل جلسة. علّم على البنود التي تنطبق عليك.',
  health_condition: 'أعاني من مشكلة قلبية', health_pregnant: 'أنا حامل',
  health_raynauds: 'أعاني من متلازمة رينو', health_hypertension: 'لديّ ضغط دم مرتفع',
  health_wounds: 'لديّ جروح مفتوحة', health_full_name: 'الاسم الكامل', health_participant_ph: 'اسم المشارك',
  health_agree: 'أؤكد أنني قرأت الإقرار، والمعلومات دقيقة، وأوافق على شروط المشاركة.',
  health_submit: 'تأكيد الإقرار ✓', health_skip: 'تخطي', health_saving: 'جارٍ الحفظ...',
  health_confirm_required: 'يجب تأكيد الإقرار', health_name_required: 'يرجى إدخال اسم المشارك',

  hc_title: 'الإقرار الصحي اليومي', hc_hello: 'مرحباً {name}', hc_before: 'قبل كل غمر، يرجى تأكيد ما يلي:',
  hc_healthy: 'أشعر بصحة جيدة اليوم', hc_no_fever: 'لا توجد لديّ حمى (أقل من 37.5°C)',
  hc_feeling_good: 'أشعر بحالة جيدة وجاهز للغمر',
  hc_submit: '✅ أُقرّ وأؤكد — هيا!', hc_sending: 'جارٍ الإرسال...',
  hc_warning: 'إذا لم تشعر بتحسن، تجنب الغمر وتواصل مع الفريق',
  hc_done_title: 'تم تقديم الإقرار الصحي', hc_done_sub: 'شكراً {name}! أنت جاهز لغمر اليوم.',
  hc_back_dashboard: 'العودة للوحة التحكم',

  dash_hello: 'مرحباً {name}! 👋', dash_role_admin: '👑 مدير النظام', dash_role_instructor: '🏊 مدرب',
  dash_personal_area: 'منطقتك الشخصية', dash_health_alert: '⚠️ أكمل الإقرار الصحي',
  dash_health_done: '✅ الإقرار الصحي مكتمل', dash_book_btn: '📅 احجز غمرًا',
  dash_stat_week: 'الأسبوع الماضي', dash_stat_total_time: 'المجموع الكلي', dash_stat_total: 'إجمالي الغمرات',
  dash_tab_bookings: '📋 الحجوزات', dash_tab_journal: '📖 سجل الغمرات', dash_tab_clients: '👥 العملاء',
  dash_bookings_title: '📋 حجوزاتي', dash_journal_title: '📖 سجل الغمرات',
  dash_future_title: '📅 الحجوزات القادمة', dash_future_desc: 'لحجز غمر أو ورشة:',
  dash_future_btn: '📅 احجز غمرًا / ورشة', dash_loading: 'جارٍ التحميل...', dash_no_bookings: 'لا توجد حجوزات',
  dash_paid_label: 'مدفوع', dash_pending_label: 'قيد الانتظار', dash_total_bookings: 'إجمالي الحجوزات',
  dash_col_type: 'النوع', dash_col_event: 'الحدث', dash_col_date: 'التاريخ',
  dash_col_status: 'الحالة', dash_col_payment: 'الدفع', dash_col_amount: 'المبلغ', dash_col_code: 'الكود', dash_col_health: 'الإقرار',
  dash_status_confirmed: 'مؤكد', dash_status_pending: 'قيد الانتظار', dash_status_cancelled: 'ملغى',
  dash_pay_paid: '✅ مدفوع', dash_pay_unpaid: '⏳ غير مدفوع', dash_pay_refunded: '↩ مسترد',
  dash_no_sessions: 'لا توجد غمرات مسجلة بعد', dash_clients_title: 'قائمة العملاء',
  dash_no_clients: 'لا يوجد عملاء مسجلون بعد',
  dash_health_filled_today: '✅ أكمل إقرار الصحة اليوم', dash_health_not_filled: '⚠️ لم يُكمل إقرار الصحة اليوم',
  dash_health_checked: '✓ ملّأ اليوم', dash_health_not_checked: '⚠ لم يملأ',
  dash_back_list: '▶ العودة للقائمة', dash_add_session: 'إضافة غمرة',
  dash_add_session_btn: '+ إضافة غمرة', dash_add_open: '+ إضافة',
  dash_close_form: 'إغلاق النموذج', dash_close: 'إغلاق',
  dash_session_date: 'التاريخ', dash_session_time: 'الوقت', dash_session_status: 'الحالة',
  dash_session_temp: 'الحرارة', dash_session_duration: 'المدة', dash_session_instructor: 'المدرب',
  dash_session_done: 'تمّ', dash_session_planned: 'مخطط', dash_session_cancelled: 'ملغى',
  dash_form_date: 'التاريخ', dash_form_time: 'الوقت', dash_form_temp: 'الحرارة (°C)',
  dash_form_duration: 'المدة (دقائق) *', dash_form_status: 'الحالة', dash_form_photo: 'رابط الصورة',
  dash_form_instructor: 'المدرب', dash_form_visitor_notes: 'ملاحظات المشارك', dash_form_instructor_notes: 'ملاحظات المدرب',
  dash_form_save: '+ إضافة', dash_form_saving: 'جارٍ الحفظ...',
  dash_planned: 'مخطط', dash_done: 'تمّ', dash_cancelled: 'ملغى',

  journal_title: '📖 سجل الغمرات', journal_add_title: '+ إضافة غمرة', journal_schedule_title: '📅 جدولة غمرة قادمة',
  journal_upcoming: '📅 الغمرات القادمة',
  journal_date: 'التاريخ', journal_time: 'الوقت', journal_duration: 'المدة (دقائق)', journal_temp: 'متوسط الحرارة (°C)',
  journal_instructor: 'المدرب المسؤول', journal_notes: 'ملاحظات (اختياري)',
  journal_notes_ph: 'شعرت بتحسن، دوخة خفيفة في النهاية...',
  journal_duration_future: 'سيُحدَّث بعد الغمرة', journal_save: '💾 حفظ الغمرة',
  journal_save_future: '📅 حفظ تاريخ الغمرة', journal_duration_required: 'يرجى إدخال مدة الغمرة',
  journal_no_sessions: 'لا توجد غمرات مسجلة بعد', journal_no_sessions_sub: 'أضف غمرتك الأولى أعلاه',
  journal_col_date: 'التاريخ', journal_col_temp: 'الحرارة', journal_col_duration: 'المدة',
  journal_col_instructor: 'المدرب', journal_col_notes: 'الملاحظات',
  journal_stat_cur_week: 'هذا الأسبوع', journal_stat_prev_week: 'الأسبوع الماضي',
  journal_stat_avg_temp: 'متوسط الحرارة', journal_stat_total: 'إجمالي الغمرات',
  journal_minutes: 'دقيقة', journal_upd_same: 'كما الأسبوع الماضي', journal_upd_sub: 'إجمالي دقائق الغمر',
  journal_cur_week: 'هذا الأسبوع', journal_all_time: 'كل الوقت',

  immersion_hero_title: 'احجز موعدًا للغمر', immersion_hero_sub: 'مع مدرب معتمد · ريحوفوت',
  immersion_loading_slots: 'جارٍ تحميل المواعيد...', immersion_prev_month: 'الشهر السابق', immersion_next_month: 'الشهر التالي',
  immersion_legend_free: 'متاح', immersion_legend_selected: 'محدد', immersion_legend_none: 'لا مواعيد',
  immersion_slot_free: 'متاح', immersion_slot_taken: 'محجوز', immersion_no_slots_date: 'لا توجد مواعيد متاحة في هذا التاريخ.',
  immersion_step1: 'اختر التاريخ', immersion_step2: 'اختر الوقت', immersion_step3: 'اختر الحزمة', immersion_step4: 'ملخص ومتابعة للدفع',
  immersion_summary_title: 'ملخص الطلب', immersion_summary_date: 'التاريخ', immersion_summary_time: 'الوقت',
  immersion_summary_pkg: 'الحزمة', immersion_summary_total: 'المجموع للدفع', immersion_proceed_btn: 'متابعة للتفاصيل والدفع →',
  immersion_error_no_slot: 'يرجى اختيار موعد', immersion_error_submit: 'خطأ في التسجيل',
  immersion_done_title: 'تم تأكيد التسجيل!', immersion_done_sub: '{name}، تم تسجيلك بنجاح.', immersion_home_btn: 'العودة للرئيسية',
  immersion_sessions_unit: 'جلسات', immersion_pkg_savings: 'وفر ₪50', immersion_pkg_unlimited: '∞ غير محدود',
  immersion_pkg_single_title: 'غمرة واحدة',
  immersion_pkg_single_desc: 'غمر في حمام مائي بارد بإشراف مدرب معتمد. في بيئة آمنة ومضبوطة، حتى عشر دقائق، تحت إشراف احترافي.',
  immersion_pkg_5pack_title: 'حزمة 5 غمرات',
  immersion_pkg_5pack_desc: '5 غمرات بإشراف احترافي. كل جلسة تُحدد بشكل منفصل وفقًا للجدول المتاح.',
  immersion_pkg_10pack_title: 'حزمة 10 غمرات',
  immersion_pkg_10pack_desc: '10 غمرات بإشراف احترافي. الحزمة الروتينية الموصى بها للتقدم الحقيقي.',
  immersion_pkg_monthly_title: 'تصريح شهري',
  immersion_pkg_monthly_desc: 'وصول مجاني لجميع الغمرات لمدة شهر تقويمي واحد. عدد غير محدود من الجلسات.',

  bsuccess_loading: 'جارٍ تحميل تفاصيل الحجز...', bsuccess_title: 'تم تأكيد الحجز!',
  bsuccess_paid_sub: 'تم استلام الدفع. تم إرسال رسالة تأكيد إلى بريدك الإلكتروني.',
  bsuccess_pending_sub: 'تم استلام الحجز. تم إرسال رسالة تأكيد إلى بريدك الإلكتروني.',
  bsuccess_code_label: 'رمز تأكيد حجزك', bsuccess_code_save: 'احتفظ بهذا الرمز للدخول إلى ورشة العمل',
  bsuccess_details_title: 'تفاصيل ورشة العمل', bsuccess_workshop_col: 'ورشة عمل', bsuccess_datetime_col: 'التاريخ والوقت',
  bsuccess_instructor_col: 'المدرب', bsuccess_participants_col: 'المشاركون', bsuccess_total_col: 'المجموع',
  bsuccess_bring_title: 'ماذا تحضر إلى ورشة العمل؟',
  bsuccess_bring1: 'ملابس سباحة أو ملابس رياضية ضيقة', bsuccess_bring2: 'منشفة كبيرة ودافئة',
  bsuccess_bring3: 'ملابس دافئة للتغيير بعد ورشة العمل', bsuccess_bring4: 'مشروب ساخن في ترمس (اختياري)',
  bsuccess_bring5: 'الوصول قبل 10 دقائق من بدء ورشة العمل',
  bsuccess_location_title: 'الموقع', bsuccess_address: 'شارع سيريني 52، ريحوفوت',
  bsuccess_complex: 'مجمع المسبح العلاجي', bsuccess_waze: 'التنقل عبر Waze', bsuccess_gmaps: 'خرائط Google',
  bsuccess_load_error: 'تعذر تحميل تفاصيل الحجز', bsuccess_check_email: 'تحقق من بريدك الإلكتروني لتأكيد الحجز',
  bsuccess_book_another: 'احجز ورشة عمل أخرى', bsuccess_home: 'العودة للرئيسية',

  csuccess_paid_title: 'تم استلام الدفع!', csuccess_pending_title: 'تم تسجيل الحجز',
  csuccess_paid_desc: 'شكرًا! سيُرسل تأكيد إلى بريدك الإلكتروني قريبًا.',
  csuccess_pending_desc: 'استلمنا تفاصيلك. سنتصل بك للتأكيد النهائي.',
  csuccess_order_num: 'رقم الطلب', csuccess_home: 'العودة للرئيسية', csuccess_book_more: 'احجز غمرة أخرى',

  checkout_error_load_ws: 'خطأ في تحميل ورشة العمل', checkout_error_load_slot: 'خطأ في تحميل الموعد',
  checkout_error_draft: 'خطأ في إنشاء الحجز', checkout_error_network: 'خطأ في الشبكة — يرجى المحاولة مرة أخرى',
  checkout_error_fill: 'يرجى ملء الاسم والهاتف', checkout_error_confirm: 'خطأ في تأكيد الدفع',
  checkout_error_phone_req: 'خطأ في إرسال الطلب',
  checkout_callback_by: 'سنعاود الاتصال بك {deadline}', checkout_bit_step2: 'أرسل ₪{amount} إلى',

  contact_name_ph: 'محمد أحمد', contact_message_ph: 'اكتب رسالتك هنا...',
  contact_phone_label: 'هاتف', contact_address_info: 'سيريني 52، ريحوفوت',

  science_title_line1: 'علم', science_title_line2: 'الغمر في الماء البارد',
};

const ru: Translations = {
  nav_home: 'Главная', nav_booking: 'Забронировать', nav_instructors: 'Наши инструкторы',
  nav_science: 'Наука', nav_reviews: 'Отзывы', nav_contact: 'Контакты',
  nav_login: 'Войти', nav_logout: 'Выйти', nav_myarea: 'Мой кабинет',
  nav_book_immersion: 'Забронировать погружение', nav_book_workshop: 'Забронировать воркшоп', nav_book_now: 'Забронировать',
  nav_admin: 'Админ', nav_instructor_role: 'Инструктор', nav_sessions_left: 'осталось {n}',

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

  a11y_title: 'Параметры доступности', a11y_font_size: 'Размер шрифта',
  a11y_normal: 'Обычный', a11y_large: 'Большой', a11y_xlarge: 'Очень большой',
  a11y_contrast: 'Высокий контраст', a11y_underline: 'Подчёркивать ссылки',
  a11y_reset: 'Сбросить настройки', a11y_statement: 'Заявление о доступности',
  a11y_contact: 'Связь по вопросам доступности: 08-9310715',
  a11y_open: 'Открыть меню доступности', a11y_close: 'Закрыть',

  footer_desc: 'Центр погружения в ледяную воду. Профессиональные, научно обоснованные воркшопы для психостойкости, концентрации и снятия стресса. Под руководством сертифицированных инструкторов CWI.',
  footer_quick_nav: 'Навигация', footer_home: 'Главная', footer_booking: 'Забронировать',
  footer_team: 'Наша команда', footer_workshop_types: 'Виды воркшопов',
  footer_agenda: 'Что вас ждёт', footer_faq: 'Частые вопросы',
  footer_contact_title: 'Контакты', footer_address: 'ул. Сирени 52, Реховот',
  footer_complex: 'Комплекс терапевтического бассейна', footer_maps: 'Открыть в Google Maps',
  footer_copyright: 'ICING. Все права защищены.',
  footer_privacy: 'Политика конфиденциальности', footer_terms: 'Условия использования', footer_accessibility: 'Доступность',

  sticky_book: 'Забронировать', sticky_whatsapp: 'WhatsApp',

  greeting_mandatory_title: '⚠️ Привет, {name}! Сегодня у вас погружение.',
  greeting_mandatory_desc: 'Необходимо заполнить медицинскую декларацию перед погружением',
  greeting_mandatory_btn: '📋 Заполнить декларацию сейчас',
  greeting_return_text: 'Привет, {name}! Добро пожаловать обратно',
  greeting_book_btn: '📅 Забронировать погружение / воркшоп',
  greeting_journal_btn: '📖 Журнал погружений',
  greeting_health_btn: '✅ Медицинская декларация',

  login_title: 'Вход / Регистрация', login_otp_title: 'Подтвердите email',
  login_name_label: 'Полное имя', login_name_placeholder: 'Введите ваше имя',
  login_email_label: 'Email', login_otp_hint: 'Мы отправим вам одноразовый код подтверждения на email',
  login_send_btn: 'Отправить код на email', login_sending_btn: 'Отправка...',
  login_otp_sent: 'Мы отправили 6-значный код на',
  login_code_label: 'Код подтверждения', login_enter_btn: 'Войти', login_verifying_btn: 'Проверка...',
  login_back_btn: 'Назад / Отправить новый код',
  login_error_send: 'Ошибка отправки кода', login_error_code: 'Неверный код',

  contact_page_title: 'Контакты', contact_page_sub: 'Рады ответить на любой вопрос – заполните форму и мы свяжемся с вами.',
  contact_field_name: 'Полное имя', contact_field_phone: 'Телефон',
  contact_field_email: 'Email (необязательно)', contact_field_message: 'Сообщение',
  contact_send_btn: 'Отправить сообщение', contact_sending_btn: 'Отправка...',
  contact_success_title: 'Сообщение отправлено!', contact_success_sub: 'Мы свяжемся с вами в ближайшее время.',
  contact_send_another: 'Отправить ещё одно сообщение',
  contact_error_general: 'Ошибка отправки, попробуйте снова', contact_error_network: 'Ошибка сети, проверьте подключение',
  contact_required: '*',

  science_badge: 'Наука', science_title: 'Наука за ледяными ваннами', science_sub: 'Что происходит в вашем теле при каждом погружении',
  science_topic1_title: 'Норадреналин', science_topic1_stat: '+127%',
  science_topic1_desc: 'Погружение в холодную воду повышает норадреналин до 3× от базового уровня. Это приводит к бдительности, концентрации и ощущению силы.',
  science_topic2_title: 'Кортизол и стресс', science_topic2_stat: '↓ Кортизол',
  science_topic2_desc: 'Контролируемое воздействие холода тренирует ось HPA. Тело учится регулировать реакцию на стресс более эффективно.',
  science_topic3_title: 'Дофамин и мотивация', science_topic3_stat: '+250%',
  science_topic3_desc: 'Резкий рост уровня дофамина после холодного погружения — похожий на интенсивные упражнения, но более продолжительный.',
  science_topic4_title: 'Иммунитет и воспаление', science_topic4_stat: '↓ IL-6',
  science_topic4_desc: 'Исследования показывают снижение воспалительных маркеров и улучшение иммунной функции при регулярном воздействии холодной воды.',
  science_studies_title: 'Ключевые исследования', science_topics_title: 'Научные темы',
  science_book_cta: 'Забронируйте место — испытайте сами',
  science_stat1_sub: 'погружение при 5°C', science_stat2_sub: 'после погружения',
  science_stat3_val: '↓ Кортизол', science_stat3_label: 'Стресс', science_stat3_sub: 'повторное воздействие',
  science_stat4_label: '↓ IL-6', science_stat4_sub: 'маркеры воспаления',
  science_topics_sub: 'Нажмите на тему для подробного чтения со ссылками',
  science_read_more: 'Читать далее', science_coming_soon: 'Скоро',
  science_cta_title: 'Хотите испытать науку на себе?',
  science_cta_sub: 'Присоединитесь к управляемому погружению и почувствуйте эффекты',
  science_topic5_title: 'Сжигание бурого жира', science_topic5_desc: 'Активация бурой жировой ткани (BAT) и усиление сжигания калорий.',
  science_topic6_title: 'Блуждающая нервная система', science_topic6_desc: 'Укрепление блуждающего нерва, улучшение саморегуляции и восстановления после стресса.',

  booking_title: 'Забронировать опыт', booking_sub: 'Выберите тип активности, который вам подходит',
  booking_tab_immersions: 'Погружения', booking_tab_workshops: 'Воркшопы',
  booking_step_type: 'Выбрать воркшоп', booking_step_date: 'Выбрать дату', booking_step_payment: 'Детали и оплата',
  booking_choose_workshop: 'Выбрать воркшоп ›', booking_choose_package: 'Выбрать пакет ›',
  booking_choose_immersion: '🧊 Забронировать погружение', booking_loading: 'Загрузка...',
  booking_immersions_desc: 'Выберите даты для погружений в ледяную воду',
  booking_workshops_desc: 'Выберите из различных типов воркшопов',

  instructors_title: 'Наша команда', instructors_sub: 'Сертифицированные инструкторы CWI с опытом и знаниями',
  instructors_cert_title: '🎓 Сертификат CWI Instructor',
  instructors_cert_desc: 'Все наши инструкторы прошли комплексную подготовку по протоколам холодного погружения, безопасности и анатомии.',
  instructors_theory: 'Медицинская теория', instructors_practice: 'Практическая подготовка', instructors_exam: 'Финальный экзамен',
  instructors_contact_cta: 'Хотите узнать о курсах инструкторов CWI? Свяжитесь с нами',
  instructors_book_cta: 'Забронируйте воркшоп с нашей командой',
  instructors_theory_desc: 'Реакция на холодовой шок, терморегуляция, гормезис, протоколы безопасности',
  instructors_practice_desc: 'Инструктаж группы, управление рисками, экстренная помощь',
  instructors_exam_desc: 'Финальные экзамены и стажировка как требования сертификации',

  reviews_title: 'Что говорят участники?', reviews_sub: 'Реальный опыт людей, прошедших погружение',
  reviews_stat1_label: 'Удовлетворённость', reviews_stat2_label: 'Участники', reviews_stat3_label: 'Средний рейтинг', reviews_stat4_label: 'Возвращаются снова',
  reviews_share_title: 'Поделитесь своим опытом',
  reviews_type_individual: 'Индивидуальный воркшоп', reviews_type_couple: 'Воркшоп для пар',
  reviews_type_group: 'Групповой воркшоп', reviews_type_immersion: 'Личное погружение',

  payment_title: 'Выберите способ оплаты', payment_amount: 'Сумма к оплате', payment_back: '← Вернуться к бронированию',
  payment_credit: 'Оплата картой', payment_bit: 'Оплата Bit',
  payment_paybox: 'Оплата Paybox', payment_phone: 'Оплата по телефону', payment_secured: 'Защищено через Tranzila',
  payment_bit_desc: 'Быстрый перевод через Bit', payment_paybox_desc: 'Быстрый перевод через Paybox',
  failed_title: 'Платёж не прошёл', failed_desc: 'К сожалению, обработка платежа не удалась. Попробуйте снова или свяжитесь с нами:',
  failed_retry: 'Попробовать снова', failed_call: 'Позвонить нам',

  checkout_step1: 'Обзор заказа', checkout_step2: 'Вход / Регистрация', checkout_step3: 'Данные участников',
  checkout_step4: 'Медзаявление', checkout_step5: 'Выбор оплаты', checkout_step6: 'Бронирование подтверждено!',
  checkout_of5: 'Шаг {n} из 5', checkout_loading: 'Загрузка...', checkout_continue: 'Перейти к покупке ›',
  checkout_next: 'Продолжить ›', checkout_saving: 'Сохранение...',
  checkout_name_ph: 'Полное имя', checkout_phone_ph: 'Мобильный телефон', checkout_city_ph: 'Город',
  checkout_participants_label: 'Количество участников', checkout_back: '← Назад к предыдущему шагу', checkout_back_payment: '← Назад к выбору оплаты',
  checkout_credit: '💳 Кредитная карта', checkout_credit_secured: 'Защищено Tranzila',
  checkout_unavailable: 'Этот способ оплаты временно недоступен, но не беспокойтесь! Ваше место будет сохранено.',
  checkout_reserve: 'Зарезервировать место ✓',
  checkout_bit_quick: 'Быстрый перевод прямо сейчас', checkout_bit_title: 'Оплата через Bit', checkout_bit_direct: 'Прямой перевод',
  checkout_amount: 'Сумма к оплате', checkout_bit_number_label: 'Номер Bit для оплаты', checkout_bit_steps: 'Шаги оплаты:',
  checkout_bit_step1: '1. Откройте приложение Bit', checkout_bit_step3: '3. Вернитесь и нажмите "Оплатил" ↓',
  checkout_bit_opened: 'Открыл Bit — перехожу к оплате ›', checkout_bit_wait: '⏳ После перевода через Bit нажмите ниже',
  checkout_bit_paid: 'Оплатил через Bit ✓', checkout_bit_not_yet: 'Ещё не оплатил — к инструкции',
  checkout_paybox_digital: 'Цифровая оплата',
  checkout_phone_callback: 'Оплата по телефону', checkout_phone_desc: 'Мы свяжемся для завершения бронирования',
  checkout_phone_sent: 'Заявка отправлена!', checkout_phone_email_ph: 'Email (для подтверждения)',
  checkout_hours_any: 'В любое время', checkout_hours_any_label: 'В какое время удобно?',
  checkout_hours_morning: 'Утром 08:00–12:00', checkout_hours_noon: 'Днём 12:00–16:00', checkout_hours_afternoon: 'Вечером 16:00–20:00',
  checkout_phone_send: 'Отправить заявку ›', checkout_phone_24h: 'Свяжемся в течение 24 часов',
  checkout_confirmed_credit: 'Оплата получена. Подтверждение отправлено на email.',
  checkout_confirmed_bit: 'Подтверждение получено. Проверим в течение 24 часов.',
  checkout_confirmed_phone: 'Свяжемся в течение 24 часов для завершения оплаты.',
  checkout_confirm_code: 'Код подтверждения', checkout_home: 'На главную',
  checkout_science_link: '🔬 Наука о холодном погружении', checkout_my_bookings: '📋 Мои бронирования',

  health_before: 'Требуется перед каждым занятием. Отметьте применимые пункты.',
  health_condition: 'У меня заболевание сердца', health_pregnant: 'Я беременна',
  health_raynauds: 'У меня синдром Рейно', health_hypertension: 'У меня высокое давление',
  health_wounds: 'У меня открытые раны', health_full_name: 'Полное имя', health_participant_ph: 'Имя участника',
  health_agree: 'Подтверждаю, что прочитал заявление выше, информация верна, согласен с условиями участия.',
  health_submit: 'Подтвердить заявление ✓', health_skip: 'Пропустить', health_saving: 'Сохранение...',
  health_confirm_required: 'Необходимо подтвердить заявление', health_name_required: 'Введите имя участника',

  hc_title: 'Ежедневное медзаявление', hc_hello: 'Привет {name}', hc_before: 'Перед каждым погружением подтвердите:',
  hc_healthy: 'Сегодня чувствую себя здоровым', hc_no_fever: 'Нет температуры (ниже 37.5°C)',
  hc_feeling_good: 'Чувствую себя хорошо и готов к погружению',
  hc_submit: '✅ Подтверждаю — поехали!', hc_sending: 'Отправка...',
  hc_warning: 'Если нехорошо себя чувствуете, воздержитесь и свяжитесь с командой',
  hc_done_title: 'Медзаявление подано', hc_done_sub: 'Спасибо {name}! Вы готовы к погружению.',
  hc_back_dashboard: 'Вернуться в кабинет',

  dash_hello: 'Привет {name}! 👋', dash_role_admin: '👑 Администратор', dash_role_instructor: '🏊 Инструктор',
  dash_personal_area: 'Личный кабинет', dash_health_alert: '⚠️ Заполните медзаявление',
  dash_health_done: '✅ Медзаявление заполнено', dash_book_btn: '📅 Записаться',
  dash_stat_week: 'Последняя неделя', dash_stat_total_time: 'Всего времени', dash_stat_total: 'Всего погружений',
  dash_tab_bookings: '📋 Бронирования', dash_tab_journal: '📖 Журнал', dash_tab_clients: '👥 Клиенты',
  dash_bookings_title: '📋 Мои бронирования', dash_journal_title: '📖 Журнал погружений',
  dash_future_title: '📅 Предстоящие', dash_future_desc: 'Для записи на погружение или воркшоп:',
  dash_future_btn: '📅 Записаться', dash_loading: 'Загрузка...', dash_no_bookings: 'Нет бронирований',
  dash_paid_label: 'Оплачено', dash_pending_label: 'Ожидает', dash_total_bookings: 'Всего',
  dash_col_type: 'Тип', dash_col_event: 'Событие', dash_col_date: 'Дата',
  dash_col_status: 'Статус', dash_col_payment: 'Оплата', dash_col_amount: 'Сумма', dash_col_code: 'Код', dash_col_health: 'Здоровье',
  dash_status_confirmed: 'Подтверждено', dash_status_pending: 'Ожидает', dash_status_cancelled: 'Отменено',
  dash_pay_paid: '✅ Оплачено', dash_pay_unpaid: '⏳ Не оплачено', dash_pay_refunded: '↩ Возвращено',
  dash_no_sessions: 'Погружений пока нет', dash_clients_title: 'Клиенты',
  dash_no_clients: 'Клиентов ещё нет',
  dash_health_filled_today: '✅ Медзаявление заполнено', dash_health_not_filled: '⚠️ Медзаявление не заполнено',
  dash_health_checked: '✓ Заполнено', dash_health_not_checked: '⚠ Нет',
  dash_back_list: '▶ К списку', dash_add_session: 'Добавить погружение',
  dash_add_session_btn: '+ Добавить', dash_add_open: '+ Добавить',
  dash_close_form: 'Закрыть', dash_close: 'Закрыть',
  dash_session_date: 'Дата', dash_session_time: 'Время', dash_session_status: 'Статус',
  dash_session_temp: 'Температура', dash_session_duration: 'Длительность', dash_session_instructor: 'Инструктор',
  dash_session_done: 'Выполнено', dash_session_planned: 'Запланировано', dash_session_cancelled: 'Отменено',
  dash_form_date: 'Дата', dash_form_time: 'Время', dash_form_temp: 'Температура (°C)',
  dash_form_duration: 'Длительность (мин) *', dash_form_status: 'Статус', dash_form_photo: 'Фото (URL)',
  dash_form_instructor: 'Инструктор', dash_form_visitor_notes: 'Заметки участника', dash_form_instructor_notes: 'Заметки инструктора',
  dash_form_save: '+ Добавить', dash_form_saving: 'Сохранение...',
  dash_planned: 'Запланировано', dash_done: 'Выполнено', dash_cancelled: 'Отменено',

  journal_title: '📖 Журнал погружений', journal_add_title: '+ Добавить', journal_schedule_title: '📅 Запланировать',
  journal_upcoming: '📅 Предстоящие',
  journal_date: 'Дата', journal_time: 'Время', journal_duration: 'Длительность (мин)', journal_temp: 'Средняя температура (°C)',
  journal_instructor: 'Инструктор', journal_notes: 'Заметки (необязательно)',
  journal_notes_ph: 'Чувствовал себя отлично, лёгкое головокружение...',
  journal_duration_future: 'Обновится после погружения', journal_save: '💾 Сохранить',
  journal_save_future: '📅 Сохранить дату', journal_duration_required: 'Введите длительность',
  journal_no_sessions: 'Погружений пока нет', journal_no_sessions_sub: 'Добавьте первое погружение выше',
  journal_col_date: 'Дата', journal_col_temp: 'Темп.', journal_col_duration: 'Длит.',
  journal_col_instructor: 'Инструктор', journal_col_notes: 'Заметки',
  journal_stat_cur_week: 'Эта неделя', journal_stat_prev_week: 'Прошлая неделя',
  journal_stat_avg_temp: 'Средняя температура', journal_stat_total: 'Всего погружений',
  journal_minutes: 'мин', journal_upd_same: 'Как на прошлой неделе', journal_upd_sub: 'Всего минут',
  journal_cur_week: 'Эта неделя', journal_all_time: 'Всё время',

  immersion_hero_title: 'Записаться на погружение', immersion_hero_sub: 'С сертифицированным инструктором · Реховот',
  immersion_loading_slots: 'Загрузка слотов...', immersion_prev_month: 'Предыдущий месяц', immersion_next_month: 'Следующий месяц',
  immersion_legend_free: 'Свободно', immersion_legend_selected: 'Выбрано', immersion_legend_none: 'Нет слотов',
  immersion_slot_free: 'Свободно', immersion_slot_taken: 'Занято', immersion_no_slots_date: 'Нет доступных слотов на эту дату.',
  immersion_step1: 'Выберите дату', immersion_step2: 'Выберите время', immersion_step3: 'Выберите пакет', immersion_step4: 'Итого и переход к оплате',
  immersion_summary_title: 'Итого заказа', immersion_summary_date: 'Дата', immersion_summary_time: 'Время',
  immersion_summary_pkg: 'Пакет', immersion_summary_total: 'Итого к оплате', immersion_proceed_btn: 'Продолжить к деталям и оплате →',
  immersion_error_no_slot: 'Пожалуйста, выберите время', immersion_error_submit: 'Ошибка регистрации',
  immersion_done_title: 'Регистрация подтверждена!', immersion_done_sub: '{name}, вы зарегистрированы.', immersion_home_btn: 'На главную',
  immersion_sessions_unit: 'сеансов', immersion_pkg_savings: 'Экономия ₪50', immersion_pkg_unlimited: '∞ Безлимит',
  immersion_pkg_single_title: 'Одно погружение',
  immersion_pkg_single_desc: 'Погружение в ледяную ванну с сертифицированным инструктором. В безопасной обстановке, до десяти минут, под профессиональным наблюдением.',
  immersion_pkg_5pack_title: 'Пакет 5 погружений',
  immersion_pkg_5pack_desc: '5 погружений с профессиональным инструктором. Каждое занятие планируется отдельно по доступному расписанию.',
  immersion_pkg_10pack_title: 'Пакет 10 погружений',
  immersion_pkg_10pack_desc: '10 погружений с профессиональным инструктором. Рекомендуемый пакет для реального прогресса.',
  immersion_pkg_monthly_title: 'Месячный абонемент',
  immersion_pkg_monthly_desc: 'Свободный доступ ко всем погружениям в течение одного календарного месяца. Неограниченное количество сеансов.',

  bsuccess_loading: 'Загрузка данных заказа...', bsuccess_title: 'Бронирование подтверждено!',
  bsuccess_paid_sub: 'Оплата получена. Подтверждение отправлено на ваш email.',
  bsuccess_pending_sub: 'Заказ принят. Подтверждение отправлено на ваш email.',
  bsuccess_code_label: 'Ваш код подтверждения', bsuccess_code_save: 'Сохраните этот код для входа на семинар',
  bsuccess_details_title: 'Детали семинара', bsuccess_workshop_col: 'Семинар', bsuccess_datetime_col: 'Дата и время',
  bsuccess_instructor_col: 'Инструктор', bsuccess_participants_col: 'Участники', bsuccess_total_col: 'Итого',
  bsuccess_bring_title: 'Что взять на семинар?',
  bsuccess_bring1: 'Купальник или облегающая спортивная одежда', bsuccess_bring2: 'Большое тёплое полотенце',
  bsuccess_bring3: 'Тёплая одежда для переодевания после семинара', bsuccess_bring4: 'Горячий напиток в термосе (по желанию)',
  bsuccess_bring5: 'Прийти за 10 минут до начала семинара',
  bsuccess_location_title: 'Местоположение', bsuccess_address: 'ул. Сирени 52, Реховот',
  bsuccess_complex: 'Комплекс терапевтического бассейна', bsuccess_waze: 'Навигация через Waze', bsuccess_gmaps: 'Google Maps',
  bsuccess_load_error: 'Не удалось загрузить данные заказа', bsuccess_check_email: 'Проверьте email для подтверждения заказа',
  bsuccess_book_another: 'Забронировать ещё один семинар', bsuccess_home: 'На главную',

  csuccess_paid_title: 'Оплата получена!', csuccess_pending_title: 'Заказ зарегистрирован',
  csuccess_paid_desc: 'Спасибо! Подтверждение будет отправлено на ваш email.',
  csuccess_pending_desc: 'Мы получили ваши данные. Свяжемся с вами для окончательного подтверждения.',
  csuccess_order_num: 'Номер заказа', csuccess_home: 'На главную', csuccess_book_more: 'Записаться на ещё одно погружение',

  checkout_error_load_ws: 'Ошибка загрузки семинара', checkout_error_load_slot: 'Ошибка загрузки слота',
  checkout_error_draft: 'Ошибка создания заказа', checkout_error_network: 'Ошибка сети — попробуйте снова',
  checkout_error_fill: 'Пожалуйста, заполните имя и телефон', checkout_error_confirm: 'Ошибка подтверждения оплаты',
  checkout_error_phone_req: 'Ошибка отправки запроса',
  checkout_callback_by: 'Мы перезвоним вам {deadline}', checkout_bit_step2: 'Отправьте ₪{amount} на номер',

  contact_name_ph: 'Иван Иванов', contact_message_ph: 'Напишите ваше сообщение здесь...',
  contact_phone_label: 'Телефон', contact_address_info: 'ул. Сирени 52, Реховот',

  science_title_line1: 'Наука о', science_title_line2: 'холодном погружении',
};

export const translations: Record<Lang, Translations> = { he, en, ar, ru };

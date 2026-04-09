# Write Social Media Post

כתוב פוסט מלא לפי idea_id ופלטפורמה.

**קלט:** $ARGUMENTS — `<idea_id> <platform>`
דוגמה: `uuid-here instagram_reel`

**שלבים:**
1. שלוף רעיון מ-content_ideas
2. קרא templates/{platform}.md
3. הפעל writer-agent
4. הפעל brand-check-agent
5. אם pass → שמור ב-social_posts status='draft'
6. אם fail → תקן אוטומטית וחזור לשלב 4
7. הצג פוסט מוכן ושאל: "לאשר? (כן / ערוך / בטל)"

# Approve Post

**קלט:** $ARGUMENTS — post_id

**שלבים:**
1. שלוף פוסט לפי post_id
2. הצג:
   - platform, hook, caption מלא, hashtags, visual_direction
3. שאל: "לאשר? (כן / ערוך / בטל)"
4. כן → status='approved', approved_by_human=true
5. ערוך → קבל תיקון, עדכן draft_caption, חזור לשלב 2
6. בטל → status='rejected'

**זכור:** אין פרסום אוטומטי — רק סימון "מוכן לפרסום ידני"

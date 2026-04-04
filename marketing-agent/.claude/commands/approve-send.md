# Approve and Mark Ready

סמן ליד $ARGUMENTS כמאושר לשליחה.

1. קרא draft_message
2. הצג את ההודעה
3. שאל: "לאשר שליחה? (כן/לא/ערוך)"
4. אם אישרת:
   - approved_by_human = true
   - status = 'approved'
   - הוסף activity 'approval'

לא שולח בפועל — שליחה דרך ממשק האפליקציה בלבד.

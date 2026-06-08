export default function AuthorSignature() {
  return (
    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 my-8 max-w-2xl mx-auto">
      <div className="text-3xl flex-shrink-0">🩺</div>
      <div>
        <p className="font-black text-navy-900 text-base">ליאור כ&quot;ץ</p>
        <p className="text-slate-600 text-sm leading-snug">
          פיזיותרפיסט מוסמך משרד הבריאות מ-2001
          <span className="mx-1 text-slate-300">·</span>
          מדריך קורס הדרכת טבילות במי קרח ונשימה
        </p>
      </div>
    </div>
  );
}

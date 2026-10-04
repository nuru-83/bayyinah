# Security

قبل جعل المستودع عامًا:

- لا ترفع API keys أو OAuth secrets أو tokens.
- لا ترفع `.env` حقيقيًا.
- لا ترفع reviewer Telegram IDs أو بيانات مستخدمين.
- لا ترفع Google Drive/Sheets identifiers الخاصة إذا لم تكن ضرورية للعامة.
- استخدم n8n Credentials.
- راجع أي Workflow export جديد قبل commit.
- إذا ظهر مفتاح في screenshot أو Git history فدوّره؛ حذف الملف لاحقًا لا يعيد السرية.

الـWorkflow المرفق هنا منقح للمراجعة، لكنه baseline قديم وليس export نهائيًا للـlive workflow بعد هجرة Jina.

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type LanguageCode = 'en' | 'ar' | 'fa';

export interface AppTranslations {
  dir: 'ltr' | 'rtl';
  languageNameSelf: string; // Name of the language in itself (e.g., English, العربية, فارسی)
  langNames: Record<LanguageCode, string>; // Names of all supported languages, translated into this language

  editorTitlePlaceholder: string;
  
  buttons: {
    selectLanguage: string;
    toggleTheme: string;
    switchPromptMode: string;
    toggleQA: string;
    closeQA: string;
    startRecording: string;
    stopRecording: string;
    uploadAudio: string;
    newMeeting: string;
    downloadAll: string;
    copyTranscription: string;
    downloadTranscriptionMd: string;
    downloadTranscriptionTxt: string;
    copySummary: string;
    downloadSummaryMd: string;
    downloadSummaryTxt: string;
    copyTasks: string;
    downloadTasksMd: string;
    downloadTasksTxt: string;
    copySentiment: string;
    downloadSentimentMd: string;
    downloadSentimentTxt: string;
    sendQuestion: string;
  };

  promptModes: {
    fast: string;
    smart: string;
  };

  tabs: {
    transcription: string;
    summary: string;
    tasks: string;
    sentiment: string;
  };
  
  liveRecording: {
    titleDefault: string; // e.g. "New Recording" when title is placeholder
    titleRecording: string; // e.g. "Recording"
  };

  statusMessages: {
    ready: string;
    micRequest: string;
    processingAudio: string;
    processingUploadedFile: string;
    convertingAudio: string;
    generatingSummary: string;
    summaryGenerated: string;
    extractingActionItems: string;
    actionItemsExtracted: string;
    analyzingSentiment: string;
    sentimentAnalyzed: string;
    processingComplete: string;
    switchedToFast: string;
    switchedToSmart: string;
    transcriptionCopied: string;
    summaryCopied: string;
    tasksCopied: string;
    sentimentCopied: string;
    downloaded: string; // Prefix for "Downloaded [filename]"
    loadedMeeting: string; // Prefix for "Loaded meeting: [title]"

    // Errors
    errorAPIKey: string;
    errorMicPermissionDenied: string;
    errorMicNotFound: string;
    errorMicInUse: string;
    errorUnknown: string; // Generic error prefix
    errorNoAudioCaptured: string;
    errorProcessingAudio: string;
    errorNoAudioData: string;
    errorAudioConversion: string;
    errorTranscriptionFailed: string;
    errorSummaryGeneration: string;
    errorActionItemsExtraction: string;
    errorSentimentAnalysis: string;
    errorAnsweringQuestion: string;
    errorCopyTranscription: string;
    errorCopySummary: string;
    errorCopyTasks: string;
    errorCopySentiment: string;
    errorFindingRecord: string; // Prefix for "Error: Could not find meeting record with ID "
  };
  
  placeholders: {
    default: string;
    transcription: string;
    summary: string;
    tasks: string;
    sentiment: string;
  };

  qaSidebar: {
    title: string;
    historyPlaceholder: string;
    qaMessagesPlaceholder: string; // When context (transcription) is available
    qaMessagesPlaceholderNoContext: string; // When no transcription is loaded
    qaInputPlaceholder: string;
  };
  
  actionItemAssigneePrefix: string; // e.g., "Assignee"
  actionItemNoneIdentified: string;
  actionItemErrorParsing: string;
  actionItemErrorNoResponse: string;

  fileSuffixes: { // For downloaded filenames
    transcription: string;
    summary: string;
    tasks: string;
    sentiment: string;
    meetingExportBase: string; // Default base name for full export if title is empty
    meetingExportPrefix: string; // e.g., "Meeting Export"
    exportedOn: string; // e.g., "Exported on"
  };
}

export type TranslationKey = keyof AppTranslations['buttons'] | keyof AppTranslations['promptModes'] | keyof AppTranslations['tabs'] | keyof AppTranslations['liveRecording'] | keyof AppTranslations['statusMessages'] | keyof AppTranslations['placeholders'] | keyof AppTranslations['qaSidebar'];

export const translations: Record<LanguageCode, AppTranslations> = {
  en: {
    dir: 'ltr',
    languageNameSelf: 'English',
    langNames: { en: 'English', ar: 'Arabic', fa: 'Farsi' },
    editorTitlePlaceholder: 'Untitled Meeting',
    buttons: {
      selectLanguage: 'Select Language',
      toggleTheme: 'Toggle Theme',
      switchPromptMode: 'Switch Prompt Mode (Fast/Smart)',
      toggleQA: 'Toggle Q&A Sidebar',
      closeQA: 'Close Q&A Sidebar',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      uploadAudio: 'Upload Audio File',
      newMeeting: 'New Meeting / Clear',
      downloadAll: 'Download All Content',
      copyTranscription: 'Copy Transcription',
      downloadTranscriptionMd: 'Download as Markdown',
      downloadTranscriptionTxt: 'Download as Text',
      copySummary: 'Copy Summary',
      downloadSummaryMd: 'Download as Markdown',
      downloadSummaryTxt: 'Download as Text',
      copyTasks: 'Copy Tasks',
      downloadTasksMd: 'Download as Markdown',
      downloadTasksTxt: 'Download as Text',
      copySentiment: 'Copy Sentiment Analysis',
      downloadSentimentMd: 'Download as Markdown',
      downloadSentimentTxt: 'Download as Text',
      sendQuestion: 'Send Question',
    },
    promptModes: { fast: 'Fast', smart: 'Smart' },
    tabs: { transcription: 'Transcription', summary: 'Summary', tasks: 'Tasks', sentiment: 'Sentiment' },
    liveRecording: { titleDefault: "New Recording", titleRecording: 'Recording' },
    statusMessages: {
      ready: 'Ready to record or upload',
      micRequest: 'Requesting microphone access...',
      processingAudio: 'Processing audio...',
      processingUploadedFile: 'Processing uploaded file...',
      convertingAudio: 'Converting audio...',
      generatingSummary: 'Generating meeting summary...',
      summaryGenerated: 'Summary generated.',
      extractingActionItems: 'Extracting action items...',
      actionItemsExtracted: 'Action items extracted.',
      analyzingSentiment: 'Analyzing sentiment...',
      sentimentAnalyzed: 'Sentiment analysis complete.',
      processingComplete: 'Processing complete. Ready for next task.',
      switchedToFast: 'Switched to Fast prompts',
      switchedToSmart: 'Switched to Smart prompts',
      transcriptionCopied: 'Transcription copied!',
      summaryCopied: 'Summary copied!',
      tasksCopied: 'Tasks copied!',
      sentimentCopied: 'Sentiment analysis copied!',
      downloaded: 'Downloaded',
      loadedMeeting: 'Loaded meeting',
      errorAPIKey: 'Initialization Error: API_KEY environment variable not set. App cannot function.',
      errorMicPermissionDenied: 'Microphone permission denied. Check browser settings.',
      errorMicNotFound: 'No microphone found. Please connect a microphone.',
      errorMicInUse: 'Cannot access microphone. It may be in use or another error occurred.',
      errorUnknown: 'An unknown error occurred',
      errorNoAudioCaptured: 'No audio data captured. Please try again.',
      errorProcessingAudio: 'Error processing audio',
      errorNoAudioData: 'No audio data. Please try again.',
      errorAudioConversion: 'Failed to convert audio to base64',
      errorTranscriptionFailed: 'Transcription failed or returned empty. Cannot proceed.',
      errorSummaryGeneration: 'Could not generate summary.',
      errorActionItemsExtraction: 'Could not extract action items.',
      errorSentimentAnalysis: 'Could not generate sentiment analysis.',
      errorAnsweringQuestion: 'Sorry, I encountered an error trying to answer your question.',
      errorCopyTranscription: 'Failed to copy transcription.',
      errorCopySummary: 'Failed to copy summary.',
      errorCopyTasks: 'Failed to copy tasks.',
      errorCopySentiment: 'Failed to copy sentiment analysis.',
      errorFindingRecord: 'Error: Could not find meeting record with ID',
    },
    placeholders: {
      default: 'Content will appear here...',
      transcription: 'Full transcription with speaker labels will appear here...',
      summary: 'Meeting summary will appear here...',
      tasks: 'Action items will appear here...',
      sentiment: 'Sentiment analysis will appear here...',
    },
    qaSidebar: {
      title: 'Meeting Q&A',
      historyPlaceholder: 'No past meetings found.',
      qaMessagesPlaceholder: 'Ask a question about the current meeting...',
      qaMessagesPlaceholderNoContext: 'Process, record, or load a meeting to enable Q&A.',
      qaInputPlaceholder: 'Type your question...',
    },
    actionItemAssigneePrefix: 'Assignee',
    actionItemNoneIdentified: 'No specific action items identified.',
    actionItemErrorParsing: 'Could not parse action items correctly from response.',
    actionItemErrorNoResponse: 'No action items response from AI.',
    fileSuffixes: {
      transcription: 'transcription',
      summary: 'summary',
      tasks: 'tasks',
      sentiment: 'sentiment',
      meetingExportBase: 'meeting_export',
      meetingExportPrefix: 'Meeting Export',
      exportedOn: 'Exported on'
    }
  },
  ar: {
    dir: 'rtl',
    languageNameSelf: 'العربية',
    langNames: { en: 'الإنجليزية', ar: 'العربية', fa: 'الفارسية' },
    editorTitlePlaceholder: 'اجتماع بدون عنوان',
    buttons: {
      selectLanguage: 'اختر اللغة',
      toggleTheme: 'تبديل السمة',
      switchPromptMode: 'تبديل وضع الأوامر (سريع/ذكي)',
      toggleQA: 'تبديل الشريط الجانبي للأسئلة والأجوبة',
      closeQA: 'إغلاق الشريط الجانبي للأسئلة والأجوبة',
      startRecording: 'بدء التسجيل',
      stopRecording: 'إيقاف التسجيل',
      uploadAudio: 'رفع ملف صوتي',
      newMeeting: 'اجتماع جديد / مسح',
      downloadAll: 'تنزيل الكل',
      copyTranscription: 'نسخ النص',
      downloadTranscriptionMd: 'تنزيل كـ Markdown',
      downloadTranscriptionTxt: 'تنزيل كنص',
      copySummary: 'نسخ الملخص',
      downloadSummaryMd: 'تنزيل الملخص كـ Markdown',
      downloadSummaryTxt: 'تنزيل الملخص كنص',
      copyTasks: 'نسخ المهام',
      downloadTasksMd: 'تنزيل المهام كـ Markdown',
      downloadTasksTxt: 'تنزيل المهام كنص',
      copySentiment: 'نسخ تحليل المشاعر',
      downloadSentimentMd: 'تنزيل تحليل المشاعر كـ Markdown',
      downloadSentimentTxt: 'تنزيل تحليل المشاعر كنص',
      sendQuestion: 'إرسال السؤال',
    },
    promptModes: { fast: 'سريع', smart: 'ذكي' },
    tabs: { transcription: 'النص', summary: 'الملخص', tasks: 'المهام', sentiment: 'المشاعر' },
    liveRecording: { titleDefault: "تسجيل جديد", titleRecording: 'جاري التسجيل' },
    statusMessages: {
      ready: 'جاهز للتسجيل أو الرفع',
      micRequest: 'جاري طلب الوصول إلى الميكروفون...',
      processingAudio: 'جاري معالجة الصوت...',
      processingUploadedFile: 'جاري معالجة الملف المرفوع...',
      convertingAudio: 'جاري تحويل الصوت...',
      generatingSummary: 'جاري إنشاء ملخص الاجتماع...',
      summaryGenerated: 'تم إنشاء الملخص.',
      extractingActionItems: 'جاري استخراج البنود القابلة للتنفيذ...',
      actionItemsExtracted: 'تم استخراج البنود القابلة للتنفيذ.',
      analyzingSentiment: 'جاري تحليل المشاعر...',
      sentimentAnalyzed: 'اكتمل تحليل المشاعر.',
      processingComplete: 'اكتملت المعالجة. جاهز للمهمة التالية.',
      switchedToFast: 'تم التبديل إلى الأوامر السريعة',
      switchedToSmart: 'تم التبديل إلى الأوامر الذكية',
      transcriptionCopied: 'تم نسخ النص!',
      summaryCopied: 'تم نسخ الملخص!',
      tasksCopied: 'تم نسخ المهام!',
      sentimentCopied: 'تم نسخ تحليل المشاعر!',
      downloaded: 'تم تنزيل',
      loadedMeeting: 'تم تحميل الاجتماع',
      errorAPIKey: 'خطأ في التهيئة: متغير البيئة API_KEY غير مضبوط. لا يمكن للتطبيق العمل.',
      errorMicPermissionDenied: 'تم رفض إذن الميكروفون. تحقق من إعدادات المتصفح.',
      errorMicNotFound: 'لم يتم العثور على ميكروفون. يرجى توصيل ميكروفون.',
      errorMicInUse: 'لا يمكن الوصول إلى الميكروفون. قد يكون قيد الاستخدام أو حدث خطأ آخر.',
      errorUnknown: 'حدث خطأ غير معروف',
      errorNoAudioCaptured: 'لم يتم التقاط بيانات صوتية. يرجى المحاولة مرة أخرى.',
      errorProcessingAudio: 'خطأ في معالجة الصوت',
      errorNoAudioData: 'لا توجد بيانات صوتية. يرجى المحاولة مرة أخرى.',
      errorAudioConversion: 'فشل تحويل الصوت إلى base64',
      errorTranscriptionFailed: 'فشل النسخ أو أرجع فارغًا. لا يمكن المتابعة.',
      errorSummaryGeneration: 'تعذر إنشاء الملخص.',
      errorActionItemsExtraction: 'تعذر استخراج البنود القابلة للتنفيذ.',
      errorSentimentAnalysis: 'تعذر إنشاء تحليل المشاعر.',
      errorAnsweringQuestion: 'عذرًا، واجهت خطأ أثناء محاولة الإجابة على سؤالك.',
      errorCopyTranscription: 'فشل نسخ النص.',
      errorCopySummary: 'فشل نسخ الملخص.',
      errorCopyTasks: 'فشل نسخ المهام.',
      errorCopySentiment: 'فشل نسخ تحليل المشاعر.',
      errorFindingRecord: 'خطأ: تعذر العثور على سجل الاجتماع بالمعرف',
    },
    placeholders: {
      default: 'سيظهر المحتوى هنا...',
      transcription: 'سيظهر هنا النص الكامل مع تسميات المتحدثين...',
      summary: 'سيظهر ملخص الاجتماع هنا...',
      tasks: 'ستظهر هنا البنود القابلة للتنفيذ...',
      sentiment: 'سيظهر تحليل المشاعر هنا...',
    },
    qaSidebar: {
      title: 'سؤال وجواب الاجتماع',
      historyPlaceholder: 'لم يتم العثور على اجتماعات سابقة.',
      qaMessagesPlaceholder: 'اطرح سؤالاً حول الاجتماع الحالي...',
      qaMessagesPlaceholderNoContext: 'قم بمعالجة أو تسجيل أو تحميل اجتماع لتمكين قسم الأسئلة والأجوبة.',
      qaInputPlaceholder: 'اكتب سؤالك...',
    },
    actionItemAssigneePrefix: 'المكلف',
    actionItemNoneIdentified: 'لم يتم تحديد أي بنود قابلة للتنفيذ.',
    actionItemErrorParsing: 'تعذر تحليل البنود القابلة للتنفيذ بشكل صحيح من الاستجابة.',
    actionItemErrorNoResponse: 'لا توجد استجابة للبنود القابلة للتنفيذ من الذكاء الاصطناعي.',
    fileSuffixes: {
      transcription: 'النص',
      summary: 'الملخص',
      tasks: 'المهام',
      sentiment: 'المشاعر',
      meetingExportBase: 'تصدير_الاجتماع',
      meetingExportPrefix: 'تصدير الاجتماع',
      exportedOn: 'تم التصدير في'
    }
  },
  fa: {
    dir: 'rtl',
    languageNameSelf: 'فارسی',
    langNames: { en: 'انگلیسی', ar: 'عربی', fa: 'فارسی' },
    editorTitlePlaceholder: 'جلسه بدون عنوان',
    buttons: {
      selectLanguage: 'انتخاب زبان',
      toggleTheme: 'تغییر پوسته',
      switchPromptMode: 'تغییر حالت دستور (سریع/هوشمند)',
      toggleQA: 'تغییر نوار کناری پرسش و پاسخ',
      closeQA: 'بستن نوار کناری پرسش و پاسخ',
      startRecording: 'شروع ضبط',
      stopRecording: 'توقف ضبط',
      uploadAudio: 'بارگذاری فایل صوتی',
      newMeeting: 'جلسه جدید / پاک کردن',
      downloadAll: 'دانلود همه',
      copyTranscription: 'کپی رونویسی',
      downloadTranscriptionMd: 'دانلود به عنوان Markdown',
      downloadTranscriptionTxt: 'دانلود به عنوان متن',
      copySummary: 'کپی خلاصه',
      downloadSummaryMd: 'دانلود خلاصه به عنوان Markdown',
      downloadSummaryTxt: 'دانلود خلاصه به عنوان متن',
      copyTasks: 'کپی وظایف',
      downloadTasksMd: 'دانلود وظایف به عنوان Markdown',
      downloadTasksTxt: 'دانلود وظایف به عنوان متن',
      copySentiment: 'کپی تحلیل احساسات',
      downloadSentimentMd: 'دانلود تحلیل احساسات به عنوان Markdown',
      downloadSentimentTxt: 'دانلود تحلیل احساسات به عنوان متن',
      sendQuestion: 'ارسال سوال',
    },
    promptModes: { fast: 'سریع', smart: 'هوشمند' },
    tabs: { transcription: 'رونویسی', summary: 'خلاصه', tasks: 'وظایف', sentiment: 'احساسات' },
    liveRecording: { titleDefault: "ضبط جدید", titleRecording: 'در حال ضبط' },
    statusMessages: {
      ready: 'آماده ضبط یا بارگذاری',
      micRequest: 'درخواست دسترسی به میکروفون...',
      processingAudio: 'در حال پردازش صدا...',
      processingUploadedFile: 'در حال پردازش فایل بارگذاری شده...',
      convertingAudio: 'در حال تبدیل صدا...',
      generatingSummary: 'در حال ایجاد خلاصه جلسه...',
      summaryGenerated: 'خلاصه ایجاد شد.',
      extractingActionItems: 'در حال استخراج موارد اقدام...',
      actionItemsExtracted: 'موارد اقدام استخراج شد.',
      analyzingSentiment: 'در حال تحلیل احساسات...',
      sentimentAnalyzed: 'تحلیل احساسات کامل شد.',
      processingComplete: 'پردازش کامل شد. آماده برای کار بعدی.',
      switchedToFast: 'به دستورات سریع تغییر یافت',
      switchedToSmart: 'به دستورات هوشمند تغییر یافت',
      transcriptionCopied: 'رونویسی کپی شد!',
      summaryCopied: 'خلاصه کپی شد!',
      tasksCopied: 'وظایف کپی شد!',
      sentimentCopied: 'تحلیل احساسات کپی شد!',
      downloaded: 'دانلود شد',
      loadedMeeting: 'جلسه بارگذاری شد',
      errorAPIKey: 'خطا در مقداردهی اولیه: متغیر محیطی API_KEY تنظیم نشده است. برنامه نمی‌تواند کار کند.',
      errorMicPermissionDenied: 'اجازه دسترسی به میکروفون رد شد. تنظیمات مرورگر را بررسی کنید.',
      errorMicNotFound: 'میکروفونی یافت نشد. لطفاً یک میکروفون وصل کنید.',
      errorMicInUse: 'دسترسی به میکروفون امکان‌پذیر نیست. ممکن است در حال استفاده باشد یا خطای دیگری رخ داده باشد.',
      errorUnknown: 'یک خطای ناشناخته رخ داد',
      errorNoAudioCaptured: 'داده صوتی ضبط نشد. لطفاً دوباره تلاش کنید.',
      errorProcessingAudio: 'خطا در پردازش صدا',
      errorNoAudioData: 'داده صوتی وجود ندارد. لطفاً دوباره تلاش کنید.',
      errorAudioConversion: 'تبدیل صدا به base64 ناموفق بود',
      errorTranscriptionFailed: 'رونویسی ناموفق بود یا خالی بازگردانده شد. امکان ادامه وجود ندارد.',
      errorSummaryGeneration: 'ایجاد خلاصه امکان‌پذیر نبود.',
      errorActionItemsExtraction: 'استخراج موارد اقدام امکان‌پذیر نبود.',
      errorSentimentAnalysis: 'ایجاد تحلیل احساسات امکان‌پذیر نبود.',
      errorAnsweringQuestion: 'متأسفانه در تلاش برای پاسخ به سوال شما با خطا مواجه شدم.',
      errorCopyTranscription: 'کپی رونویسی ناموفق بود.',
      errorCopySummary: 'کپی خلاصه ناموفق بود.',
      errorCopyTasks: 'کپی وظایف ناموفق بود.',
      errorCopySentiment: 'کپی تحلیل احساسات ناموفق بود.',
      errorFindingRecord: 'خطا: رکورد جلسه با شناسه یافت نشد',
    },
    placeholders: {
      default: 'محتوا در اینجا ظاهر خواهد شد...',
      transcription: 'رونویسی کامل با برچسب‌های سخنران در اینجا ظاهر می‌شود...',
      summary: 'خلاصه جلسه در اینجا ظاهر می‌شود...',
      tasks: 'موارد اقدام در اینجا ظاهر می‌شوند...',
      sentiment: 'تحلیل احساسات در اینجا ظاهر می‌شود...',
    },
    qaSidebar: {
      title: 'پرسش و پاسخ جلسه',
      historyPlaceholder: 'جلسات گذشته یافت نشد.',
      qaMessagesPlaceholder: 'در مورد جلسه فعلی سوال بپرسید...',
      qaMessagesPlaceholderNoContext: 'برای فعال کردن پرسش و پاسخ، یک جلسه را پردازش، ضبط یا بارگذاری کنید.',
      qaInputPlaceholder: 'سوال خود را تایپ کنید...',
    },
    actionItemAssigneePrefix: 'محول شده به',
    actionItemNoneIdentified: 'مورد اقدام خاصی شناسایی نشد.',
    actionItemErrorParsing: 'تجزیه موارد اقدام از پاسخ به درستی انجام نشد.',
    actionItemErrorNoResponse: 'پاسخی برای موارد اقدام از هوش مصنوعی دریافت نشد.',
    fileSuffixes: {
      transcription: 'رونویسی',
      summary: 'خلاصه',
      tasks: 'وظایف',
      sentiment: 'احساسات',
      meetingExportBase: 'خروجی_جلسه',
      meetingExportPrefix: 'خروجی جلسه',
      exportedOn: 'خروجی گرفته شده در'
    }
  }
};

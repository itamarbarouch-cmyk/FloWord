/**
 * UI copy: English + Hebrew (natural phrasing, not word-for-word).
 */
export const STRINGS = {
  en: {
    'lang.english': 'English',
    'lang.hebrew': 'עברית',
    'lang.choose': 'Language',

    'app.title': 'FloWord',
    'app.loading': 'Loading…',
    'app.connectingRoom': 'Connecting to room…',
    'app.waitingRoom': 'Waiting for room…',
    'app.roomBadge': 'Room {code}',

    'landing.subtitle': 'Connect your minds. Find the same word.',
    'landing.subtitleLine1': 'Connect your minds.',
    'landing.subtitleLine2': 'Find the same word.',
    'landing.createRoom': 'Create Room',
    'landing.creating': 'Creating…',
    'landing.orJoin': 'OR JOIN',
    'landing.codePlaceholder': '6-LETTER CODE',
    'landing.enterCode': 'ENTER CODE',
    'landing.joinGame': 'Join Game',

    'footer.navLabel': 'Site links',
    'footer.howToPlay': 'HOW TO PLAY',
    'footer.about': 'ABOUT',
    'footer.privacy': 'PRIVACY',

    'info.modal.close': 'Close',
    'info.how.title': 'How to play',
    'info.how.s1Title': 'Step 1 — Baseline',
    'info.how.s1Body':
      'Both players privately enter a word. Only you see your word until both have submitted.',
    'info.how.s2Title': 'Step 2 — First association',
    'info.how.s2Body':
      'The two baseline words are revealed. Both players type one word that links them (for example “fruit” for “apple” and “orange”). Submit on your own; if you finish first, you’ll see a waiting state. The round continues only after both players have submitted.',
    'info.how.s3Title': 'Step 3 — Second association',
    'info.how.s3Body':
      'If you didn’t match in Step 2, the prompt changes to the two words you just typed. Again, both players submit an association for those words, with the same wait-for-partner flow.',
    'info.how.s4Title': 'Step 4 — Result',
    'info.how.s4Intro': 'After both attempts:',
    'info.how.s4Match':
      'Match: you see a win screen and a short celebration. Same word, very similar words (e.g. religious / religion), or small typos (e.g. Door / Dor) count as a match.',
    'info.how.s4NoMatch':
      'No match after both attempts: game over with an encouraging message. You can play again and start fresh from Step 1.',

    'info.about.title': 'About FloWord',
    'info.about.p1':
      'FloWord is a two-player online association game. Each player picks a secret word, then you both try to type the same association word. Match and you win; otherwise you get another try or a friendly quote.',
    'info.about.p2': 'Built with React and Firebase for real-time play on phones and desktops.',

    'info.privacy.title': 'Privacy policy',
    'info.privacy.p1':
      'FloWord (“we”, “the app”) is provided for entertainment. This policy describes how we handle information when you use the app.',
    'info.privacy.p2':
      'We use Firebase (Google) for anonymous sign-in and to store game rooms and the words you submit during play. We do not require your name, email, or phone number to play.',
    'info.privacy.p3':
      'Data may include: anonymous user identifiers, room codes, game state (such as words and guesses), and technical data processed by Firebase (e.g. security and operations).',
    'info.privacy.p4':
      'We do not sell your personal information. We use the data to run the game and improve reliability. Google’s privacy policy also applies to Firebase services.',
    'info.privacy.p5':
      'Words you type are visible to you, your opponent in the same room, and are stored in our database for the duration of the match as needed for gameplay.',
    'info.privacy.p6':
      'You can stop using the app at any time. Anonymous sessions may persist on your device until you clear site data or use a different browser.',
    'info.privacy.p7':
      'We may update this policy occasionally. Continued use after changes means you accept the updated policy.',
    'info.privacy.p8':
      'For privacy questions, contact the person or team operating this deployment of FloWord.',

    'roomCode.heading': 'Room code',
    'roomCode.shareLink': 'Share link',
    'roomCode.copyLink': 'Copy Link',
    'roomCode.hint': 'Share this code or link with your friend. When they join, the game will start.',
    'roomCode.cancel': 'Cancel',
    'roomCode.copyCodeAria': 'Copy room code',
    'roomCode.copyLinkAria': 'Copy share link',
    'roomCode.copied': 'Copied!',
    'roomCode.copyCodeTitle': 'Copy code',

    'secret.title': 'First Word',
    'secret.subtitle': 'Enter a baseline word to start the game',
    'secret.placeholder': 'Type your word…',
    'secret.submit': 'Submit First Word',

    'reveal.title': 'Words Revealed',
    'reveal.subtitle': 'Here are your baseline words',
    'reveal.player1': 'PLAYER 1',
    'reveal.player2': 'PLAYER 2',
    'reveal.cta': 'Ready for Association',

    'assoc.attempt1': 'First Attempt',
    'assoc.attempt2': 'Second Attempt — Last Chance',
    'assoc.prompt': 'Type your association word',
    'assoc.placeholder': 'Association word',
    'assoc.submit': 'Submit',

    'waiting.title': 'Hold on…',
    'waiting.subtitle': 'Waiting for the other player to submit',
    'waiting.locked': 'Your word is locked in!',
    'waiting.continue': 'The game will continue as soon as your partner is ready.',

    'result.badge': 'Result',
    'result.winTitle': 'You matched!',
    'result.associationLabel': 'Association: {word}',
    'result.lossTitle': 'Game over',
    'result.lossSub': 'Better luck next time.',
    'result.answers': 'P1: {p1} · P2: {p2}',
    'result.playAgain': 'Play again',

    'leaveRoom': 'Leave room',

    'errors.signIn': 'Could not sign in',
    'errors.createRoom': 'Failed to create room',
    'errors.joinRoom': 'Failed to join room',
    'errors.roomNotFound': 'Room not found',
    'errors.roomFull': 'Room is full',
    'errors.alreadyCreator': 'You already created this room',
    'errors.generic': 'Something went wrong. Please try again.',

    // Motivational (loss) — keys match room.js motiv_0…9
    'quotes.motiv_0': "If at first you don't succeed, try again.",
    'quotes.motiv_1': 'Every expert was once a beginner.',
    'quotes.motiv_2': "You're one step closer than before.",
    'quotes.motiv_3': 'The best view comes after the hardest climb.',
    'quotes.motiv_4': "Keep going — you've got this.",
    'quotes.motiv_5': "Mistakes mean you're in the game.",
    'quotes.motiv_6': 'Progress beats perfection.',
    'quotes.motiv_7': 'The next try might be the one.',
    'quotes.motiv_8': 'Stay curious — the next round could be yours.',
    'quotes.motiv_9': "It's not over until you win.",

    // Celebratory (win) — celebr_0…7
    'quotes.celebr_0': 'You did it — what a match!',
    'quotes.celebr_1': 'Great minds really do think alike.',
    'quotes.celebr_2': "That's the spirit!",
    'quotes.celebr_3': 'Perfect sync.',
    'quotes.celebr_4': "You're totally in tune.",
    'quotes.celebr_5': 'Boom — nailed it!',
    'quotes.celebr_6': 'Teamwork makes it happen.',
    'quotes.celebr_7': "You're unstoppable.",
  },

  he: {
    'lang.english': 'English',
    'lang.hebrew': 'עברית',
    'lang.choose': 'שפה',

    'app.title': 'FloWord',
    'app.loading': 'טוען…',
    'app.connectingRoom': 'מתחברים לחדר…',
    'app.waitingRoom': 'ממתינים לחדר…',
    'app.roomBadge': 'חדר {code}',

    'landing.subtitle': 'חברו בין המחשבות — מצאו יחד את אותה מילה.',
    'landing.subtitleLine1': 'חברו בין המחשבות.',
    'landing.subtitleLine2': 'מצאו יחד את אותה מילה.',
    'landing.createRoom': 'צרו חדר',
    'landing.creating': 'יוצרים…',
    'landing.orJoin': 'או הצטרפות',
    'landing.codePlaceholder': 'קוד בן 6 אותיות',
    'landing.enterCode': 'הקלידו קוד',
    'landing.joinGame': 'הצטרפות למשחק',

    'footer.navLabel': 'קישורים',
    'footer.howToPlay': 'איך משחקים',
    'footer.about': 'אודות',
    'footer.privacy': 'פרטיות',

    'info.modal.close': 'סגירה',
    'info.how.title': 'איך משחקים',
    'info.how.s1Title': 'שלב 1 — מילת בסיס',
    'info.how.s1Body':
      'כל שחקן בוחר מילה בסוד — רואים רק את המילה של עצמכם עד ששניכם שלחתם.',
    'info.how.s2Title': 'שלב 2 — אסוציאציה ראשונה',
    'info.how.s2Body':
      'שתי מילות הבסיס נחשפות. כל אחד מקליד מילה אחת שמקשרת ביניהן (למשל «פרי» עבור «תפוח» ו«תפוז»). שולחים בנפרד; אם סיימתם ראשונים תראו מסך המתנה. השלב מתקדם רק אחרי ששני השחקנים שלחו.',
    'info.how.s3Title': 'שלב 3 — אסוציאציה שנייה',
    'info.how.s3Body':
      'אם לא הייתה התאמה בשלב 2, השאלה משתנה לשתי המילות שכתבתם באסוציאציה הראשונה. שוב שולחים ביחד (בזמנים שונים) עם אותו מנגנון המתנה.',
    'info.how.s4Title': 'שלב 4 — תוצאה',
    'info.how.s4Intro': 'אחרי שני הניסיונות:',
    'info.how.s4Match':
      'התאמה: מסך ניצחון וחגיגה קצרה. אותה מילה, מילים קרובות מאוד (למשל דתי / דת), או טעות הקלדה קטנה — נספרות כהתאמה.',
    'info.how.s4NoMatch':
      'בלי התאמה אחרי שני הניסיונות: סיום המשחק עם מילות עידוד. אפשר «משחק נוסף» ולהתחיל שוב משלב 1.',

    'info.about.title': 'אודות FloWord',
    'info.about.p1':
      'FloWord הוא משחק אסוציאציה לשני שחקנים ברשת. כל אחד בוחר מילה בסוד, ואז מנסים יחד להקליד את אותה מילת קישור. אם התאמתם — ניצחון; אם לא — ניסיון נוסף או ציטוט מעודד.',
    'info.about.p2': 'נבנה ב-React וב-Firebase לשחק בזמן אמת בטלפון ובמחשב.',

    'info.privacy.title': 'מדיניות פרטיות',
    'info.privacy.p1':
      'FloWord («אנחנו», «האפליקציה») מוצג לשם בידור. המדיניות מסבירה איך אנחנו מטפלים במידע כשאתם משתמשים באפליקציה.',
    'info.privacy.p2':
      'אנחנו משתמשים ב-Firebase (גוגל) להתחברות אנונימית ולשמירת חדרי משחק והמילים שאתם שולחים במהלך המשחק. אין צורך בשם, אימייל או טלפון.',
    'info.privacy.p3':
      'ייתכן שייאספו: מזהים אנונימיים, קודי חדר, מצב משחק (מילים וניחושים), ונתונים טכניים שמעבד Firebase (אבטחה ותפעול).',
    'info.privacy.p4':
      'אנחנו לא מוכרים מידע אישי. המידע משמש להרצת המשחק וליציבות. חל גם מדיניות הפרטיות של גוגל לשירותי Firebase.',
    'info.privacy.p5':
      'המילות שאתם מקלידים נראות לכם, ליריב בחדר, ונשמרות במסד הנתונים לצורך המשחק.',
    'info.privacy.p6':
      'אפשר להפסיק להשתמש בכל עת. סשן אנונימי עלול להישאר במכשיר עד שמנקים נתוני אתר או עוברים לדפדפן אחר.',
    'info.privacy.p7':
      'ייתכן שנעדכן את המדיניות מדי פעם. המשך שימוש אחרי שינוי מהווה הסכמה לעדכון.',
    'info.privacy.p8':
      'לשאלות פרטיות, פנו למפעיל/ת הפריסה הספציפית של FloWord.',

    'roomCode.heading': 'קוד החדר',
    'roomCode.shareLink': 'קישור לשיתוף',
    'roomCode.copyLink': 'העתקת קישור',
    'roomCode.hint': 'שלחו לחבר/ה את הקוד או הקישור — ברגע שיצטרפו המשחק יתחיל.',
    'roomCode.cancel': 'ביטול',
    'roomCode.copyCodeAria': 'העתקת קוד החדר',
    'roomCode.copyLinkAria': 'העתקת קישור השיתוף',
    'roomCode.copied': 'הועתק!',
    'roomCode.copyCodeTitle': 'העתקת קוד',

    'secret.title': 'המילה הראשונה',
    'secret.subtitle': 'הקלידו מילת בסיס — כל אחד בנפרד — כדי להתחיל.',
    'secret.placeholder': 'הקלידו את המילה…',
    'secret.submit': 'שליחת המילה',

    'reveal.title': 'המילים נחשפו',
    'reveal.subtitle': 'אלה שתי מילות הבסיס שלכם',
    'reveal.player1': 'שחקן/ת 1',
    'reveal.player2': 'שחקן/ת 2',
    'reveal.cta': 'ממשיכים לאסוציאציה',

    'assoc.attempt1': 'ניסיון ראשון',
    'assoc.attempt2': 'ניסיון שני — זו ההזדמנות האחרונה',
    'assoc.prompt': 'איזו מילה מקשרת ביניהן בשבילכם?',
    'assoc.placeholder': 'מילת אסוציאציה',
    'assoc.submit': 'שליחה',

    'waiting.title': 'רגע…',
    'waiting.subtitle': 'ממתינים שהשחקן/ת השני/ה ישלח/ת',
    'waiting.locked': 'המילה שלכם נשמרה!',
    'waiting.continue': 'המשחק ימשיך ברגע שהצד השני מוכן.',

    'result.badge': 'תוצאה',
    'result.winTitle': 'זה התאים!',
    'result.associationLabel': 'המילה המשותפת: {word}',
    'result.lossTitle': 'סיום המשחק',
    'result.lossSub': 'בהצלחה בפעם הבאה.',
    'result.answers': 'ש1: {p1} · ש2: {p2}',
    'result.playAgain': 'משחק נוסף',

    'leaveRoom': 'יציאה מהחדר',

    'errors.signIn': 'לא הצלחנו להתחבר',
    'errors.createRoom': 'יצירת החדר נכשלה',
    'errors.joinRoom': 'ההצטרפות נכשלה',
    'errors.roomNotFound': 'החדר לא נמצא',
    'errors.roomFull': 'החדר מלא',
    'errors.alreadyCreator': 'כבר יצרת את החדר הזה',
    'errors.generic': 'משהו השתבש. נסו שוב.',

    'quotes.motiv_0': 'פעם ראשונה לא הצליחה? נסו שוב.',
    'quotes.motiv_1': 'גם המומחים התחילו מתחילים.',
    'quotes.motiv_2': 'עכשיו אתם צעד אחד קדימה.',
    'quotes.motiv_3': 'אחרי העלייה הקשה בדרך כלל מגיע הנוף היפה.',
    'quotes.motiv_4': 'תמשיכו — אתם יכולים.',
    'quotes.motiv_5': 'טעויות אומרות שאתם באמת משחקים.',
    'quotes.motiv_6': 'התקדמות חשובה יותר ממושלמות.',
    'quotes.motiv_7': 'אולי הניסיון הבא יהיה בדיוק הנכון.',
    'quotes.motiv_8': 'תישארו סקרנים — הסיבוב הבא יכול להיות שלכם.',
    'quotes.motiv_9': 'זה נגמר רק כשמנצחים.',

    'quotes.celebr_0': 'עשיתם את זה — איזו התאמה!',
    'quotes.celebr_1': 'חשיבה דומה באמת קיימת.',
    'quotes.celebr_2': 'בדיוק הרוח הנכונה!',
    'quotes.celebr_3': 'סנכרון מושלם.',
    'quotes.celebr_4': 'אתם בדיוק על אותו גל.',
    'quotes.celebr_5': 'בום — פגעתם!',
    'quotes.celebr_6': 'יחד זה עובד.',
    'quotes.celebr_7': 'אין עוצרים אתכם.',
  },
}

import os
import sys
import json
import re
sys.path.append(os.path.dirname(__file__))

from dotenv import load_dotenv
from database import (
    get_all_notifications,
    get_workshop_by_id,
    get_all_workshops,
    get_all_students,
    get_club_stats
)

load_dotenv()

def detect_language(text: str) -> str:
    """
    Detects user input language mode:
    - 'hi_devanagari': Devanagari Hindi script (हिंदी, वर्कशॉप, फॉर्म, etc.)
    - 'en': Pure English query (When is, show me, list, upcoming, register)
    - 'hinglish': Roman script Hindi / Hinglish (kab, batao, dikhao, karna hai, saari)
    """
    # 1. Devanagari script detection
    if re.search(r'[\u0900-\u097F]', text):
        return "hi_devanagari"
    
    q = text.lower()
    
    # 2. English signature words
    en_words = [
        "when", "what", "how", "show", "list", "upcoming", "register",
        "schedule", "tell", "who", "where", "is", "are", "can", "details",
        "about", "events", "workshops", "notifications", "course", "courses"
    ]
    en_score = sum(1 for w in en_words if w in q)
    
    # 3. Hinglish signature words
    hi_words = [
        "kab", "batao", "dikhao", "karo", "hai", "kya", "kaise", "karna",
        "kahan", "aap", "mai", "mujhe", "chahiye", "nahi", "haan", "saari",
        "kitni", "bhi", "par", "ko", "baare", "puch"
    ]
    hi_score = sum(1 for w in hi_words if w in q)
    
    if hi_score > en_score:
        return "hinglish"
    elif en_score > 0 and hi_score == 0:
        return "en"
    elif hi_score > 0:
        return "hinglish"
    
    return "hinglish"

def process_agent_query(user_name: str, query: str):
    """
    Processes user query through real SQLite DB data + rich club knowledge base.
    Responds in the EXACT SAME LANGUAGE as user input (Devanagari Hindi, English, or Hinglish).
    """
    q = query.lower()
    lang = detect_language(query)

    # --- Fetch Live Data from SQLite DB ---
    all_workshops = get_all_workshops()
    all_notifications = get_all_notifications()
    all_students = get_all_students()
    stats = get_club_stats()

    active_notifs = [n for n in all_notifications if n.get('active', 1)]
    first_workshop = all_workshops[0] if all_workshops else None

    # =====================================================================
    # 1. NOTIFICATIONS / ANNOUNCEMENTS INTENT
    # =====================================================================
    notif_keywords = [
        "notif", "announc", "news", "recent", "update", "khabar", "batao", "latest",
        "नोटिफिकेशन", "अनाउंसमेंट", "खबर", "न्यूज़", "लेटेस्ट", "अपडेट", "सूचना", "एलर्ट", "समाचार"
    ]
    if any(kw in q for kw in notif_keywords):
        if not active_notifs:
            if lang == "hi_devanagari":
                text = f"नमस्ते {user_name}! अभी डेटाबेस में कोई ब्रॉडकास्ट नोटिफिकेशन scheduled नहीं है। नीचे अपना ईमेल दर्ज करें — नया नोटिफिकेशन आते ही आपको ईमेल अलर्ट मिल जाएगा!"
            elif lang == "en":
                text = f"Hello {user_name}! No broadcast notifications are scheduled right now. Please enter your email below to get instant email alerts!"
            else:
                text = f"Ji {user_name}! Abhi database mein koi broadcast notification scheduled nahi hai. Kripya niche apna email fill kijiye — jaise hi naya notification aayega, aapko mail par notification mil jayega!"
            
            return {"response_text": text, "action_type": "subscribe_email_card", "payload": {}}
        
        latest = active_notifs[0]
        dt_str = f" [{latest.get('date', '')} {latest.get('time', '')}]" if latest.get('date') else ""
        
        if lang == "hi_devanagari":
            text = f"नमस्ते {user_name}! सबसे लेटेस्ट ब्रॉडकास्ट नोटिफिकेशन यह है: '{latest.get('title')}'{dt_str}।"
        elif lang == "en":
            text = f"Hello {user_name}! Here is the latest broadcast notification: '{latest.get('title')}'{dt_str}."
        else:
            text = f"Ji {user_name}! Sabse LATEST broadcast notification ye hai: '{latest.get('title')}'{dt_str}."

        return {"response_text": text, "action_type": "notifications_card", "payload": active_notifs}

    # =====================================================================
    # 2. ALL WORKSHOPS LIST INTENT
    # =====================================================================
    all_ws_keywords = [
        "saari", "all workshop", "kitni workshop", "list", "workshops dikhao", "sabhi", "courses",
        "कोर्स", "वर्कशॉप", "लिस्ट", "दिखाओ", "सभी", "कितनी", "सब", "कोर्सेज"
    ]
    if any(kw in q for kw in all_ws_keywords):
        if not all_workshops:
            if lang == "hi_devanagari":
                text = f"नमस्ते {user_name}! अभी डेटाबेस में कोई एक्टिव वर्कशॉप scheduled नहीं है। नीचे अपना ईमेल दर्ज करें — नए वर्कशॉप की घोषणा होते ही आपको ईमेल मिल जाएगा!"
            elif lang == "en":
                text = f"Hello {user_name}! No active workshops are scheduled right now. Please enter your email below to get notified!"
            else:
                text = f"Ji {user_name}! Abhi database mein koi active workshop scheduled nahi hai. Niche apna email fill kijiye — naye workshop ki announcement hote hi aapko email mil jayega!"

            return {"response_text": text, "action_type": "subscribe_email_card", "payload": {}}

        ws_summary = []
        for ws in all_workshops:
            ws_summary.append(f"• {ws['title']} — {ws['date']} at {ws['time']} ({ws['enrolled']}/{ws['seats']} seats)")
        ws_text = "\n".join(ws_summary)

        if lang == "hi_devanagari":
            text = f"नमस्ते {user_name}! WDC में अभी {len(all_workshops)} एक्टिव वर्कशॉप हैं:\n\n{ws_text}"
        elif lang == "en":
            text = f"Hello {user_name}! WDC currently has {len(all_workshops)} active workshops scheduled:\n\n{ws_text}"
        else:
            text = f"Ji {user_name}! WDC mein abhi {len(all_workshops)} active workshops hain:\n\n{ws_text}"

        return {"response_text": text, "action_type": "all_workshops_card", "payload": all_workshops}

    # =====================================================================
    # 3. ENROLLMENT / FORM INTENT
    # =====================================================================
    form_keywords = [
        "enroll", "form", "fill", "register", "interested", "join", "seat", "book",
        "फॉर्म", "रजिस्टर", "एनरोल", "सीट", "बुक", "जॉइन", "भरे", "भरना"
    ]
    if any(kw in q for kw in form_keywords):
        if not all_workshops:
            if lang == "hi_devanagari":
                text = f"नमस्ते {user_name}! अभी कोई एक्टिव वर्कशॉप उपलब्ध नहीं है जिसमें सीट बुक की जा सके। नीचे अपना ईमेल दर्ज करें!"
            elif lang == "en":
                text = f"Hello {user_name}! No active workshop is currently open for enrollment. Leave your email below to get notified!"
            else:
                text = f"Ji {user_name}! Abhi koi active workshop available nahi hai jisme seat book ki ja sake. Niche apna email fill karein!"

            return {"response_text": text, "action_type": "subscribe_email_card", "payload": {}}

        matched_ws = None
        for ws in all_workshops:
            if ws['id'].lower() in q or any(w in q for w in ws['title'].lower().split() if len(w) > 4):
                matched_ws = ws
                break
        
        if matched_ws:
            if lang == "hi_devanagari":
                text = f"बहुत बढ़िया {user_name}! मैं आपकी स्क्रीन पर '{matched_ws['title']}' का स्पेसिफिक रजिस्ट्रेशन फ़ॉर्म ओपन कर रही हूँ। नीचे फ़ॉर्म भरकर अपनी सीट रिज़र्व करें!"
            elif lang == "en":
                text = f"Great choice {user_name}! Delivering the dedicated registration form for '{matched_ws['title']}' on your screen. Fill it below to reserve your seat!"
            else:
                text = f"Bahut badiya {user_name}! Main aapki screen par '{matched_ws['title']}' ka specific registration form deliver kar rahi hun. Niche form fill karke apni seat reserve karein!"

            return {"response_text": text, "action_type": "form_view", "payload": matched_ws}
        else:
            if lang == "hi_devanagari":
                text = f"नमस्ते {user_name}! आप किस वर्कशॉप के लिए रजिस्टर करना चाहते हैं? नीचे सभी एक्टिव वर्कशॉप के फ़ॉर्म बटन दिए गए हैं:"
            elif lang == "en":
                text = f"Hello {user_name}! Which workshop would you like to register for? Dedicated registration form buttons for all active workshops are shown below:"
            else:
                text = f"Ji {user_name}! Aap kis workshop ke liye register karna chahte hain? Niche sabhi active workshops ke dedicated registration form buttons diye gaye hain:"

            return {"response_text": text, "action_type": "all_workshops_card", "payload": all_workshops}

    # =====================================================================
    # 4. WORKSHOP SCHEDULE INTENT (next upcoming)
    # =====================================================================
    schedule_keywords = [
        "workshop", "schedule", "date", "time", "next", "upcoming", "class", "session", "kab",
        "कब", "समय", "दिनांक", "तारीख", "क्लास", "सेशन", "अगला", "अगली"
    ]
    if any(kw in q for kw in schedule_keywords):
        if first_workshop:
            if lang == "hi_devanagari":
                text = f"नमस्ते {user_name}! यह रही आगामी WDC वर्कशॉप की पूरी जानकारी:"
            elif lang == "en":
                text = f"Hello {user_name}! Here are the details for the next upcoming WDC workshop:"
            else:
                text = f"Ji {user_name}! Ye rahi next upcoming WDC workshop details:"

            return {"response_text": text, "action_type": "workshop_card", "payload": first_workshop}
        else:
            if lang == "hi_devanagari":
                text = f"नमस्ते {user_name}! अभी कोई आगामी वर्कशॉप scheduled नहीं है। नीचे अपना ईमेल दर्ज करें!"
            elif lang == "en":
                text = f"Hello {user_name}! No upcoming workshops are scheduled right now. Enter your email below to stay updated!"
            else:
                text = f"Ji {user_name}! Abhi koi upcoming workshop scheduled nahi hai. Niche apna email id fill kijiye!"

            return {"response_text": text, "action_type": "subscribe_email_card", "payload": {}}

    # =====================================================================
    # 5. STUDENTS / MEMBERS COUNT INTENT
    # =====================================================================
    student_keywords = [
        "student", "member", "kitne", "count", "total", "enrolled", "registered", "log",
        "छात्र", "स्टूडेंट", "सदस्य", "कितने", "कुल", "संख्या"
    ]
    if any(kw in q for kw in student_keywords):
        if lang == "hi_devanagari":
            text = f"नमस्ते {user_name}! WDC में अभी कुल {stats['total_students']} रजिस्टर्ड छात्र हैं। {stats['total_enrolled']} छात्र {stats['total_workshops']} वर्कशॉप्स में एनरोल्ड हैं। कुल सीट ऑक्यूपेंसी {stats['occupancy_pct']}% है!"
        elif lang == "en":
            text = f"Hello {user_name}! WDC currently has {stats['total_students']} registered students. {stats['total_enrolled']} students are enrolled across {stats['total_workshops']} workshops with an occupancy of {stats['occupancy_pct']}%!"
        else:
            text = f"Ji {user_name}! WDC mein abhi total {stats['total_students']} registered students hain. {stats['total_enrolled']} students {stats['total_workshops']} workshops mein enrolled hain. Overall seat occupancy {stats['occupancy_pct']}% hai!"

        return {"response_text": text, "action_type": "text_response", "payload": stats}

    # =====================================================================
    # 6. DOMAINS & TECH STACK INTENT
    # =====================================================================
    domain_keywords = ["domain", "domains", "tech", "stack", "technology", "topic", "डोमेन", "तकनीक", "विषय", "क्या सिखाते"]
    if any(kw in q for kw in domain_keywords):
        if lang == "hi_devanagari":
            text = f"नमस्ते {user_name}! Web Development Club (WDC) RECB 6 मुख्य डोमेन पर वर्कशॉप्स और प्रोजेक्ट्स आयोजित करता है:\n1. 🧠 Artificial Intelligence & Machine Learning\n2. 🌐 Web Development (React, FastAPI, Node.js)\n3. 📊 Data Science & Python Analytics\n4. 💻 C & C++ Core Programming / DSA\n5. 🗄️ Databases & Cloud Deployment (SQL, AWS)\n6. ⚡ Emerging Technologies (Blockchain, IoT)\n\nआप किसी भी डोमेन के लिए एनरोल कर सकते हैं!"
        elif lang == "en":
            text = f"Hello {user_name}! Web Development Club (WDC) RECB covers 6 major technical domains:\n1. 🧠 Artificial Intelligence & Machine Learning\n2. 🌐 Web Development (React, FastAPI, Node.js)\n3. 📊 Data Science & Python Analytics\n4. 💻 C & C++ Core Programming / DSA\n5. 🗄️ Databases & Cloud Deployment (SQL, AWS)\n6. ⚡ Emerging Technologies (Blockchain, IoT)\n\nYou can register for workshops in any domain!"
        else:
            text = f"Ji {user_name}! Web Development Club (WDC) RECB 6 major domains par workshops & hands-on projects conduct karta hai:\n1. 🧠 Artificial Intelligence & Machine Learning\n2. 🌐 Web Development (React, FastAPI, Node.js)\n3. 📊 Data Science & Python Analytics\n4. 💻 C & C++ Core Programming / DSA\n5. 🗄️ Databases & Cloud Deployment (SQL, AWS)\n6. ⚡ Emerging Technologies (Blockchain, IoT)\n\nAap kisi bhi domain ke workshop me enroll kar sakte hain!"

        return {"response_text": text, "action_type": "all_workshops_card", "payload": all_workshops}

    # =====================================================================
    # 7. ABOUT WDC & COLLEGE INTENT
    # =====================================================================
    about_keywords = ["wdc", "club", "recb", "banda", "college", "about", "detail", "info", "क्लब", "कॉलेज", "बांदा", "जानकारी", "डिटेल", "संस्थान"]
    if any(kw in q for kw in about_keywords):
        if lang == "hi_devanagari":
            text = f"नमस्ते {user_name}! WDC (Web Development Club) राजकीय इंजीनियरिंग कॉलेज बांदा (RECB) का प्रीमियर ऑफिशियल टेक्निकल क्लब है। हम 200+ एक्टिव स्टूडेंट मेंबर्स को हैंड-ऑन वर्कशॉप्स और प्रोजेक्ट्स के ज़रिए ट्रेन करते हैं।"
        elif lang == "en":
            text = f"Hello {user_name}! WDC (Web Development Club) is the premier official technical club of Rajkiya Engineering College Banda (RECB). We empower 200+ active student members through hands-on workshops and peer learning."
        else:
            text = f"Ji {user_name}! WDC (Web Development Club) Rajkiya Engineering College Banda (RECB) ka premier official technical club hai. Hum 200+ active student members ko expert-led workshops, hackathons aur peer-learning ke zariye train karte hain."

        return {"response_text": text, "action_type": "text_response", "payload": stats}

    # =====================================================================
    # 8. MATCH SPECIFIC WORKSHOP BY TITLE OR TOPICS
    # =====================================================================
    for ws in all_workshops:
        title_words = ws['title'].lower().split()
        if any(word in q for word in title_words if len(word) > 3):
            if lang == "hi_devanagari":
                text = f"नमस्ते {user_name}! '{ws['title']}' के बारे में यह रही पूरी जानकारी:"
            elif lang == "en":
                text = f"Hello {user_name}! Here are the details for '{ws['title']}':"
            else:
                text = f"Ji {user_name}! '{ws['title']}' ke baare mein ye rahi details:"

            return {"response_text": text, "action_type": "workshop_card", "payload": ws}

    # =====================================================================
    # 9. GREETINGS & INTRODUCTORY RESPONSES
    # =====================================================================
    if any(kw in q for kw in ["hi", "hello", "namaste", "hey", "नमस्ते", "हेलो", "हाय"]):
        if lang == "hi_devanagari":
            text = f"नमस्ते {user_name}! मैं हूँ WDC AI Concierge AURA। मैं वर्कशॉप्स, नोटिफिकेशन और रजिस्ट्रेशन में आपकी सहायता कर सकती हूँ। आप क्या जानना चाहते हैं?"
        elif lang == "en":
            text = f"Hello {user_name}! I am WDC AI Concierge AURA. How can I assist you today with workshops, broadcast notifications, or registrations?"
        else:
            text = f"Namaste {user_name}! Main hun WDC AI Concierge AURA. Main aapki WDC workshops, notifications, registration form aur club details mein help kar sakti hun. Aap kya janna chahte hain?"

        return {"response_text": text, "action_type": "text_response", "payload": {}}

    # =====================================================================
    # 10. SMART FALLBACK RESPONSE IN MATCHED LANGUAGE
    # =====================================================================
    if lang == "hi_devanagari":
        text = f"नमस्ते {user_name}! आप मुझसे पूछ सकते हैं:\n• 'अगली वर्कशॉप कब है?' — शेड्यूल देखने के लिए\n• 'नोटिफिकेशन दिखाओ' — अपडेट के लिए\n• 'रजिस्टर करना है' — फ़ॉर्म भरने के लिए\n• 'डोमेन कौन से हैं?' — डोमेन सूची के लिए"
    elif lang == "en":
        text = f"Hello {user_name}! You can ask me:\n• 'When is the next workshop?' — for schedules\n• 'Show notifications' — for broadcast news\n• 'I want to register' — for application forms\n• 'What are the club domains?' — for tech stack"
    else:
        text = f"Ji {user_name}! WDC portal ke baare mein aap mujhse puch sakte hain:\n• 'Next workshop kab hai?' — schedule ke liye\n• 'Notifications dikhao' — latest updates ke liye\n• 'Register karna hai' — form fill karne ke liye\n• 'Domains konse hain?' — tech stack ke liye"

    return {"response_text": text, "action_type": "text_response", "payload": {}}

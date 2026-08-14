import os
import json
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

DB_URL = os.getenv("DATABASE_URL")

def get_connection():
    """Returns a PostgreSQL database connection with RealDictCursor enabled and automatic retry."""
    db_url = os.getenv("DATABASE_URL") or DB_URL
    if not db_url:
        raise ValueError("DATABASE_URL environment variable is not set on Render!")
    
    try:
        conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor, connect_timeout=10)
        return conn
    except Exception as e:
        # Retry connection once in case of temporary network glitch
        try:
            conn = psycopg2.connect(db_url, cursor_factory=RealDictCursor, connect_timeout=10)
            return conn
        except Exception:
            raise e

def init_db():
    """Initializes PostgreSQL database tables and seeds default WDC data if empty."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Workshops Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workshops (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        mentor TEXT,
        date TEXT,
        time TEXT,
        seats INTEGER,
        enrolled INTEGER DEFAULT 0,
        topics TEXT,
        status TEXT DEFAULT 'Active',
        color TEXT DEFAULT '#00f2fe',
        is_ended INTEGER DEFAULT 0,
        group_photo_url TEXT DEFAULT '',
        feedback_prompt TEXT DEFAULT ''
    );
    """)

    cursor.execute("ALTER TABLE workshops ADD COLUMN IF NOT EXISTS is_ended INTEGER DEFAULT 0;")
    cursor.execute("ALTER TABLE workshops ADD COLUMN IF NOT EXISTS group_photo_url TEXT DEFAULT '';")
    cursor.execute("ALTER TABLE workshops ADD COLUMN IF NOT EXISTS feedback_prompt TEXT DEFAULT '';")

    # 2. Notifications Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        related_workshop_id TEXT,
        date TEXT,
        time TEXT,
        views INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1
    );
    """)

    cursor.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS category TEXT;")
    cursor.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_workshop_id TEXT;")
    cursor.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS date TEXT;")
    cursor.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS time TEXT;")
    cursor.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;")
    cursor.execute("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS active INTEGER DEFAULT 1;")

    # 3. Enrolled Students Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        workshop_id TEXT,
        workshop_title TEXT,
        date TEXT,
        status TEXT DEFAULT 'Confirmed',
        allowed INTEGER DEFAULT 0,
        password TEXT DEFAULT ''
    );
    """)

    cursor.execute("ALTER TABLE students ADD COLUMN IF NOT EXISTS allowed INTEGER DEFAULT 0;")
    cursor.execute("ALTER TABLE students ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '';")

    # 4. Workshop Resources Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workshop_resources (
        id TEXT PRIMARY KEY,
        workshop_id TEXT NOT NULL,
        title TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        link_url TEXT,
        description TEXT,
        date_added TEXT
    );
    """)

    # 5. Workshop Daily Attendance Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workshop_attendance (
        id TEXT PRIMARY KEY,
        workshop_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        student_name TEXT,
        date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Present',
        updated_at TEXT
    );
    """)

    # 6. Workshop Tests Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tests (
        id TEXT PRIMARY KEY,
        workshop_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        level TEXT DEFAULT 'Intermediate',
        type TEXT DEFAULT 'single_correct',
        duration_mins INTEGER DEFAULT 15,
        total_questions INTEGER DEFAULT 5,
        questions_json TEXT NOT NULL,
        status TEXT DEFAULT 'Draft',
        is_live INTEGER DEFAULT 0,
        created_at TEXT
    );
    """)

    # 7. Student Test Submissions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS test_submissions (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        workshop_id TEXT NOT NULL,
        student_email TEXT NOT NULL,
        student_name TEXT,
        answers_json TEXT,
        score INTEGER,
        max_score INTEGER,
        percentage REAL,
        submitted_at TEXT
    );
    """)

    # 8. Gallery Media Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS gallery_media (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        media_type TEXT DEFAULT 'video',
        category TEXT DEFAULT 'Highlight',
        date TEXT
    );
    """)

    # 9. Core Team Members Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS team_members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        image_url TEXT NOT NULL,
        linkedin_url TEXT,
        created_at TEXT
    );
    """)

    # 10. Workshop Feedbacks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workshop_feedbacks (
        id TEXT PRIMARY KEY,
        workshop_id TEXT,
        student_email TEXT,
        student_name TEXT,
        rating INTEGER DEFAULT 5,
        feedback_text TEXT,
        suggestions TEXT,
        submitted_at TEXT
    );
    """)

    # 11. Subscribers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subscribers (
        email TEXT PRIMARY KEY,
        date TEXT
    );
    """)

    # Seed default team members if empty
    cursor.execute("SELECT COUNT(*) as count FROM team_members")
    if cursor.fetchone()['count'] == 0:
        default_team = [
            ("tm-1", "Aditya Sharma", "Lead Developer & President", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", "https://www.linkedin.com/company/web-dev-club-recb/posts/?feedView=all"),
            ("tm-2", "Priya Singh", "AI & ML Specialist", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", "https://www.linkedin.com/company/web-dev-club-recb/posts/?feedView=all"),
            ("tm-3", "Rohan Verma", "Full-Stack Web Lead", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", "https://www.linkedin.com/company/web-dev-club-recb/posts/?feedView=all"),
            ("tm-4", "Ananya Gupta", "Data Science & Cloud Lead", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80", "https://www.linkedin.com/company/web-dev-club-recb/posts/?feedView=all"),
            ("tm-5", "Vikram Patel", "Competitive Coding Lead", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80", "https://www.linkedin.com/company/web-dev-club-recb/posts/?feedView=all")
        ]
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        for item in default_team:
            cursor.execute("""
            INSERT INTO team_members (id, name, role, image_url, linkedin_url, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """, (item[0], item[1], item[2], item[3], item[4], now_str))

    # Seed Default Gallery Media if empty
    cursor.execute("SELECT COUNT(*) as count FROM gallery_media")
    if cursor.fetchone()['count'] == 0:
        date_today = datetime.now().strftime("%Y-%m-%d")
        default_gallery = [
            ('media-101', 'WDC 3D AI Concierge Autonomous Agent', '/avatar_video.mp4', 'video', 'AI Tech Showcase', date_today),
            ('media-102', 'Full-Stack Web & AI Development Masterclass', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80', 'image', 'Workshop Feature', date_today),
            ('media-103', 'Smart India Hackathon Victory & RECB Team', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', 'image', 'Achievement', date_today),
        ]
        for item in default_gallery:
            cursor.execute("""
            INSERT INTO gallery_media (id, title, url, media_type, category, date)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """, item)

    conn.commit()
    conn.close()

# Initial database setup
init_db()

# --- DATABASE CRUD FUNCTIONS ---

def get_all_workshops():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workshops ORDER BY date ASC")
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for r in rows:
        item = dict(r)
        item['topics'] = json.loads(item['topics']) if item.get('topics') else []
        result.append(item)
    return result

def get_workshop_by_id(workshop_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workshops WHERE id = %s", (workshop_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        item = dict(row)
        item['topics'] = json.loads(item['topics']) if item.get('topics') else []
        return item
    return None

def add_workshop(title, mentor, date, time, seats, topics, color='#00f2fe'):
    """Adds a new workshop to PostgreSQL DB."""
    import time as time_module
    ws_id = f"ws-{int(time_module.time() * 1000) % 100000}"
    topics_json = json.dumps(topics if isinstance(topics, list) else [t.strip() for t in topics.split(',')])
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO workshops (id, title, mentor, date, time, seats, enrolled, topics, status, color)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (ws_id, title, mentor or 'WDC Lead Mentor', date, time or '18:00 IST', 
          int(seats) if seats else 50, 0, topics_json, 'Active', color))
    conn.commit()
    conn.close()
    return get_workshop_by_id(ws_id)

def delete_workshop(workshop_id):
    """Deletes a workshop from PostgreSQL DB."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM workshops WHERE id = %s", (workshop_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted > 0

def get_all_notifications():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notifications ORDER BY date DESC, id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def add_notification(title, category='Announcement', related_workshop_id=None, date=None, time=None):
    """Adds a new notification to PostgreSQL DB."""
    import time as time_module
    notif_id = f"notif-{int(time_module.time() * 1000) % 1000000}"
    date_str = date if date else datetime.now().strftime("%Y-%m-%d")
    time_str = time if time else datetime.now().strftime("%H:%M IST")
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO notifications (id, title, category, related_workshop_id, date, time, views, active)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (notif_id, title, category, related_workshop_id, date_str, time_str, 0, 1))
    conn.commit()
    conn.close()
    return notif_id

def delete_notification(notif_id):
    """Deletes a notification from PostgreSQL DB."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notifications WHERE id = %s", (notif_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted > 0

def get_all_students(workshop_id=None):
    conn = get_connection()
    cursor = conn.cursor()
    if workshop_id and workshop_id != 'all':
        cursor.execute("SELECT * FROM students WHERE workshop_id = %s ORDER BY date DESC", (workshop_id,))
    else:
        cursor.execute("SELECT * FROM students ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def register_student_db(name, email, phone, workshop_id="ws-101"):
    workshop = get_workshop_by_id(workshop_id) or get_workshop_by_id("ws-101")
    if not workshop:
        return None
        
    import time as time_module
    ticket_id = f"WDC-2026-{int(time_module.time() * 1000) % 900000 + 100000}"
    date_str = datetime.now().strftime("%Y-%m-%d")

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO students (id, name, email, phone, workshop_id, workshop_title, date, status)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (ticket_id, name, email, phone, workshop['id'], workshop['title'], date_str, 'Confirmed'))
    
    # Increment enrolled count in workshops
    cursor.execute("UPDATE workshops SET enrolled = enrolled + 1 WHERE id = %s", (workshop['id'],))
    conn.commit()
    conn.close()
    
    return {
        "id": ticket_id,
        "name": name,
        "email": email,
        "workshop_title": workshop['title'],
        "date": date_str,
        "status": "Confirmed"
    }

def get_all_subscribers():
    """Returns all email subscribers from DB."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM subscribers ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_club_stats():
    """Returns aggregate stats for the club agent to use."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as count FROM workshops WHERE status='Active'")
    total_workshops = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM students")
    total_students = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM notifications WHERE active=1")
    active_notifications = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM subscribers")
    total_subscribers = cursor.fetchone()['count']
    
    cursor.execute("SELECT SUM(enrolled) as total_enrolled, SUM(seats) as total_seats FROM workshops")
    row = cursor.fetchone()
    total_enrolled = row['total_enrolled'] or 0
    total_seats = row['total_seats'] or 0
    
    conn.close()
    return {
        "total_workshops": total_workshops,
        "total_students": total_students,
        "active_notifications": active_notifications,
        "total_subscribers": total_subscribers,
        "total_enrolled": total_enrolled,
        "total_seats": total_seats,
        "occupancy_pct": round((total_enrolled / total_seats * 100) if total_seats > 0 else 0, 1)
    }

def add_subscriber(email: str):
    """Adds a subscriber email to PostgreSQL DB for upcoming workshop & notification alerts."""
    date_str = datetime.now().strftime("%Y-%m-%d")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO subscribers (email, date) VALUES (%s, %s)
    ON CONFLICT (email) DO UPDATE SET date = EXCLUDED.date
    """, (email, date_str))
    conn.commit()
    conn.close()
    return {"success": True, "email": email, "message": "Email subscribed successfully!"}

def get_all_gallery_media():
    """Returns all gallery media items from DB."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM gallery_media ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def add_gallery_media(title: str, url: str, media_type: str = 'video', category: str = 'Highlight'):
    """Adds a new gallery media item to DB."""
    media_id = f"media-{int(datetime.now().timestamp())}"
    date_str = datetime.now().strftime("%Y-%m-%d")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO gallery_media (id, title, url, media_type, category, date)
    VALUES (%s, %s, %s, %s, %s, %s)
    """, (media_id, title, url, media_type, category, date_str))
    conn.commit()
    conn.close()
    return {
        "id": media_id,
        "title": title,
        "url": url,
        "media_type": media_type,
        "category": category,
        "date": date_str
    }

def delete_gallery_media(media_id: str):
    """Deletes a gallery media item by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM gallery_media WHERE id = %s", (media_id,))
    conn.commit()
    conn.close()
    return {"success": True, "id": media_id}

# --- STUDENT ACCESS & WORKSHOP RESOURCES CRUD ---

def update_student_access(student_id: str, allowed: int, password: str = ""):
    """Updates student permission status (allowed = 1/0) and assigns login password."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE students
    SET allowed = %s, password = CASE WHEN %s <> '' THEN %s ELSE password END, status = CASE WHEN %s = 1 THEN 'Allowed' ELSE 'Pending' END
    WHERE id = %s
    """, (allowed, password, password, allowed, student_id))
    updated = cursor.rowcount > 0
    conn.commit()
    
    # Return updated student
    cursor.execute("SELECT * FROM students WHERE id = %s", (student_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def student_login(email: str, password: str):
    """Authenticates student using email and admin-assigned password."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM students
    WHERE LOWER(email) = LOWER(%s) AND password = %s
    """, (email.strip(), password.strip()))
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        return None
    
    students_list = [dict(r) for r in rows]
    user_name = students_list[0]['name']
    
    # Fetch all allowed workshops for this student's email
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT s.*, w.title as full_workshop_title, w.mentor, w.date as workshop_date, w.time as workshop_time, w.topics, w.color
    FROM students s
    LEFT JOIN workshops w ON s.workshop_id = w.id
    WHERE LOWER(s.email) = LOWER(%s)
    """, (email.strip(),))
    registrations = [dict(r) for r in cursor.fetchall()]
    
    # For each allowed registration, fetch workshop resources
    for reg in registrations:
        if reg.get('topics'):
            try:
                reg['topics'] = json.loads(reg['topics'])
            except Exception:
                pass
        if reg.get('allowed') == 1:
            cursor.execute("SELECT * FROM workshop_resources WHERE workshop_id = %s ORDER BY date_added DESC", (reg['workshop_id'],))
            reg['resources'] = [dict(r) for r in cursor.fetchall()]
        else:
            reg['resources'] = []
            
    conn.close()
    return {
        "authenticated": True,
        "name": user_name,
        "email": email.strip(),
        "registrations": registrations
    }

def get_student_dashboard_data(email: str):
    """Fetches all registrations and allowed workshop resources for a student."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT s.*, w.title as full_workshop_title, w.mentor, w.date as workshop_date, w.time as workshop_time, w.topics, w.color
    FROM students s
    LEFT JOIN workshops w ON s.workshop_id = w.id
    WHERE LOWER(s.email) = LOWER(%s)
    """, (email.strip(),))
    registrations = [dict(r) for r in cursor.fetchall()]
    
    for reg in registrations:
        if reg.get('topics'):
            try:
                reg['topics'] = json.loads(reg['topics'])
            except Exception:
                pass
        if reg.get('allowed') == 1:
            cursor.execute("SELECT * FROM workshop_resources WHERE workshop_id = %s ORDER BY date_added DESC", (reg['workshop_id'],))
            reg['resources'] = [dict(r) for r in cursor.fetchall()]
        else:
            reg['resources'] = []
            
    conn.close()
    return {
        "email": email.strip(),
        "registrations": registrations
    }

def get_workshop_resources(workshop_id: str):
    """Returns all resources for a specific workshop."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workshop_resources WHERE workshop_id = %s ORDER BY date_added DESC", (workshop_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def add_workshop_resource(workshop_id: str, title: str, resource_type: str = "Notes", link_url: str = "", description: str = ""):
    """Adds a new resource (Notes, Test, Assignment, Code, Video) to a workshop."""
    import time as time_module
    res_id = f"res-{int(time_module.time() * 1000) % 1000000}"
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO workshop_resources (id, workshop_id, title, resource_type, link_url, description, date_added)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (res_id, workshop_id, title, resource_type, link_url, description, date_str))
    conn.commit()
    conn.close()
    
    return {
        "id": res_id,
        "workshop_id": workshop_id,
        "title": title,
        "resource_type": resource_type,
        "link_url": link_url,
        "description": description,
        "date_added": date_str
    }

def delete_workshop_resource(resource_id: str):
    """Deletes a workshop resource by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM workshop_resources WHERE id = %s", (resource_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return {"success": deleted, "id": resource_id}

# --- DAILY ATTENDANCE SYSTEM FUNCTIONS ---

def get_workshop_attendance(workshop_id: str, date: str):
    """Returns attendance records for all enrolled students in a workshop for a specific date."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Fetch all students enrolled in this workshop
    cursor.execute("SELECT id, name, email, phone FROM students WHERE workshop_id = %s", (workshop_id,))
    students_list = [dict(s) for s in cursor.fetchall()]
    
    # Fetch existing attendance for this date
    cursor.execute("SELECT * FROM workshop_attendance WHERE workshop_id = %s AND date = %s", (workshop_id, date))
    att_rows = {r['student_id']: dict(r) for r in cursor.fetchall()}
    
    conn.close()
    
    result = []
    for st in students_list:
        att = att_rows.get(st['id'])
        result.append({
            "student_id": st['id'],
            "name": st['name'],
            "email": st['email'],
            "phone": st['phone'],
            "date": date,
            "status": att['status'] if att else "Present"
        })
    return result

def save_workshop_attendance(workshop_id: str, date: str, attendance_records: list):
    """Saves or updates daily attendance for students in a workshop."""
    date_now = datetime.now().strftime("%Y-%m-%d %H:%M")
    conn = get_connection()
    cursor = conn.cursor()
    
    for rec in attendance_records:
        st_id = rec.get('student_id')
        st_name = rec.get('name', '')
        st_status = rec.get('status', 'Present')
        att_id = f"att-{workshop_id}-{st_id}-{date}"
        
        cursor.execute("""
        INSERT INTO workshop_attendance (id, workshop_id, student_id, student_name, date, status, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT(id) DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at
        """, (att_id, workshop_id, st_id, st_name, date, st_status, date_now))
        
    conn.commit()
    conn.close()
    return {"success": True, "workshop_id": workshop_id, "date": date, "count": len(attendance_records)}


# --- AI TEST MAKER & ONLINE TEST FUNCTIONS ---

def get_workshop_tests(workshop_id: str, for_student: bool = False):
    """Returns tests for a workshop. If for_student is True, filters only Published tests."""
    conn = get_connection()
    cursor = conn.cursor()
    if for_student:
        cursor.execute("SELECT * FROM tests WHERE workshop_id = %s AND status = 'Published' ORDER BY created_at DESC", (workshop_id,))
    else:
        cursor.execute("SELECT * FROM tests WHERE workshop_id = %s ORDER BY created_at DESC", (workshop_id,))
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for r in rows:
        item = dict(r)
        if item.get('questions_json'):
            try:
                item['questions'] = json.loads(item['questions_json'])
            except Exception:
                item['questions'] = []
        else:
            item['questions'] = []
        result.append(item)
    return result

def save_test(workshop_id: str, title: str, description: str, level: str, type: str, duration_mins: int, total_questions: int, questions: list, status: str = 'Draft', is_live: int = 0, test_id: str = None):
    """Creates or updates a workshop test."""
    import time as time_module
    tid = test_id if test_id else f"test-{int(time_module.time() * 1000) % 1000000}"
    date_now = datetime.now().strftime("%Y-%m-%d %H:%M")
    q_json = json.dumps(questions)
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO tests (id, workshop_id, title, description, level, type, duration_mins, total_questions, questions_json, status, is_live, created_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT(id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        level = EXCLUDED.level,
        type = EXCLUDED.type,
        duration_mins = EXCLUDED.duration_mins,
        total_questions = EXCLUDED.total_questions,
        questions_json = EXCLUDED.questions_json,
        status = EXCLUDED.status,
        is_live = EXCLUDED.is_live
    """, (tid, workshop_id, title, description or '', level or 'Intermediate', type or 'single_correct',
          int(duration_mins or 15), int(total_questions or len(questions)), q_json, status, int(is_live), date_now))
    conn.commit()
    
    cursor.execute("SELECT * FROM tests WHERE id = %s", (tid,))
    row = cursor.fetchone()
    conn.close()
    
    res = dict(row)
    res['questions'] = json.loads(res['questions_json'])
    return res

def toggle_test_live(test_id: str, is_live: int):
    """Toggles live lock status of a test (1 = Start test live for students, 0 = Lock)."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE tests SET is_live = %s WHERE id = %s", (int(is_live), test_id))
    conn.commit()
    cursor.execute("SELECT * FROM tests WHERE id = %s", (test_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        res = dict(row)
        res['questions'] = json.loads(res['questions_json'])
        return res
    return None

def toggle_test_publish(test_id: str, status: str):
    """Toggles publish status of a test ('Published' vs 'Draft')."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE tests SET status = %s WHERE id = %s", (status, test_id))
    conn.commit()
    cursor.execute("SELECT * FROM tests WHERE id = %s", (test_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        res = dict(row)
        res['questions'] = json.loads(res['questions_json'])
        return res
    return None

def delete_test(test_id: str):
    """Deletes a test by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tests WHERE id = %s", (test_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return {"success": deleted, "id": test_id}

def submit_test_answers(test_id: str, student_email: str, student_name: str, user_answers: dict):
    """
    Evaluates student answers against correct test answers automatically.
    Computes score & percentage, saves submission to DB.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tests WHERE id = %s", (test_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
        
    test = dict(row)
    questions = json.loads(test['questions_json'])
    
    score = 0
    max_score = len(questions)
    detailed_evaluation = []
    
    for q in questions:
        q_id = str(q.get('id'))
        correct_indices = set(q.get('correct_answers', []))
        user_choice = user_answers.get(q_id, [])
        
        if isinstance(user_choice, int):
            user_choice = [user_choice]
        user_choice_set = set(user_choice)
        
        is_correct = (user_choice_set == correct_indices)
        if is_correct:
            score += 1
            
        detailed_evaluation.append({
            "question_id": q_id,
            "question": q.get('question'),
            "user_answers": list(user_choice_set),
            "correct_answers": list(correct_indices),
            "is_correct": is_correct,
            "explanation": q.get('explanation', '')
        })
        
    pct = round((score / max_score * 100) if max_score > 0 else 0, 1)
    sub_id = f"sub-{test_id}-{int(datetime.now().timestamp())}"
    date_now = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    cursor.execute("""
    INSERT INTO test_submissions (id, test_id, workshop_id, student_email, student_name, answers_json, score, max_score, percentage, submitted_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (sub_id, test_id, test['workshop_id'], student_email, student_name, json.dumps(user_answers), score, max_score, pct, date_now))
    
    conn.commit()
    conn.close()
    
    return {
        "submission_id": sub_id,
        "test_id": test_id,
        "workshop_id": test['workshop_id'],
        "score": score,
        "max_score": max_score,
        "percentage": pct,
        "submitted_at": date_now,
        "evaluation": detailed_evaluation
    }

def get_student_test_submissions(student_email: str):
    """Returns past test submissions for a student."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT s.*, t.title as test_title, w.title as workshop_title
    FROM test_submissions s
    LEFT JOIN tests t ON s.test_id = t.id
    LEFT JOIN workshops w ON s.workshop_id = w.id
    WHERE LOWER(s.student_email) = LOWER(%s)
    ORDER BY s.submitted_at DESC
    """, (student_email.strip(),))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_team_members():
    """Returns list of all team members."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM team_members ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def add_team_member(name: str, role: str, image_url: str, linkedin_url: str = ""):
    """Adds a new core team member."""
    conn = get_connection()
    cursor = conn.cursor()
    tm_id = f"tm-{int(datetime.now().timestamp())}"
    date_now = datetime.now().strftime("%Y-%m-%d %H:%M")
    cursor.execute("""
    INSERT INTO team_members (id, name, role, image_url, linkedin_url, created_at)
    VALUES (%s, %s, %s, %s, %s, %s)
    """, (tm_id, name.strip(), role.strip(), image_url.strip(), linkedin_url.strip() if linkedin_url else "", date_now))
    conn.commit()
    conn.close()
    return {"id": tm_id, "name": name, "role": role, "image_url": image_url, "linkedin_url": linkedin_url, "created_at": date_now}

def delete_team_member(tm_id: str):
    """Deletes a team member by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM team_members WHERE id = %s", (tm_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "deleted_id": tm_id}

def end_workshop(workshop_id: str, group_photo_url: str, feedback_prompt: str = ""):
    """
    Marks a workshop as ended/completed.
    Saves group photo URL and custom feedback prompt.
    Automatically posts the group photo to the Media Gallery Activities section!
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT title FROM workshops WHERE id = %s", (workshop_id,))
    row = cursor.fetchone()
    ws_title = row['title'] if row else 'Workshop'

    date_now = datetime.now().strftime("%Y-%m-%d")

    cursor.execute("""
    UPDATE workshops
    SET is_ended = 1, status = 'Completed', group_photo_url = %s, feedback_prompt = %s
    WHERE id = %s
    """, (group_photo_url.strip(), feedback_prompt.strip(), workshop_id))

    # Auto-publish group photo to gallery media for Landing Page Activities showcase
    if group_photo_url.strip():
        media_id = f"media-{int(datetime.now().timestamp())}"
        cursor.execute("""
        INSERT INTO gallery_media (id, title, url, media_type, category, date)
        VALUES (%s, %s, %s, 'image', 'Activities / Workshop', %s)
        """, (media_id, f"{ws_title} - Final Group Photo", group_photo_url.strip(), date_now))

    conn.commit()
    conn.close()
    return {
        "status": "success",
        "workshop_id": workshop_id,
        "is_ended": 1,
        "group_photo_url": group_photo_url,
        "feedback_prompt": feedback_prompt
    }

def submit_workshop_feedback(workshop_id: str, student_email: str, student_name: str, rating: int, feedback_text: str, suggestions: str = ""):
    """Submits student feedback for an ended workshop."""
    conn = get_connection()
    cursor = conn.cursor()
    fb_id = f"fb-{int(datetime.now().timestamp())}"
    date_now = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    cursor.execute("""
    INSERT INTO workshop_feedbacks (id, workshop_id, student_email, student_name, rating, feedback_text, suggestions, submitted_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (fb_id, workshop_id, student_email.strip(), student_name.strip(), rating, feedback_text.strip(), suggestions.strip(), date_now))
    
    conn.commit()
    conn.close()
    return {
        "id": fb_id,
        "workshop_id": workshop_id,
        "student_email": student_email,
        "student_name": student_name,
        "rating": rating,
        "feedback_text": feedback_text,
        "suggestions": suggestions,
        "submitted_at": date_now
    }

def get_workshop_feedbacks(workshop_id: str = None):
    """Fetches submitted feedbacks for a specific workshop or all workshops."""
    conn = get_connection()
    cursor = conn.cursor()
    if workshop_id:
        cursor.execute("""
        SELECT f.*, w.title as workshop_title
        FROM workshop_feedbacks f
        LEFT JOIN workshops w ON f.workshop_id = w.id
        WHERE f.workshop_id = %s
        ORDER BY f.submitted_at DESC
        """, (workshop_id,))
    else:
        cursor.execute("""
        SELECT f.*, w.title as workshop_title
        FROM workshop_feedbacks f
        LEFT JOIN workshops w ON f.workshop_id = w.id
        ORDER BY f.submitted_at DESC
        """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_student_feedbacks(student_email: str):
    """Returns list of workshop IDs for which student has submitted feedback."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT workshop_id FROM workshop_feedbacks WHERE LOWER(student_email) = LOWER(%s)", (student_email.strip(),))
    rows = cursor.fetchall()
    conn.close()
    return [r['workshop_id'] for r in rows]

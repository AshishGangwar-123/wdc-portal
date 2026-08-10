from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sys
import os
sys.path.append(os.path.dirname(__file__))

from agent import process_agent_query
from database import (
    get_all_workshops,
    get_all_notifications,
    get_all_students,
    register_student_db,
    add_workshop,
    delete_workshop,
    add_notification,
    delete_notification,
    get_club_stats,
    get_workshop_by_id,
    update_student_access,
    student_login,
    get_student_dashboard_data,
    get_workshop_resources,
    add_workshop_resource,
    delete_workshop_resource,
    get_workshop_attendance,
    save_workshop_attendance,
    get_workshop_tests,
    save_test,
    toggle_test_live,
    toggle_test_publish,
    delete_test,
    submit_test_answers,
    get_student_test_submissions,
    get_all_team_members,
    add_team_member,
    delete_team_member,
    end_workshop,
    submit_workshop_feedback,
    get_workshop_feedbacks,
    get_student_feedbacks,
)
from test_generator import generate_ai_test_questions

app = FastAPI(
    title="Web Development Club (WDC) AI Agent API",
    description="FastAPI & SQLite Backend for WDC AI Concierge & Admin Panel with Full CRUD"
)

# CORS middleware setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class AgentChatRequest(BaseModel):
    user_name: str = "Guest"
    query: str
    current_context: str = "main_menu"

class StudentRegistrationRequest(BaseModel):
    name: str
    email: str
    phone: str = ""
    workshop_id: str = "ws-101"

class AddWorkshopRequest(BaseModel):
    title: str
    mentor: str = "WDC Lead Mentor"
    date: str
    time: str = "18:00 IST"
    seats: int = 50
    topics: str = ""  # Comma-separated string OR list
    color: str = "#00f2fe"

class AddNotificationRequest(BaseModel):
    title: str
    category: str = "Announcement"
    related_workshop_id: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None

class StudentAccessUpdateRequest(BaseModel):
    allowed: int = 1
    password: Optional[str] = ""

class UserLoginRequest(BaseModel):
    email: str
    password: str

class AddResourceRequest(BaseModel):
    title: str
    resource_type: str = "Notes"
    link_url: Optional[str] = ""
    description: Optional[str] = ""

class AttendanceSaveRequest(BaseModel):
    date: str
    records: List[dict]

class AITestGenerateRequest(BaseModel):
    topic: str
    num_questions: int = 5
    level: str = "Intermediate"
    question_type: str = "single_correct"

class SaveTestRequest(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = ""
    level: Optional[str] = "Intermediate"
    type: Optional[str] = "single_correct"
    duration_mins: Optional[int] = 15
    total_questions: Optional[int] = 5
    questions: List[dict]
    status: Optional[str] = "Draft"
    is_live: Optional[int] = 0

class ToggleLiveRequest(BaseModel):
    is_live: int

class TogglePublishRequest(BaseModel):
    status: str

class TestSubmitRequest(BaseModel):
    student_email: str
    student_name: Optional[str] = "Student"
    answers: dict

# --- Routes ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "club": "Web Development Club (WDC)",
        "database": "SQLite (wdc_portal.db)",
        "version": "3.0",
        "endpoints": {
            "agent_chat": "POST /api/agent/chat",
            "workshops": "GET/POST /api/workshops",
            "delete_workshop": "DELETE /api/workshops/{id}",
            "notifications": "GET/POST /api/notifications",
            "delete_notification": "DELETE /api/notifications/{id}",
            "students": "GET /api/students",
            "register": "POST /api/students/register",
            "stats": "GET /api/stats",
        }
    }

@app.post("/api/agent/chat")
async def chat_with_agent(req: AgentChatRequest):
    """AI Concierge Chat — reads all live DB data to answer user queries."""
    result = process_agent_query(user_name=req.user_name, query=req.query)
    return result

# --- WORKSHOPS CRUD ---

@app.get("/api/workshops")
def fetch_workshops():
    """Returns all workshops from SQLite DB (live, always fresh)."""
    return get_all_workshops()

@app.get("/api/workshops/{workshop_id}")
def fetch_workshop_by_id(workshop_id: str):
    """Returns a single workshop by ID."""
    ws = get_workshop_by_id(workshop_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return ws

@app.post("/api/workshops")
def create_workshop(req: AddWorkshopRequest):
    """Creates a new workshop in SQLite DB. Admin panel uses this."""
    if not req.title or not req.date:
        raise HTTPException(status_code=400, detail="Title and date are required")
    
    result = add_workshop(
        title=req.title,
        mentor=req.mentor,
        date=req.date,
        time=req.time,
        seats=req.seats,
        topics=req.topics,
        color=req.color,
    )
    return result

@app.delete("/api/workshops/{workshop_id}")
def remove_workshop(workshop_id: str):
    """Deletes a workshop by ID from SQLite DB."""
    success = delete_workshop(workshop_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return {"success": True, "message": f"Workshop {workshop_id} deleted from DB"}

# --- NOTIFICATIONS CRUD ---

@app.get("/api/notifications")
def fetch_notifications():
    """Returns all notifications from SQLite DB (live, always fresh)."""
    return get_all_notifications()

@app.post("/api/notifications")
def create_notification(req: AddNotificationRequest):
    """Creates a new notification in SQLite DB. Admin panel uses this."""
    if not req.title:
        raise HTTPException(status_code=400, detail="Title is required")
    
    notif_id = add_notification(
        title=req.title,
        category=req.category,
        related_workshop_id=req.related_workshop_id,
        date=req.date,
        time=req.time,
    )
    return {"success": True, "id": notif_id, "message": "Notification broadcast sent!"}

@app.delete("/api/notifications/{notif_id}")
def remove_notification(notif_id: str):
    """Deletes a notification by ID from SQLite DB."""
    success = delete_notification(notif_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True, "message": f"Notification {notif_id} deleted from DB"}

# --- STUDENTS CRUD ---

@app.get("/api/students")
def fetch_students(workshop_id: str = "all"):
    """Returns all enrolled students from SQLite DB."""
    return get_all_students(workshop_id)

@app.post("/api/students/register")
def register_student(req: StudentRegistrationRequest):
    """Registers a student for a workshop in SQLite DB."""
    result = register_student_db(req.name, req.email, req.phone, req.workshop_id)
    if not result:
        raise HTTPException(status_code=400, detail="Workshop not found or registration failed")
    return result

from database import (
    get_all_workshops,
    get_all_notifications,
    get_all_students,
    register_student_db,
    add_workshop,
    delete_workshop,
    add_notification,
    delete_notification,
    get_club_stats,
    get_workshop_by_id,
    add_subscriber,
    get_all_subscribers,
    get_all_gallery_media,
    add_gallery_media,
    delete_gallery_media,
)

class SubscribeRequest(BaseModel):
    email: str

class AddGalleryMediaRequest(BaseModel):
    title: str
    url: str
    media_type: str = "video"
    category: str = "Highlight"

# --- STATS ---

@app.get("/api/stats")
def fetch_stats():
    """Returns aggregate WDC club stats from DB."""
    return get_club_stats()

@app.post("/api/subscribe")
def subscribe_email_route(req: SubscribeRequest):
    """Subscribes an email address to receive upcoming workshop & notification alerts."""
    if not req.email or "@" not in req.email:
        raise HTTPException(status_code=400, detail="Invalid email address")
    return add_subscriber(req.email)

@app.get("/api/subscribers")
def fetch_subscribers():
    """Returns all email subscribers from DB."""
    return get_all_subscribers()

# --- GALLERY MEDIA ---

@app.get("/api/gallery")
def fetch_gallery_media():
    """Returns all gallery media items from DB."""
    return get_all_gallery_media()

@app.post("/api/gallery")
def create_gallery_media(req: AddGalleryMediaRequest):
    """Adds a new gallery media item (video or image URL) to DB."""
    if not req.url or not req.title:
        raise HTTPException(status_code=400, detail="Title and URL are required")
    return add_gallery_media(req.title, req.url, req.media_type, req.category)

@app.delete("/api/gallery/{media_id}")
def remove_gallery_media(media_id: str):
    """Deletes a gallery media item by ID."""
    return delete_gallery_media(media_id)

# --- STUDENT ACCESS & WORKSHOP RESOURCES ROUTES ---

@app.put("/api/students/{student_id}/access")
def update_access(student_id: str, req: StudentAccessUpdateRequest):
    """Admin endpoint to allow/disallow workshop access and set student password."""
    result = update_student_access(student_id, req.allowed, req.password or "")
    if not result:
        raise HTTPException(status_code=404, detail="Student registration not found")
    return result

@app.post("/api/user/login")
def login_user(req: UserLoginRequest):
    """Student login endpoint using email and admin-assigned password."""
    result = student_login(req.email, req.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid email or password. Please contact Admin if access is not yet allowed.")
    return result

@app.get("/api/user/dashboard")
def fetch_user_dashboard(email: str):
    """Returns student's registered workshops and allowed workshop resources."""
    if not email:
        raise HTTPException(status_code=400, detail="Email query parameter is required")
    return get_student_dashboard_data(email)

@app.get("/api/workshops/{workshop_id}/resources")
def fetch_workshop_resources(workshop_id: str):
    """Returns all resources (notes, tests, code) for a workshop."""
    return get_workshop_resources(workshop_id)

@app.post("/api/workshops/{workshop_id}/resources")
def create_workshop_resource(workshop_id: str, req: AddResourceRequest):
    """Admin endpoint to add a resource (Notes, Test, Assignment, Video, Code) to a workshop."""
    if not req.title:
        raise HTTPException(status_code=400, detail="Resource title is required")
    return add_workshop_resource(
        workshop_id=workshop_id,
        title=req.title,
        resource_type=req.resource_type,
        link_url=req.link_url or "",
        description=req.description or ""
    )

@app.delete("/api/workshops/resources/{resource_id}")
def remove_workshop_resource(resource_id: str):
    """Admin endpoint to delete a workshop resource."""
    return delete_workshop_resource(resource_id)

# --- DAILY ATTENDANCE SYSTEM ENDPOINTS ---

@app.get("/api/workshops/{workshop_id}/attendance")
def fetch_attendance(workshop_id: str, date: str):
    """Admin endpoint to fetch daily student attendance for a workshop on a date."""
    if not date:
        raise HTTPException(status_code=400, detail="Date parameter required (YYYY-MM-DD)")
    return get_workshop_attendance(workshop_id, date)

@app.post("/api/workshops/{workshop_id}/attendance")
def save_attendance(workshop_id: str, req: AttendanceSaveRequest):
    """Admin endpoint to save student attendance for a workshop on a date."""
    return save_workshop_attendance(workshop_id, req.date, req.records)

# --- AI TEST MAKER ASSISTANT & ONLINE TEST ENDPOINTS ---

@app.post("/api/ai/generate-test")
def generate_test_ai(req: AITestGenerateRequest):
    """
    AI Assistant Endpoint: Uses LangChain PromptTemplate to generate
    structured test questions with 4 options and marked correct answer keys.
    """
    questions = generate_ai_test_questions(
        topic=req.topic,
        num_questions=req.num_questions,
        level=req.level,
        question_type=req.question_type
    )
    return {
        "topic": req.topic,
        "num_questions": len(questions),
        "level": req.level,
        "question_type": req.question_type,
        "questions": questions
    }

@app.get("/api/workshops/{workshop_id}/tests")
def fetch_workshop_tests(workshop_id: str, for_student: bool = False):
    """Fetches tests for a workshop."""
    return get_workshop_tests(workshop_id, for_student=for_student)

@app.post("/api/workshops/{workshop_id}/tests")
def create_or_save_test(workshop_id: str, req: SaveTestRequest):
    """Admin endpoint to save/publish a test with questions and answer keys."""
    if not req.title:
        raise HTTPException(status_code=400, detail="Test title is required")
    return save_test(
        workshop_id=workshop_id,
        title=req.title,
        description=req.description or "",
        level=req.level or "Intermediate",
        type=req.type or "single_correct",
        duration_mins=req.duration_mins or 15,
        total_questions=req.total_questions or len(req.questions),
        questions=req.questions,
        status=req.status or "Draft",
        is_live=req.is_live or 0,
        test_id=req.id
    )

@app.put("/api/tests/{test_id}/toggle-live")
def set_test_live(test_id: str, req: ToggleLiveRequest):
    """Admin endpoint to toggle 'Start Test (Go Live)' switch."""
    res = toggle_test_live(test_id, req.is_live)
    if not res:
        raise HTTPException(status_code=404, detail="Test not found")
    return res

@app.put("/api/tests/{test_id}/toggle-publish")
def set_test_publish(test_id: str, req: TogglePublishRequest):
    """Admin endpoint to publish or draft a test."""
    res = toggle_test_publish(test_id, req.status)
    if not res:
        raise HTTPException(status_code=404, detail="Test not found")
    return res

@app.delete("/api/tests/{test_id}")
def remove_test(test_id: str):
    """Admin endpoint to delete a test."""
    return delete_test(test_id)

@app.post("/api/tests/{test_id}/submit")
def submit_test(test_id: str, req: TestSubmitRequest):
    """
    Student endpoint to submit test answers.
    Evaluates answers automatically against correct key and returns score percentage.
    """
    res = submit_test_answers(test_id, req.student_email, req.student_name or "Student", req.answers)
    if not res:
        raise HTTPException(status_code=404, detail="Test not found or evaluation failed")
    return res

@app.get("/api/user/test-submissions")
def fetch_student_submissions(email: str):
    """Returns student test submission history."""
    return get_student_test_submissions(email)

class TeamMemberRequest(BaseModel):
    name: str
    role: str
    image_url: str
    linkedin_url: Optional[str] = ""

@app.get("/api/team")
def fetch_team_members():
    """Returns list of WDC core team members for 3D Taas Playing Cards Deck."""
    return get_all_team_members()

@app.post("/api/team")
def create_team_member(req: TeamMemberRequest):
    """Admin endpoint to add a new core team member."""
    if not req.name or not req.role or not req.image_url:
        raise HTTPException(status_code=400, detail="Name, role, and image_url are required")
    return add_team_member(req.name, req.role, req.image_url, req.linkedin_url or "")

@app.delete("/api/team/{tm_id}")
def remove_team_member(tm_id: str):
    """Admin endpoint to delete a team member."""
    return delete_team_member(tm_id)

class EndWorkshopRequest(BaseModel):
    group_photo_url: str
    feedback_prompt: Optional[str] = ""

class WorkshopFeedbackRequest(BaseModel):
    student_email: str
    student_name: Optional[str] = "Student"
    rating: Optional[int] = 5
    feedback_text: str
    suggestions: Optional[str] = ""

@app.post("/api/workshops/{workshop_id}/end")
def end_workshop_endpoint(workshop_id: str, req: EndWorkshopRequest):
    """Admin endpoint to end/complete a workshop, save group photo, and publish feedback form."""
    return end_workshop(workshop_id, req.group_photo_url, req.feedback_prompt or "")

@app.post("/api/workshops/{workshop_id}/feedback")
def submit_feedback_endpoint(workshop_id: str, req: WorkshopFeedbackRequest):
    """Student endpoint to submit feedback & suggestions for an ended workshop."""
    if not req.student_email or not req.feedback_text:
        raise HTTPException(status_code=400, detail="Student email and feedback text are required")
    return submit_workshop_feedback(
        workshop_id=workshop_id,
        student_email=req.student_email,
        student_name=req.student_name or "Student",
        rating=req.rating or 5,
        feedback_text=req.feedback_text,
        suggestions=req.suggestions or ""
    )

@app.get("/api/workshops/{workshop_id}/feedbacks")
def fetch_workshop_feedbacks(workshop_id: str):
    """Returns all submitted student feedbacks for a workshop."""
    return get_workshop_feedbacks(workshop_id)

@app.get("/api/student/submitted-feedbacks")
def fetch_student_submitted_feedbacks(email: str):
    """Returns list of workshop IDs for which student has submitted feedback."""
    return get_student_feedbacks(email)

# --- ADMIN AUTHENTICATION ENDPOINTS ---

class AdminLoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/admin/login")
def admin_login_endpoint(req: AdminLoginRequest):
    """Secure Backend Admin Authentication Endpoint."""
    env_user = os.getenv("ADMIN_USERNAME", "admin")
    env_pass = os.getenv("ADMIN_PASSWORD", "wdcadmin2026")
    
    if req.username.strip() == env_user and req.password.strip() == env_pass:
        import secrets
        token = f"wdc_admin_token_{secrets.token_hex(16)}"
        return {
            "authenticated": True,
            "token": token,
            "message": "Admin Login Successful!"
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid Admin User ID or Password!")

@app.get("/api/admin/verify")
def admin_verify_endpoint(token: str):
    """Verifies existing admin session token."""
    if token and token.startswith("wdc_admin_token_"):
        return {"valid": True}
    return {"valid": False}

# --- SINGLE SERVICE FULL-STACK DEPLOYMENT (Serve React Frontend Dist) ---
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        target_file = os.path.join(dist_dir, full_path)
        if os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)



from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.preferences.router import router as preferences_router
from app.embedded_apps.router import router as apps_router
from app.auth.jwt import verify_token

app = FastAPI(title="App Embedding Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(preferences_router, prefix="/api/preferences", tags=["preferences"])
app.include_router(apps_router, prefix="/api/apps", tags=["embedded-apps"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/protected")
async def protected_route(current_user=Depends(verify_token)):
    return {"message": "This is a protected route", "user": current_user}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
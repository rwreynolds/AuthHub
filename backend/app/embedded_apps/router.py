# app/embedded_apps/router.py
from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt import verify_token
from app.embedded_apps.models import EmbeddedApp
from typing import List

router = APIRouter()

# Mock embedded apps database
available_apps = [
    {
        "id": "app1",
        "name": "Dashboard App",
        "description": "Main dashboard application",
        "url": "/embedded/dashboard",
        "icon": "dashboard"
    },
    {
        "id": "app2",
        "name": "Analytics App",
        "description": "Data analytics application",
        "url": "/embedded/analytics",
        "icon": "analytics"
    },
    {
        "id": "app3",
        "name": "Settings App",
        "description": "User settings application",
        "url": "/embedded/settings",
        "icon": "settings"
    }
]


@router.get("/", response_model=List[EmbeddedApp])
async def get_available_apps(current_user=Depends(verify_token)):
    """Get all available embedded apps"""
    return available_apps


@router.get("/{app_id}", response_model=EmbeddedApp)
async def get_app_by_id(app_id: str, current_user=Depends(verify_token)):
    """Get specific embedded app details"""
    for app in available_apps:
        if app["id"] == app_id:
            return app

    raise HTTPException(
        status_code=404,
        detail=f"App with id {app_id} not found"
    )
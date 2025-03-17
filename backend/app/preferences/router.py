# app/preferences/router.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.jwt import verify_token
from app.preferences.models import UserPreference, UpdatePreference
from app.auth.router import fake_users_db  # Using the mock DB from auth module

router = APIRouter()

# Mock preferences database
fake_preferences_db = {
    1: {
        "user_id": 1,
        "preferred_app": "app1",
        "theme": "light",
        "language": "en"
    }
}


@router.get("/me", response_model=UserPreference)
async def get_my_preferences(current_user=Depends(verify_token)):
    user_id = current_user.user_id

    # Check if preferences exist
    if user_id not in fake_preferences_db:
        # Create default preferences
        fake_preferences_db[user_id] = {
            "user_id": user_id,
            "preferred_app": "app1",  # Default app
            "theme": "light",
            "language": "en"
        }

    return fake_preferences_db[user_id]


@router.put("/me", response_model=UserPreference)
async def update_preferences(
        preferences: UpdatePreference,
        current_user=Depends(verify_token)
):
    user_id = current_user.user_id

    # Ensure preferences exist
    if user_id not in fake_preferences_db:
        fake_preferences_db[user_id] = {
            "user_id": user_id,
            "preferred_app": "app1",
            "theme": "light",
            "language": "en"
        }

    # Update only provided fields
    current_prefs = fake_preferences_db[user_id]

    if preferences.preferred_app is not None:
        current_prefs["preferred_app"] = preferences.preferred_app

    if preferences.theme is not None:
        current_prefs["theme"] = preferences.theme

    if preferences.language is not None:
        current_prefs["language"] = preferences.language

    # In a real app, save to database here
    fake_preferences_db[user_id] = current_prefs

    # Update user's preferred app in the user record too
    if current_user.username in fake_users_db and preferences.preferred_app:
        fake_users_db[current_user.username]["preferred_app"] = preferences.preferred_app

    return current_prefs
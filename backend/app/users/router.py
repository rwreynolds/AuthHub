# app/users/router.py
from fastapi import APIRouter, Depends, HTTPException
from app.auth.jwt import verify_token
from app.users.models import UserProfile, UserProfileUpdate
from app.auth.router import fake_users_db  # Using the mock DB from auth module

router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(current_user=Depends(verify_token)):
    """Get current user profile"""
    username = current_user.username

    if username not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")

    user = fake_users_db[username]

    # Create profile with needed fields
    profile = {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "display_name": user.get("display_name", user["username"]),
        "avatar": user.get("avatar", None)
    }

    return profile


@router.put("/me", response_model=UserProfile)
async def update_user_profile(
        profile_update: UserProfileUpdate,
        current_user=Depends(verify_token)
):
    """Update current user profile"""
    username = current_user.username

    if username not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")

    user = fake_users_db[username]

    # Update only provided fields
    if profile_update.display_name is not None:
        user["display_name"] = profile_update.display_name

    if profile_update.avatar is not None:
        user["avatar"] = profile_update.avatar

    # In a real app, save to database here
    fake_users_db[username] = user

    # Return updated profile
    return {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "display_name": user.get("display_name", user["username"]),
        "avatar": user.get("avatar", None)
    }
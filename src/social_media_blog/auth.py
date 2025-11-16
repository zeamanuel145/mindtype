from supabase import create_client, Client
from src.social_media_blog.chat_models import LoginRequest
from dotenv import load_dotenv
from fastapi import HTTPException
from .db_handler import logger
import os

load_dotenv()

try:
    logger.info("Initializing Supabase client...")
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(supabase_url, supabase_key)
    logger.info("Supabase client initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {e}")
    supabase = None

async def login(login: LoginRequest):
    try:
        account = login.email
        password = login.password
        logger.info(f"Checking for user : {account}")
        check = supabase.auth.admin.list_users()
        user_exists = any(account in check[user].email for user in range(len(check)))
        if user_exists:
            logger.info("User exists, proceeding to login")
            user = supabase.auth.sign_in_with_password({
                "email": account,
                "password": password
            })
            logger.info("User logged in successfully")
        else:
            logger.info("User does not exist. Raising exception.")
            raise HTTPException(status_code=404, detail="User not found.")
            
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed.")

async def signup(user: LoginRequest):
    logger.info(f"Signing up new user: {user.email}")
    try:
        auth_response = supabase.auth.sign_up({
            "email":user.email,
            "password":user.password
        })
        logger.info("User signed up successfully")
        logger.info("Adding user details to the database")
        supabase.table("Users").insert({
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }).execute()
        logger.info("User details added to the database successfully")
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Signup failed.")
    
async def logout():
    try:
        logger.info("Logging out user.")
        response = supabase.auth.sign_out()
        logger.info("User logged out successfully")
    except Exception as e:
        logger.error(f"Logout error: {e}")
        raise HTTPException(status_code=500, detail="Logout failed.")

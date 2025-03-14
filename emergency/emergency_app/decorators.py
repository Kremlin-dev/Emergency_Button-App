from django.http import JsonResponse
from functools import wraps

def admin_required(view_func):
    """Decorator to check if the admin is authenticated via session"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.session.get("is_admin"):
            return JsonResponse({"error": "Unauthorized access. Please log in as admin."}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper

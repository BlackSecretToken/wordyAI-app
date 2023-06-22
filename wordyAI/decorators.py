from django.shortcuts import redirect, render
from functools import wraps
from .constant import *
from home.models import Users
from .utils import *

def login_required(function=None, session_key='is_login'):
    def decorator(view_func):
        @wraps(view_func)
        def f(request, *args, **kwargs):
            if session_key in request.session:
                user = Users.objects.get(email = request.session.get('email'))
                if request.session.get('is_login') == Role.Admin.value:
                    return redirect('superAdmin:dashboard_view')
                if user.is_first:
                    context = {}
                    context = default_context(request, context)
                    return render(request, 'dashboard/dashboard_first_login.html', context)
                else:
                    return view_func(request, *args, **kwargs)
            return redirect('home:login_view')
        return f
    if function is not None:
        return decorator(function)
    return decorator

def admin_login_required(function=None, session_key='is_login'):
    def decorator(view_func):
        @wraps(view_func)
        def f(request, *args, **kwargs):
            if request.session.get(session_key) == Role.Admin.value:
                return view_func(request, *args, **kwargs)
            return redirect('home:login_view')
        return f
    if function is not None:
        return decorator(function)
    return decorator
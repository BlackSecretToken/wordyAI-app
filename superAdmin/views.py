from django.shortcuts import render
from wordyAI.decorators import *
from wordyAI.utils import *
# Create your views here.
@admin_login_required
def dashboard(request):
    context = {}
    context = default_context(request, context)
    return render(request, 'admin/dashboard/dashboard.html', context)
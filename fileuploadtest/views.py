
from django.http import HttpResponse
from django.shortcuts import render, redirect
from .forms import *
 
# Create your views here.
 
 
def hotel_image_view(request):
 
    if request.method == 'POST':
        form = HotelForm(request.POST, request.FILES)
 
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = HotelForm()
    return render(request, 'test/hotel_image_form.html', {'form': form})

def my_view(request):
    context = {}
    mymodel = MyModel.objects.get(id=1)
    if str(mymodel.image) == '':
        context['avatar']='../static/assets/images/avatars/default.png'
    else:   
        context['avatar'] = '../media/'+ str(mymodel.image)
    return render(request, 'test/my_template.html', context) 

def upload_image(request):
    if request.method == 'POST':
        image = request.FILES.get('image', None)
        if image is not None:
            mymodel = MyModel.objects.get(id = 1)
            mymodel.image = image
            mymodel.save()
            return redirect('test:my_view')
    return render(request, 'test/my_template.html')
 
def success(request):
    return HttpResponse('successfully uploaded')
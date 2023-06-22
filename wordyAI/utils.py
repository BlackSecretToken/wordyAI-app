from home.models import Users
from .constant import *
def default_context(request, context):
    email = request.session.get('email')
    user = Users.objects.get(email = email)
    context['username'] = user.username
    context['email'] = user.email
    context['phone'] = user.phone
    context['address'] = user.address
    context['firstname'] = user.firstname
    context['state'] = user.state
    context['timezone'] = user.timezone
    context['country'] = user.country
    context['lastname'] = user.lastname
    context['organization'] = user.organization
    context['zipcode'] = user.zipcode
    context['language'] = user.language
    context['currency'] = user.currency
    context['phoneAlias'] = user.phone[-4:]

    if str(user.avatar) == '':
        context['avatar']='../static/assets/images/avatars/default.png'
    else:   
        context['avatar'] = 'media/'+ str(user.avatar)
    count = request.path.count('/')
    for i in range(count-1):
        context['avatar'] = '../' + context['avatar']
    
    if user.role == Role.User.value:
        context['role'] = Role_User
    else:
         context['role'] = Role_Admin
    return context
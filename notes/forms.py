from django.forms import ModelForm
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm


from .models import User

class RegistrationForm(UserCreationForm):
    
    class Meta(UserCreationForm.Meta):
        model = User
        fiels = UserCreationForm.Meta.fields

class LoginForm(AuthenticationForm):
    pass

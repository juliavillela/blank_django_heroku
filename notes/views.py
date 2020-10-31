
import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, HttpResponse, HttpResponseRedirect, reverse
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError

from .models import Note, User
# Create your views here.

@login_required
def index(request):
    if request.user.is_authenticated:
       context = {"notes": request.user.notes.all()}
    else:
        context={"notes":""}
    return render(request, "notes/index.html", context)

def login_view(request):
    if request.method == "POST":

        #attempt to sing in user
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        #check if successfull
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return HttpResponse("ERROR, user not found")
    else:
        return render(request, "notes/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        try:
            user = User.objects.create_user(username, password)
            user.save()
        except IntegrityError:
            return HttpResponse("ERROR")

        login(request, user)
        return HttpResponseRedirect(reverse("index"))            
    else:
        return render(request, "notes/register.html")

@csrf_exempt
def create(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            note = Note.objects.create(user=request.user, title=data["title"], content=data["content"])
            note.save()
            return JsonResponse(note.serialize())
        except IntegrityError:
            return JsonResponse({"error":"Note could not be created"}, status=404)
    else:
        return JsonResponse({"error":"Method should be POST"}, status=404)


@csrf_exempt
def note(request, note_id):
    try:
        note = Note.objects.get(user=request.user, pk = note_id)
    except Note.DoesNotExist:
        return JsonResponse({"error":"Note not found"}, status=404)
    
    #return contents 
    if request.method ==  "GET":
        return JsonResponse(note.serialize())

    #update note content
    elif request.method == "PUT":
        try:
            data = json.loads(request.body)

            #always update content
            note.content = data["content"]

            #update title and description if required
            if data.get("title") is not None:
                note.title = data["title"]
            if data.get("descrition") is not None:
                note.description = data["description"]
            note.save()
            return HttpResponse(status=204)
        except:
            return JsonResponse({"error": "something went wrong"}, status=404)


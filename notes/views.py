
import json
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt

from .models import Note
# Create your views here.

def index(request):
    notes = Note.objects.all()
    return render(request, "notes/index.html", {
        "notes": notes
    })


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
            print(data)

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


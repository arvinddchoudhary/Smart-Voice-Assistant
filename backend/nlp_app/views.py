import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import spacy
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)

nlp = spacy.load("en_core_web_sm")

def homepage(request):  
    return HttpResponse("Welcome to the Smart Voice Assistant API.")

@csrf_exempt
def process_voice(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            received_text = data.get("text", "")
            logger.info("Received text: %s", received_text)

            
            extracted_data = extract_action_items(received_text)

            response_data = {
                "status": "success",
                "message": "Processed successfully",
                "transcription": received_text,
                "action_items": extracted_data.get("action_items", []),
                "meeting_details": {
                    "dates": extracted_data.get("meeting_dates", []),
                    "key_points": extracted_data.get("key_points", [])
                },
                "summary": "Meeting scheduled with extracted details."
            }

            logger.info("Response Data: %s", response_data)
            return JsonResponse(response_data)

        except json.JSONDecodeError:
            logger.error("Invalid JSON format")
            return JsonResponse({"status": "error", "message": "Invalid JSON format"}, status=400)

    logger.error("Invalid request method")
    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)

def extract_action_items(text):
    """Extract action items like tasks, meeting dates, and key points."""
    doc = nlp(text)
    action_items = []
    dates = []
    key_points = []

    for ent in doc.ents:
        if ent.label_ in ["DATE", "TIME"]:
            dates.append(ent.text)

    for token in doc:
        if token.dep_ in ["xcomp", "advcl"]:
            action_items.append(token.text)

    sentences = [sent.text for sent in doc.sents if "meeting" in sent.text.lower()]
    key_points.extend(sentences[: min(3, len(sentences))])  # Capture first 3 key points

    return {
        "action_items": action_items if action_items else ["No action items found"],
        "meeting_dates": dates if dates else ["No date found"],
        "key_points": key_points if key_points else ["No key points found"]
    }

def process_text(request):
    text = request.GET.get("text", "").strip()
    if not text:
        return JsonResponse({"status": "error", "message": "No text provided"}, status=400)

    extracted_data = extract_action_items(text)

    response_data = {
        "status": "success",
        "message": "Processed successfully",
        "transcription": text,
        "action_items": extracted_data.get("action_items", []),
        "meeting_details": {
            "dates": extracted_data.get("meeting_dates", []),
            "key_points": extracted_data.get("key_points", [])
        },
        "summary": "Meeting scheduled with extracted details."
    }

    return JsonResponse(response_data, status=200)
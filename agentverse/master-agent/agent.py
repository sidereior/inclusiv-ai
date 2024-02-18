import requests
import json
from pydantic import BaseModel, Field

# Assuming OPENAI_API_KEY and other constants are defined elsewhere or imported
OPENAI_API_KEY = "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"
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
MODEL_ENGINE = "gpt-3.5-turbo-0125"

class UserRequest(BaseModel):
    user_input: str = Field(description="The user's spoken input.")

class UserRequestResponse(BaseModel):
    json_schema: dict
    spoken_sentence: str

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {OPENAI_API_KEY}"
}

json_string = '''
{
    "user_info": {
        "colorblind": "n/a OR red-green OR blue-black",
        "adhd": "true OR false",
        "dyslexia": "true OR false"
    },
    "user_requests": ["explainPage", "magnifyPage", "unMagnifyPage", "narratePage"]
}
'''

class Request(Model):
    text: str

class Error(Model):
    text: str

class Data(Model):
    value: float
    unit: str
    timestamp: str
    confidence: float
    source: str
    notes: str

def get_completion(user_input: str):
    data = {
        "model": MODEL_ENGINE,
        "messages": [
            {
                "role": "system",
                "content": "You are an AI trained to classify user requests for accessibility adjustments and generate appropriate JSON structures. Given a user's request, determine for each of the accessibility needs the value that is to be stored for it in json. Note that the user may not address all parts of the json query, and in this case assume what the value is (not addressing means they do not have disability). Here is the json format to follow: " + json_string
            },
            {
                "role": "user",
                "content": user_input
            }
        ]
    }

    response = requests.post(OPENAI_URL, headers=HEADERS, json=data)
    if response.status_code == 200:
        response_data = response.json()
        json_schema = response_data['choices'][0]['message']['content']
        spoken_sentence = "Your request has been processed."
        return UserRequestResponse(json_schema=json.loads(json_schema), spoken_sentence=spoken_sentence)
    else:
        print("Failed to process your request.")
        return Error(text="Sorry, I wasn't able to answer your request this time. Feel free to try again.")

@agent.on_message(model=UserRequest)
async def handle_request(ctx: Context, sender: str, request: UserRequest):
    ctx.logger.info(f"Got request from {sender}: {request.user_input}")
    response = get_completion(request.user_input)
    await ctx.send(sender, response)

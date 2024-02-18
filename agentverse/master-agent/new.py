import requests
from pydantic import BaseModel, Field
from ai_engine import UAgentResponse, UAgentResponseType

class UserRequest(BaseModel):
    text: str = Field(description="The user's request text.")

generic_protocol = Protocol("GenericProtocol")

@generic_protocol.on_message(model=UserRequest, replies={UAgentResponse})
async def process_user_request(ctx: Context, sender: str, msg: UserRequest):
    # Sample API key and URL for demonstration purposes
    api_key = "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"
    ai_service_url = "https://api.openai.com/v1/chat/completions"

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    # Adjust the message content based on your processing logic
    data = {
        "model": "gpt-model-identifier",
        "messages": [
            {
                "role": "system",
                "content": "System initialization message."
            },
            {
                "role": "user",
                "content": msg.text
            }
        ]
    }

    response = requests.post(ai_service_url, headers=headers, json=data)

    # Default response structure in case of failure
    json_string = {
        "user_info": {
            "colorblind": "n/a",
            "adhd": "false",
            "dyslexia": "false"
        },
        "user_requests": []
    }

    if response.status_code == 200:
        # Example response handling - customize as per your logic
        response_text = "Here's how I've adjusted the webpage to better suit your needs."
        
        # Example logic to fill in the JSON structure based on the user's request
        # This part should be replaced with your logic to analyze the response and user's request
        json_string["user_info"]["colorblind"] = "red-blue"  # Example based on user's request
        json_string["user_info"]["dyslexia"] = "true"
        json_string["user_requests"].append("magnifyPage")

        # Assuming the response from your AI service includes the text to be returned to the user
        processed_content = response.json()['choices'][0]['message']['content']
        final_response_text = f"{processed_content}\n\n{json.dumps(json_string)}"
    else:
        final_response_text = "Failed to process your request due to an error with the AI service."

    await ctx.send(
        sender, UAgentResponse(message=final_response_text, type=UAgentResponseType.FINAL)
    )

agent.include(generic_protocol, publish_manifest=True)

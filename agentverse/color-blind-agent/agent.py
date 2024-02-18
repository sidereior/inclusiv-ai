import requests
from pydantic import BaseModel, Field
from ai_engine import UAgentResponse, UAgentResponseType

class CSSRequest(BaseModel):
    css_content: str = Field(description="The original CSS content to be modified.")

css_modification_protocol = Protocol("CSSModification")

@css_modification_protocol.on_message(model=CSSRequest, replies={UAgentResponse})
async def modify_css(ctx: Context, sender: str, msg: CSSRequest):
    # Hardcoded URL for the OpenAI Chat API
    ai_service_url = "https://api.openai.com/v1/chat/completions"

    # API key stored securely in environment variable
    api_key = os.getenv("OPENAI_API_KEY")

    # Validate API key presence
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in the environment!")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    data = {
        "model": "gpt-4-turbo-preview",
        "messages": [
            {
                "role": "system",
                "content": "You are an expert at generating css code."
            },
            {
                "role": "user",
                "content": f"Generate in depth and comprehensive css code to make the following code of a website be accessible to red-green colorblind people. Current CSS: {msg.css_content}"
            }
        ]
    }

    response = requests.post(ai_service_url, headers=headers, json=data)

    if response.status_code == 200:
        modified_css = response.json()['choices'][0]['message']['content']
        message = f"Modified CSS: {modified_css}"
    else:
        message = "Failed to modify CSS due to an error with the AI service."

    await ctx.send(
        sender, UAgentResponse(message=message, type=UAgentResponseType.FINAL)
    )

agent.include(css_modification_protocol, publish_manifest=True)

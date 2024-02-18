<<<<<<< HEAD
=======
import requests
from pydantic import BaseModel, Field
from ai_engine import UAgentResponse, UAgentResponseType

class CSSRequest(BaseModel):
    css_content: str = Field(description="The original CSS content to be modified.")

css_modification_protocol = Protocol("CSSModification")

@css_modification_protocol.on_message(model=CSSRequest, replies={UAgentResponse})
async def modify_css(ctx: Context, sender: str, msg: CSSRequest):
    api_key = "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" 

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    data = {
        "model": "gpt-3.5-turbo-0125",
        "messages": [
            {
                "role": "system",
                "content": "You are an expert at generating css code."
            },
            {
                "role": "user",
                  "content": f"Generate in depth and comprehensive css code to make the following code of a website be accessible to red-green colorblind people. Increase color contrast between red and green elements by adjusting their hues, saturation, or brightness. Replace red and green color combinations with alternative colors that are easier to distinguish, such as blue and yellow. Don't rewrite the entire css only generate as little new css as possible. Use things like !important! to ensure it overrides, and ensure that the css will work properly and update the visuals of the site. Respond only with css code and nothing else in this format: <style>CODE GOES HERE</style>. Current CSS: {msg.css_content}"
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
>>>>>>> ea38f88a95b7f4c8af5ba736bf6870f28b0ac301

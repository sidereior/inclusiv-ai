from fetchai.ledger.api import LedgerApi
from fetchai.ledger.contract import SmartContract
from fetchai.ledger.crypto import Entity, Address

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

AI_MODEL_AGENT_ADDRESS = "agent1qgdq469xhj9ej38yktc6npm8wm8cssumtel522c2dxeq9rmqryuuxrhr6r7"

@agent.on_message(model=Request)
async def ask_question(ctx: Context, sender: str, request: Request):
    question = request.text  # Dynamic question from user
    ctx.logger.info(f"Asking question to AI model agent: {question}")
    await ctx.send(AI_MODEL_AGENT_ADDRESS, Request(text=question))

@agent.on_message(model=Data)
async def handle_data(ctx: Context, sender: str, data: Data):
    ctx.logger.info(f"Got response from AI model agent: {data}")
    # Here you might want to forward the response back to the requester or process it further

@agent.on_message(model=Error)
async def handle_error(ctx: Context, sender: str, error: Error):
    ctx.logger.info(f"Got error from AI model agent: {error}")
    # Handle error responses similarly

from pydantic import BaseModel, confloat, conint

class Query(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str 

class BotConfig(BaseModel):
    temperature: confloat(ge=0, le=1) | None = None
    max_tokens: conint(gt=0) | None = None
    system_prompt: str | None = None
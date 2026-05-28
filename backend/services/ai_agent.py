import requests
import json
from config import GROQ_API_KEY

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"

def build_prompt(transaction_id: str, bank_status: str, merchant_status: str, amount_debited: float) -> str:
    """
    Builds the prompt string to send to the AI agent.
    """
    return f"""
You are a financial dispute resolution agent.
Your job is to analyze a UPI transaction dispute and decide the correct action.

Possible actions:
- REFUND (if money deducted but transaction failed)
- WAIT (if status unclear or pending)
- ESCALATE (if suspicious or conflicting data)

Rules:
- Prioritize user safety
- Avoid unnecessary refunds
- Detect inconsistencies between bank and merchant

Transaction Details:
- Transaction ID  : {transaction_id}
- Bank Status     : {bank_status}
- Merchant Status : {merchant_status}
- Amount Debited  : ₹{amount_debited}

Return ONLY JSON (no extra text, no markdown):
{{
  "action": "REFUND" or "WAIT" or "ESCALATE",
  "reason": "your reasoning here",
  "confidence": a number between 0 and 1
}}
"""

def call_groq_agent(transaction_id: str, bank_status: str, merchant_status: str, amount_debited: float) -> dict:
    """
    Calls the Groq API and returns the AI agent's decision.
    """

    # Safety check
    if not GROQ_API_KEY:
        return {
            "success": False,
            "error": "GROQ_API_KEY is missing in .env file."
        }

    prompt = build_prompt(transaction_id, bank_status, merchant_status, amount_debited)

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.2  # Low temperature = more consistent decisions
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=15)
        response.raise_for_status()

        raw_content = response.json()["choices"][0]["message"]["content"]

        # Clean up response in case model wraps in markdown
        clean_content = raw_content.strip().strip("```json").strip("```").strip()

        decision = json.loads(clean_content)

        # Validate expected keys are present
        if not all(k in decision for k in ["action", "reason", "confidence"]):
            return {
                "success": False,
                "error": "AI response missing required fields.",
                "raw": clean_content
            }

        return {
            "success": True,
            "transaction_id": transaction_id,
            "action": decision["action"],
            "reason": decision["reason"],
            "confidence": decision["confidence"]
        }

    except requests.exceptions.Timeout:
        return {"success": False, "error": "Groq API request timed out."}

    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Groq API request failed: {str(e)}"}

    except json.JSONDecodeError:
        return {"success": False, "error": "Failed to parse AI response as JSON.", "raw": raw_content}
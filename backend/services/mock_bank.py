import random

# Simulated bank transaction database
MOCK_TRANSACTIONS = {
    "TXN001": {"amount": 500.0,  "status": "FAILED",  "merchant_id": "M101"},
    "TXN002": {"amount": 1200.0, "status": "SUCCESS", "merchant_id": "M102"},
    "TXN003": {"amount": 850.0,  "status": "PENDING", "merchant_id": "M103"},
    "TXN004": {"amount": 300.0,  "status": "FAILED",  "merchant_id": "M104"},
    "TXN005": {"amount": 999.0,  "status": "SUCCESS", "merchant_id": "M101"},
}

def get_transaction_from_bank(transaction_id: str) -> dict:
    """
    Simulates fetching transaction details from a bank API.
    Returns transaction data or an error if not found.
    """
    transaction = MOCK_TRANSACTIONS.get(transaction_id)

    if not transaction:
        return {
            "success": False,
            "error": f"Transaction {transaction_id} not found in bank records."
        }

    return {
        "success": True,
        "transaction_id": transaction_id,
        "amount": transaction["amount"],
        "bank_status": transaction["status"],
        "merchant_id": transaction["merchant_id"]
    }
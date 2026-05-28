# Simulated merchant transaction records
# Merchant may show different status than bank (this creates disputes!)
MOCK_MERCHANT_DATA = {
    "TXN001": {"merchant_status": "NOT_RECEIVED", "merchant_id": "M101"},
    "TXN002": {"merchant_status": "RECEIVED",     "merchant_id": "M102"},
    "TXN003": {"merchant_status": "PENDING",      "merchant_id": "M103"},
    "TXN004": {"merchant_status": "RECEIVED",     "merchant_id": "M104"},  # Conflict! Bank=FAILED, Merchant=RECEIVED
    "TXN005": {"merchant_status": "NOT_RECEIVED", "merchant_id": "M101"},  # Conflict! Bank=SUCCESS, Merchant=NOT_RECEIVED
}

def get_merchant_status(transaction_id: str) -> dict:
    """
    Simulates fetching transaction status from merchant side.
    Returns merchant status or unknown if not found.
    """
    data = MOCK_MERCHANT_DATA.get(transaction_id)

    if not data:
        return {
            "success": False,
            "error": f"Transaction {transaction_id} not found in merchant records."
        }

    return {
        "success": True,
        "transaction_id": transaction_id,
        "merchant_status": data["merchant_status"],
        "merchant_id": data["merchant_id"]
    }
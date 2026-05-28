import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

# Color codes for terminal output
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
BLUE   = "\033[94m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

TEST_TRANSACTIONS = [
    {"transaction_id": "TXN001", "expected": "REFUND"},
    {"transaction_id": "TXN003", "expected": "WAIT"},
    {"transaction_id": "TXN004", "expected": "ESCALATE"},
    {"transaction_id": "TXN005", "expected": "ESCALATE"},
]

def print_header(text):
    print(f"\n{BOLD}{BLUE}{'='*55}{RESET}")
    print(f"{BOLD}{BLUE}  {text}{RESET}")
    print(f"{BOLD}{BLUE}{'='*55}{RESET}")

def print_step(step, text):
    print(f"\n{BOLD}  [{step}] {text}{RESET}")

def print_result(key, value, color=RESET):
    print(f"      {key:<20}: {color}{value}{RESET}")

def get_action_color(action):
    return {
        "REFUND":   GREEN,
        "WAIT":     YELLOW,
        "ESCALATE": RED
    }.get(action, RESET)

def reset_database():
    """
    Clears disputes and refunds table before running demo.
    So we always start fresh.
    """
    import sqlite3
    conn = sqlite3.connect("dispute_agent.db")
    conn.execute("DELETE FROM disputes")
    conn.execute("DELETE FROM refunds")
    conn.execute("DELETE FROM transactions")
    conn.commit()
    conn.close()
    print(f"\n  {YELLOW}⚡ Database reset for fresh demo.{RESET}")

def create_dispute(transaction_id):
    response = requests.post(
        f"{BASE_URL}/disputes",
        json={"transaction_id": transaction_id}
    )
    return response.json(), response.status_code

def get_dispute(dispute_id):
    response = requests.get(f"{BASE_URL}/disputes/{dispute_id}")
    return response.json(), response.status_code

def verify_dispute(dispute_id):
    response = requests.post(f"{BASE_URL}/disputes/{dispute_id}/verify")
    return response.json(), response.status_code

def run_demo():
    print_header("UPI Dispute Resolution Agent — DEMO")

    # Reset DB for clean demo
    reset_database()

    for test in TEST_TRANSACTIONS:
        txn_id   = test["transaction_id"]
        expected = test["expected"]

        print_header(f"Testing {txn_id}")

        # Step 1 — Create dispute
        print_step("1", "Creating Dispute...")
        data, status = create_dispute(txn_id)

        if status != 201:
            print(f"  {RED}❌ Failed to create dispute: {data.get('error')}{RESET}")
            continue

        dispute_id = data["dispute_id"]
        print_result("Dispute ID",    dispute_id)
        print_result("Amount",        f"₹{data['amount']}")
        print_result("Bank Status",   data["bank_status"])

        time.sleep(1)

        # Step 2 — Get dispute status (before verification)
        print_step("2", "Fetching Dispute Status (before verify)...")
        data, _ = get_dispute(dispute_id)
        print_result("Dispute Status", data["dispute_status"])
        print_result("AI Action",      data["ai_action"] or "Not yet analyzed")

        time.sleep(1)

        # Step 3 — Trigger AI verification
        print_step("3", "Triggering AI Verification...")
        data, status = verify_dispute(dispute_id)

        if status != 200:
            print(f"  {RED}❌ Verification failed: {data.get('error')}{RESET}")
            continue

        action     = data["ai_action"]
        reason     = data["ai_reason"]
        confidence = data["ai_confidence"]
        color      = get_action_color(action)

        print_result("AI Action",      action,                     color)
        print_result("Confidence",     f"{int(confidence * 100)}%", color)
        print_result("Reason",         reason[:60] + "...")
        print_result("Dispute Status", data["dispute_status"])

        # Show refund info if REFUND
        if action == "REFUND" and data.get("refund"):
            refund = data["refund"]
            print_result("Refund ID",     refund["refund_id"],  GREEN)
            print_result("Refund Amount", f"₹{refund['amount']}", GREEN)
            print_result("Refund Status", refund["status"],     GREEN)

        # Check if AI matched expected
        match = "✅ MATCHED" if action == expected else f"⚠️  GOT {action}, EXPECTED {expected}"
        print(f"\n      Result: {BOLD}{match}{RESET}")

        time.sleep(2)

    print_header("DEMO COMPLETE")
    print(f"\n  {GREEN}✅ All transactions processed successfully!{RESET}\n")

if __name__ == "__main__":
    run_demo()
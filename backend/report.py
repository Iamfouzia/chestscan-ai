from groq import Groq

# Initialize Groq client with your API key
client = Groq(api_key="")

def generate_report(findings: dict) -> str:
    # Convert findings dict to readable text
    findings_text = "\n".join(
        [f"- {k}: {v}% confidence" for k, v in findings.items()]
    )

    # Send to Groq AI for report generation
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
            "role": "user",
            "content": f"""You are an expert radiologist.
Write a professional chest X-ray report.

Detected findings:
{findings_text}

Use this exact format:
CLINICAL FINDINGS:
[detail here]

IMPRESSION:
[main diagnosis]

RECOMMENDATION:
[next steps for doctor]"""
        }]
    )

    return response.choices[0].message.content
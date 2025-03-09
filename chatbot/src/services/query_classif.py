import google.generativeai as genai
from src.config.settings import CLASSIFIER_GOOGLE_API_KEY, MODEL_NAME

# Configure Gemini
genai.configure(api_key=CLASSIFIER_GOOGLE_API_KEY)
# Initialize the Gemini model
model = genai.GenerativeModel(MODEL_NAME)

def classify_query(query: str) -> str:
    """Classify the user's query into one of the predefined categories using Gemini."""
    prompt = """
    You are a query classifier for a cricket chatbot. Classify the following user query into one of these categories:
    1. LIST_ALL - The user is asking for a list of all players in a category (e.g., "list all batsmen").
        1.1 LIST_ALL_BATSMEN - The user is asking for a list of all batsmen.
        1.2 LIST_ALL_BOWLERS - The user is asking for a list of all bowlers.
        1.3 LIST_ALL_ALLROUNDERS - The user is asking for a list of all all-rounders.
    2. SPECIFIC_STATS - The user is asking for specific player statistics (e.g., "What are John's batting stats?").
    3. RECOMMENDATIONS - The user is asking for recommendations (e.g., "Who are the best bowlers?").
    4. OTHER - The query does not fit into any of the above categories.

    You only need to provide the category name. Do not include any other information. Just Identify the category. Then, provide the category name below.

    Query: {query}
    Category:
    """

    # Generate the classification using Gemini
    response = model.generate_content(prompt.format(query=query))
    return response.text.strip()
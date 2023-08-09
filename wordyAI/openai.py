from dotenv import load_dotenv
import os
import openai

def chat(content, prompt):
    openai.api_key = os.getenv("OPENAI_KEY")
    messages = [{"role": "system", "content" : prompt}]
    
    messages.append({"role": "user", "content": content})
    print('------start------')
    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages
    )
    chat_response = completion.choices[0].message.content
    print(chat_response)
    return chat_response
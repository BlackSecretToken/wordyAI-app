from dotenv import load_dotenv
import os
import openai
import time

def chat(content, prompt, key, model):
    openai.api_key = key
    messages = [{"role": "system", "content" : prompt}]
    
    messages.append({"role": "user", "content": content})
    print('------start------')
    start = time.perf_counter()  
    print(messages)
    completion = openai.ChatCompletion.create(
        model = model,
        messages=messages
    )
    chat_response = completion.choices[0].message.content
    end = time.perf_counter()
    print(chat_response)
    elapsed_time = end - start
    print("Elapsed time is:", elapsed_time)
    return chat_response
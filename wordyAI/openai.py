from dotenv import load_dotenv
import os
import openai

def chat(content):
    openai.api_key = os.getenv("OPENAI_KEY")
    messages = [{"role": "system", "content" : "Please ignore all previous instructions. I want you to respond only in language German.  I want you to act as a very proficient SEO and high-end copywriter that speaks and writes fluently German. I want you to pretend that you can write content so well in German that it can outrank other websites. Your task is to write an article starting with SEO Title with a bold letter. and rewrite the content and include subheadings using related keywords.   The article must be 100 % unique and remove plagiarism. the article must be 800 to 1500 words. All output shall be in German and must be 100% human writing style and fix grammar issues and change to active voice. The text to rewrite is this:"}]
    
    messages.append({"role": "user", "content": content})
    print('------start------')
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    chat_response = completion.choices[0].message.content
    print(chat_response)
    return chat_response
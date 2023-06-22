import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import threading
import time

class ProductConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'product'
        self.accept()

        self.send(text_data = json.dumps({
            'type':'connection',
            'message':'You are now connected!'
        }))

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print('Message:', message)

        if message == "start":
            self.thread = threading.Thread(target = self.downloadProduct)
            self.do_run = True
            self.thread.start()
            self.send(text_data = json.dumps({
                'type':'chat',
                'message': 'Thread started..'
            }))

        if message == "stop":
            self.stop_thread()
            self.send(text_data = json.dumps({
                'type':'chat',
                'message': 'Thread stoped..'
            }))

        if message == "get":
            self.send(text_data = json.dumps({
                'type':'chat',
                'message': self.count
            }))

    def chat_message(self, event):
        message = event['message']

        self.send(text_data = json.dumps({
            'type':'chat',
            'message': message
        }))
    
    def downloadProduct(self):
        self.count = 0
        while self.do_run:
            print("Running task...",self.count)
            self.count = self.count + 1
            time.sleep(1)
    
    def stop_thread(self):
        print('here')
        if hasattr(self, 'thread') and self.thread.is_alive():
            print('close')
            self.do_run = False
            self.thread.join()
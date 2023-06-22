import threading
import requests
import time

class ProductDownloadThread(threading.Thread):
    def __init__(self):
        self.do_run = True
        self.count = 0
        super().__init__()

    def run(self):
        while self.do_run:
            print("Running task...",self.count)
            self.count = self.count + 1
            time.sleep(1)

    def stop(self, thread):
        self.thread = thread
        if hasattr(self, 'thread') and self.thread.is_alive():
            print('close')
            self.do_run = False
            self.thread.join()
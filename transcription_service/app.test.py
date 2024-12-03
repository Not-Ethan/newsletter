import redis
import os
import logging
import unittest
import json
import uuid

redis_host = os.getenv("REDIS_HOST")
redis_port = os.getenv("REDIS_PORT")
redis_list = os.getenv("TASK_LIST")

class TestApp(unittest.TestCase):
    def test_redis_connection(self):
        """
        Test the connection to the Redis server.
        """
        try:
            self.redis_client = redis.Redis(host=redis_host, port=redis_port)
            self.assertTrue(self.redis_client.ping())
        except redis.exceptions.ConnectionError:
            logging.error("Could not connect to Redis server.")
            self.fail("Could not connect to Redis server.")
    def test_process_task(self):
        """
        Test the process_task function.
        """
        self.redis_client.rpush(redis_list, json.dumps({"task_id": str(uuid.uuid4()), "transcription_url": "https://www.youtube.com/watch?v=_vczZwgh4-A&list=PLFR7sDPf0Klc7SQ7mMDeZRvDJWwhVtczz"}))

test = TestApp()

test.test_redis_connection()
test.test_process_task()
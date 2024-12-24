import unittest
import redis
import json
import uuid
from unittest.mock import patch

# Import the functions from your script
from app import redis_client, list_name, pubsub_channel, process_item

class TestRedisTaskProcessing(unittest.TestCase):
    def setUp(self):
        """
        Set up the Redis client and clean up the environment before each test.
        """
        self.redis_client = redis_client

    def test_task_processing(self):
        """
        Test that a task is processed, and the result is retrievable.
        """
        # Generate a task ID and sample transcription URL
        task_id = str(uuid.uuid4())
        transcription_url = "https://youtube.com/placeholder-link"
        task_data = {"task_id": task_id, "transcription_url": transcription_url}

        # Mock the process_task function to simulate task processing
        with patch('your_script.process_task') as mock_process_task:
            mock_process_task.return_value = "Simulated summary text"

            # Add the task to the Redis list
            self.redis_client.rpush(list_name, json.dumps(task_data))

            # Simulate task processing
            process_item(json.dumps(task_data).encode('utf-8'))

            # Check that the summary was stored in Redis
            summary_key = f"summary:{task_id}"
            summary = self.redis_client.get(summary_key)
            self.assertIsNotNone(summary, "Summary should be stored in Redis")
            self.assertEqual(summary.decode('utf-8'), "Simulated summary text")

            # Check that the task completion was published to the pub/sub channel
            pubsub = self.redis_client.pubsub()
            pubsub.subscribe(pubsub_channel)
            message = pubsub.get_message(timeout=2)
            self.assertIsNotNone(message, "Pub/Sub message should be published")
            published_data = json.loads(message["data"].decode('utf-8'))
            self.assertEqual(published_data["task_id"], task_id)

    def tearDown(self):
        """
        Clean up after tests.
        """
        self.redis_client.flushdb()

if __name__ == "__main__":
    unittest.main()

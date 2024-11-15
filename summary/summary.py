from transformers import T5ForConditionalGeneration, T5Tokenizer
from dotenv import load_dotenv
import os
import re
load_dotenv("secrets.env")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_KEY")

tokenizer = T5Tokenizer.from_pretrained("Babelscape/t5-base-summarization-claim-extractor")
model = T5ForConditionalGeneration.from_pretrained("Babelscape/t5-base-summarization-claim-extractor")
summary = '''Host: "Welcome back to Space Science Today! Today, we're diving into one of the biggest mysteries in space: dark matter. Despite decades of research, we still don’t know what it actually is. Scientists believe that dark matter makes up around 27% of the universe’s mass-energy content, but it doesn’t interact with light or other forms of electromagnetic radiation, which makes it extremely difficult to detect directly."

Guest: "Exactly. One of the leading theories is that dark matter is made up of WIMPs—weakly interacting massive particles—that interact with gravity but are otherwise 'invisible' to the tools we have. Efforts like the Large Hadron Collider and underground detectors like LUX-ZEPLIN are searching for evidence of WIMPs, but so far, no conclusive results."

Host: "It’s fascinating, isn't it? And meanwhile, there are theories that suggest dark matter might not be a particle at all but rather a property of gravity itself that we don’t fully understand. This idea, sometimes referred to as 'modified gravity,' posits that at certain scales, gravity behaves differently than our current models predict."

Guest: "That’s right. And if we could better understand dark matter or confirm it as a new type of particle, it would revolutionize our understanding of physics. It’s not just about filling in gaps but rethinking fundamental forces and how they work."

Host: "Absolutely. So, what’s next for dark matter research? Where do scientists go from here?"

Guest: "Future projects like the Vera Rubin Observatory are expected to provide more data on how dark matter might influence galaxy formation and behavior. And, of course, advances in technology may lead to new ways of detecting these elusive particles."
'''

tok_input = tokenizer.batch_encode_plus([summary], return_tensors="pt", padding=True)
claims = model.generate(**tok_input)
claims = tokenizer.batch_decode(claims, skip_special_tokens=True)
print(re.split(r'(?<=[.!?]) +',claims[0]))
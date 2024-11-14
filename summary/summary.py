from transformers import T5ForConditionalGeneration, T5Tokenizer

tokenizer = T5Tokenizer.from_pretrained("Babelscape/t5-base-summarization-claim-extractor")
model = T5ForConditionalGeneration.from_pretrained("Babelscape/t5-base-summarization-claim-extractor")
summary = ''''''

tok_input = tokenizer.batch_encode_plus([summary], return_tensors="pt", padding=True)
claims = model.generate(**tok_input)
claims = tokenizer.batch_decode(claims, skip_special_tokens=True)
print(claims[0].split(r'[.!?]'))
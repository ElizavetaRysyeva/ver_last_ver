from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import pickle
import numpy as np  # Добавляем импорт numpy
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem.wordnet import WordNetLemmatizer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Загрузка данных из Pickle
with open("hotel_data.pkl", "rb") as file:
    hotel_data = pickle.load(file)

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Определение функции requirementbased
def requirementbased(hotel, country, number, features):
    features = features.lower()
    features_tokens = word_tokenize(features)

    sw = stopwords.words('english')
    lemm = WordNetLemmatizer()
    f1_set = {w for w in features_tokens if not w in sw}
    f_set = set()
    for se in f1_set:
        f_set.add(lemm.lemmatize(se))

    reqbased = hotel[hotel['country'] == country.lower()]
    reqbased = reqbased[reqbased['max_count'] == number]
    reqbased = reqbased.set_index(np.arange(reqbased.shape[0]))

    cos = []
    for i in range(reqbased.shape[0]):
        temp_tokens = word_tokenize(reqbased['description'][i])
        temp1_set = {w for w in temp_tokens if not w in sw}
        temp_set = set()
        for se in temp1_set:
            temp_set.add(lemm.lemmatize(se))
        rvector = temp_set.intersection(f_set)
        cos.append(len(rvector))

    reqbased['similarity'] = cos
    reqbased = reqbased.sort_values(by='similarity', ascending=False)
    reqbased.drop_duplicates(subset='hotel_id', keep='first', inplace=True)
    return reqbased[['name', 'country_rus', 'stars', 'price', 'hotel_img', 'room_img', 'description', 'category']].head(10)

# Определяем структуру запроса
class RequestModel(BaseModel):
    country: str
    number: int
    features: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Hotel Recommendation API"}

@app.post("/recommendations/")
def get_recommendations(request: RequestModel):
    try:
        result = requirementbased(hotel_data, request.country, request.number, request.features)
        return result.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

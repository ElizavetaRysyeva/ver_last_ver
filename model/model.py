import pandas as pd
import nltk
import pickle

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess_data():
    hotel_details = pd.read_excel('../backend/hotels.xlsx')
    hotel_rooms = pd.read_excel('../backend/room.xlsx')
    events_df = pd.read_excel('../backend/orders.xlsx')

    hotel = pd.merge(hotel_rooms, hotel_details, left_on='hotel_id', right_on='id', how='inner')
    hotel = hotel.merge(events_df, on='hotel_id', how='left')
    hotel = hotel.dropna()

    del hotel['id_x']
    del hotel['id_y']

    hotel['description'] = hotel['description'].str.replace(': ;', ',')
    hotel['country'] = hotel['country'].str.lower()
    hotel['description'] = hotel['description'].str.lower()
    
    return hotel

# Подготовка данных
hotel_data = preprocess_data()

# Сохранение данных в Pickle
with open("hotel_data.pkl", "wb") as file:
    pickle.dump(hotel_data, file)

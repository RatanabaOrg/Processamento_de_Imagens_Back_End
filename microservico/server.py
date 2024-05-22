from flask import Flask, send_file, jsonify
from firebase_admin import credentials, initialize_app, storage, firestore
import requests
from ultralytics import YOLO
import os


app = Flask(__name__)
model = YOLO('modeloAI/best.pt')

# Configurações do Firebase
firebase_cred = credentials.Certificate("../firebaseAdminConfig.json")
firebase_app = initialize_app(firebase_cred)
firebase_storage = storage.bucket(app=firebase_app, name="ratanaba5")
firebase_db = firestore.client()

# Rota para recuperar uma imagem específica
@app.route('/image/<document_id>')
def get_image(document_id):
    # Recupera o documento do Firestore
    doc_ref = firebase_db.collection('Armadilha').document(document_id)
    doc = doc_ref.get()

    # Verifica se o documento existe
    if not doc.exists:
        return "Documento não encontrado", 404
    
    # Verifica se o documento contém um campo de imagem
    if 'fotos' not in doc.to_dict():
        return "URL da imagem não encontrada no documento", 404
    
    pragas = 0
    imagens = doc.to_dict()['fotos']
    for image in imagens:
        local_path = "imagens/imagem"
        print(image)
        response = requests.get(image)
        with open(local_path, 'wb') as f:
            f.write(response.content)

        results = model([local_path])
        for result in results:
            pragas = pragas + len(result.boxes)

        if os.path.exists(local_path):
            os.remove(local_path)

    doc_ref.update({"pragas": doc.to_dict()["pragas"] + pragas, "fotos": []})

    return str(pragas)

if __name__ == '__main__':
    app.run(debug=True)

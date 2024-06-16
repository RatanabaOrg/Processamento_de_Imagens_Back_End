from flask import Flask, send_file, jsonify
from firebase_admin import credentials, initialize_app, storage, firestore
import requests
from ultralytics import YOLO
import os
from twilio.rest import Client
from datetime import date

account_sid = 'AC4a721c9f1e981c96b97d48cf87692410'  # Replace with your Account SID from Twilio Console
auth_token = 'bc5ae46ee487fc61831fe6089d392ac0' 
client = Client(account_sid, auth_token)


app = Flask(__name__)
model = YOLO('modeloAI/best.pt')

# Configurações do Firebase
firebase_cred = credentials.Certificate("../firebaseAdminConfig.json")
firebase_app = initialize_app(firebase_cred)
firebase_storage = storage.bucket(app=firebase_app, name="ratanaba5")
firebase_db = firestore.client()

# Rota para recuperar uma imagem específica
@app.route('/image/<document_id>/<numero>')
def get_image(document_id, numero):
    # Recupera o documento do Firestore
    doc_ref = firebase_db.collection('Armadilha').document(document_id)
    doc = doc_ref.get()

    # Verifica se o documento existe
    if not doc.exists:
        return "Documento não encontrado", 404
    
    # Verifica se o documento contém um campo de imagem
    if 'fotos' not in doc.to_dict():
        return "URL da imagem não encontrada no documento", 404
    
    
    armadilha = doc.to_dict()
    imagens = armadilha['fotos']
    ocorrencias = armadilha['pragas']
    pragas = 0
    for image in imagens:
        local_path = "imagens/imagem"
        response = requests.get(image)
        with open(local_path, 'wb') as f:
            f.write(response.content)

        results = model([local_path])
        for result in results:
            pragas = pragas + len(result.boxes)

        if os.path.exists(local_path):
            os.remove(local_path)
    
    dataAtual = date.today().strftime("%d/%m/%Y")
    try:
        ultimaOcorrencia = ocorrencias[-1]
        if dataAtual == ultimaOcorrencia['data']:
            ultimaOcorrencia['quantidade'] = ultimaOcorrencia['quantidade'] + pragas
        else:
            ocorrencia = {}
            ocorrencia['quantidade'] = pragas
            ocorrencia['data'] = dataAtual
            ocorrencias.append(ocorrencia)
    except:
            ocorrencia = {}
            ocorrencia['quantidade'] = pragas
            ocorrencia['data'] = dataAtual
            ocorrencias.append(ocorrencia)
        
    doc_ref.update({"pragas": ocorrencias, "fotos": []})
    message = client.messages.create(
    from_='whatsapp:+14155238886',  # This is the Twilio sandbox number for WhatsApp
    body=f'Foram detectadas {pragas} pragas em {len(imagens)} fotos tiradas na armadilha {armadilha['nomeArmadilha']}.',
    to='whatsapp:+'+numero       # Replace with the recipient's WhatsApp number
)

    return str(pragas)

if __name__ == '__main__':
    app.run(debug=True)

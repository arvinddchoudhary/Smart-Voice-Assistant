### 📢 **Smart Voice Assistant**  

An AI-powered voice assistant web application built with **React** for the frontend and **Django REST Framework** for the backend. It supports voice recognition, natural language processing (NLP), and generates action items, summaries, and meeting details from speech or text input.

---

### 🚀 **Features**

- 🎤 Voice recognition using Web Speech API  
- 📝 Text input processing for non-voice users  
- 🔍 Natural Language Processing (NLP) to extract:
  - Action items
  - Key points
  - Meeting summaries
  - Important dates  
- 📄 Beautiful, responsive UI built with React  
- ⚡ Real-time feedback and processing indication  

---

### 🛠️ **Tech Stack**

- **Frontend:** React (TypeScript)
- **Backend:** Django REST Framework
- **Speech Recognition:** Web Speech API (`window.SpeechRecognition`)
- **API Communication:** RESTful API using `fetch`
- **Styling:** Custom CSS with inline styles and gradients  

---

### 🔧 **Installation & Setup**

#### 1. Clone the repository:
```bash
git clone https://github.com/your-username/smart-voice-assistant.git
cd smart-voice-assistant
```

#### 2. Set up the Backend (Django):
```bash
cd backend
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
The backend server will run at `http://127.0.0.1:8000/`.

#### 3. Set up the Frontend (React):
```bash
cd frontend
npm install
npm start
```
The frontend will run at `http://localhost:3000/`.

---

### ⚙️ **Usage**

1. Start both the backend and frontend servers.
2. Enter or speak your text in the input box.
3. Click on **"Process Text"**.
4. View the NLP-processed results including action items, summaries, and meeting details.

---

### 📂 **Project Structure**
```
smart-voice-assistant/
│
├── backend/                 # Django REST Framework Backend
│   ├── nlp_app/             # NLP Processing App
│   ├── backend/             # Django Project Config
│   ├── manage.py            # Django Entry Point
│   └── requirements.txt     # Backend Dependencies
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── screens/
│   │   │   └── HomeScreen.tsx  # Main UI Component
│   │   └── config.js        # API Base URL
│   ├── public/
│   └── package.json         # Frontend Dependencies
│
└── README.md                 # Project Documentation
```

---

### 🐞 **Troubleshooting**

- **Backend not connecting?**  
  - Ensure Django server is running on the correct port.
  - Check `API_BASE_URL` in `frontend/src/config.js`.

- **Speech recognition not working?**  
  - Supported only on Google Chrome and Microsoft Edge.
  - Allow microphone permissions in browser settings.

- **Port conflicts?**  
  - Use `npx kill-port 3000` to free up the React port.

---

### 🤝 **Contributing**

1. Fork the repository.
2. Create a new branch:  
   `git checkout -b feature/your-feature-name`
3. Commit your changes:  
   `git commit -m "Add your message"`
4. Push the changes:  
   `git push origin feature/your-feature-name`
5. Open a Pull Request.

---

### 📜 **License**

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

### 🙌 **Acknowledgments**
- Django & Django REST Framework documentation  
- React official documentation  
- Web Speech API (MDN Docs)  

---

Let me know if you'd like any specific customizations! 🚀

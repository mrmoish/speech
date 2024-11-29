

// === Распознование речи ===

// Проверяем поддержку Web Speech API
if (!('webkitSpeechRecognition' in window)) {
    alert('Ваш браузер не поддерживает Web Speech API.');
}

const recognition = new webkitSpeechRecognition(); //  объект распознавания речи
recognition.interimResults = true; // промежуточные результаты распознования
// recognition.lang = 'es-AR'; // Устанавливаем языка и региона
recognition.lang = 'ru-RU'; // Устанавливаем языка и региона

// на моем устройстве дублирутеся ответ
// более сложный ответ
// recognition.continuous = true; // Непрерывное распознавание не работает на моб. устройствах 
// на айфоне рабоатет на моем андойде нет
// recognition.maxAlternatives = 3
console.log('start')
recognition.start()


recognition.onend = () => {
    //алтернатива(немного калхоз)
    recognition.start();
    
};


recognition.onresult = (event) => {

    for (let i = event.resultIndex; i < event.results.length; i++) {

        // event.results.length + " " + event.results[i].length + " " + 
        const text = event.results[i][0].transcript 

        if (event.results[i].isFinal) {
            // Добавляем в конец p
            document.getElementById('process').insertAdjacentHTML('beforebegin', " " + text);
            document.getElementById('process').innerHTML = ''
        }
        else{
            document.getElementById('process').innerHTML = " " + text;
        }


        
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
};



// === Перевод DeepL ===


async function translateText(text, htmlObj) {

    const url = 'https://api-free.deepl.com/v2/translate';
    const apiKey = "6d57d47a-e332-4c47-b865-8d3e506be91e:fx"; // Вставьте ваш API ключ здесь

    const params = new URLSearchParams();
    params.append('auth_key', apiKey);
    params.append('text', text);
    // params.append('source_lang', 'es');
    // params.append('target_lang', 'ru');


    params.append('source_lang', 'ru');
    params.append('target_lang', 'en');


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        const textTrans = data.translations[0].text
        // html.innerHTML = textTrans;
        
        htmlObj.setAttribute('data-overlay', textTrans)

        // sent(text, textTrans)
    } catch (error) {
        alert('Ошибка:', error);
        // html.innerHTML = 'Ошибка перевода';
    }


}

// === sent ===


function sent(text, translate){

    const queryString = new URLSearchParams({es: text, ru: translate}).toString(); // Конвертируем в строку запроса
    fetch('api/add?' + queryString, { method: 'GET'}) 
}

const fetch = require('node-fetch');

// API Key desde variable de entorno (asegúrate de configurarla correctamente en tu plataforma)
const API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async function (event, context) {
    // Validación de la clave API
    if (!API_KEY) {
        console.error('No se ha proporcionado una clave API de OpenAI.');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Clave API de OpenAI no configurada.' })
        };
    }

    // Parseo del cuerpo del evento
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('Error al parsear el cuerpo del evento:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Solicitud malformada. El cuerpo no es JSON válido.' })
        };
    }

    const { type, functionInput, upperLimit, lowerLimit } = body;
    const prompt = `Calcula la ${type} de la función ${functionInput} con límites ${lowerLimit} a ${upperLimit}.`;

    const url = 'https://api.openai.com/v1/completions';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        // Verifica si la respuesta es válida antes de intentar parsear
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const responseBody = await response.text(); // Cambiado a text() para ver el contenido sin intentar parsearlo primero
        console.log('Respuesta de OpenAI (en texto):', responseBody); // Imprimir respuesta completa para depuración

        // Si la respuesta está vacía o no es lo que se espera
        if (!responseBody) {
            throw new Error('La respuesta de OpenAI está vacía.');
        }

        // Intentar parsear la respuesta como JSON
        let data;
        try {
            data = JSON.parse(responseBody);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            throw new Error('La respuesta de OpenAI no es un JSON válido.');
        }

        // Verifica si hay resultados disponibles en la respuesta
        if (!data || !data.choices || !data.choices[0]) {
            throw new Error('No se encontraron resultados en la respuesta de OpenAI.');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                result: data.choices[0].text.trim(),
                procedimiento: 'Paso a paso calculado por OpenAI'
            })
        };
    } catch (error) {
        console.error('Error en la llamada a la API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error en la llamada a la API: ${error.message}` })
        };
    }
};

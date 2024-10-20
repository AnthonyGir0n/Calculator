const fetch = require('node-fetch');

// API Key desde variable de entorno (asegúrate de configurarla correctamente en tu plataforma)
const API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async function (event, context) {
    if (!API_KEY) {
        console.error('No se ha proporcionado una clave API de OpenAI.');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Clave API de OpenAI no configurada.' })
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
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

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const responseBody = await response.text();

        let data;
        try {
            data = JSON.parse(responseBody);
        } catch (parseError) {
            throw new Error('La respuesta de OpenAI no es un JSON válido.');
        }

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
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error en la llamada a la API: ${error.message}` })
        };
    }
};

document.getElementById('calculateBtn').addEventListener('click', async function () {
    const type = document.getElementById('integralType').value;
    const functionInput = document.getElementById('functionInput').value;
    const lowerLimit = document.getElementById('lowerLimit').value || null;
    const upperLimit = document.getElementById('upperLimit').value || null;

    const payload = {
        type,
        functionInput,
        lowerLimit,
        upperLimit
    };

    try {
        const response = await fetch('/api/calculate-integral', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('output').innerText = `Resultado: ${result.result}`;
            document.getElementById('procedure').innerText = result.procedimiento;
        } else {
            document.getElementById('output').innerText = `Error: ${result.error}`;
        }
    } catch (error) {
        console.error('Error al calcular:', error);
        document.getElementById('output').innerText = 'Error en la solicitud.';
    }
});

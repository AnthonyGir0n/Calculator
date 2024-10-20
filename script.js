document.addEventListener("DOMContentLoaded", function () {
    const integralType = document.getElementById('integralType');
    const exampleDiv = document.getElementById('example');

    integralType.addEventListener('change', function () {
        const type = this.value;
        const examples = {
            indefinida: "Ejemplo: \\( \\int x^2 \\, dx = \\frac{x^3}{3} + C \\)",
            definida: "Ejemplo: \\( \\int_{0}^{1} x^2 \\, dx = \\frac{1^3}{3} - \\frac{0^3}{3} = \\frac{1}{3} \\)",
            teorema: "Ejemplo: Si \\( F(x) = x^2 \\), entonces \\( F(b) - F(a) \\).",
            potencia: "Ejemplo: \\( \\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\) con \\( n \\neq -1 \\).",
            cociente: "Ejemplo: \\( \\int \\frac{1}{x} \\, dx = \\ln|x| + C \\)",
            multiplicacion: "Ejemplo: \\( \\int x \cdot e^x \\, dx = x \cdot e^x - e^x + C \\)",
            suma: "Ejemplo: \\( \\int (f(x) + g(x)) \\, dx = \\int f(x) \\, dx + \\int g(x) \\, dx \\)",
            sustitucion: "Ejemplo: \\( \\int e^{2x} \\, dx = \\frac{1}{2} e^{2x} + C \\) con sustitución \\( u = 2x \\)",
            partes: "Ejemplo: \\( \\int u \\, dv = u \\, v - \\int v \\, du \\). Ejemplo: \\( \\int x \\ln(x) \\, dx = \\frac{x^2 \\ln(x)}{2} - \\frac{x^2}{4} + C \\)."
        };
        exampleDiv.innerHTML = examples[type] || '';
    });

    document.getElementById('calculateBtn').addEventListener('click', async function () {
        const type = integralType.value;
        const functionInput = document.getElementById('functionInput').value;
        const upperLimit = document.getElementById('upperLimit').value;
        const lowerLimit = document.getElementById('lowerLimit').value;
        const outputDiv = document.getElementById('output');
        const procedureDiv = document.getElementById('procedure');

        try {
            const response = await fetch('/.netlify/functions/call-openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type,
                    functionInput: functionInput,
                    upperLimit: upperLimit,
                    lowerLimit: lowerLimit
                })
            });

            const data = await response.json();
            outputDiv.innerHTML = `Resultado: ${data.result}`;
            procedureDiv.innerHTML = `Procedimiento: ${data.procedimiento}`;
        } catch (error) {
            outputDiv.innerHTML = 'Error en el cálculo: ' + error.message;
        }
    });
});

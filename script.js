document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://api.thingspeak.com/channels/2602561/feeds.json?results=2";
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('description');
    const lastValueElement = document.getElementById('last-value');
    const lastEntryIdElement = document.getElementById('last-entry-id');
    const lastValueElement3 = document.getElementById('last-value3');
    const lastValueElement4 = document.getElementById('last-value4');
    const lastValueElement5 = document.getElementById('last-value5');
    const refreshButton = document.getElementById('refresh-button');
    const toggleAutoRefreshButton = document.getElementById('toggle-auto-refresh');
    const highlightElement = document.getElementById('highlight');
    const highlightElement3 = document.getElementById('highlight3');
    const highlightElement4 = document.getElementById('highlight4');
    const highlightElement5 = document.getElementById('highlight5');
    const chartElement = document.getElementById('chart').getContext('2d');
    const chartElement3 = document.getElementById('chart3').getContext('2d');
    const chartElement4 = document.getElementById('chart4').getContext('2d');
    const chartElement5 = document.getElementById('chart5').getContext('2d');
    let chart, chart3, chart4, chart5;
    let autoRefreshInterval;
    let autoRefreshEnabled = false;

    // Arrays para armazenar as últimas 30 leituras
    const field2Values = [];
    const field3Values = [];
    const field4Values = [];
    const field5Values = [];
    const entryIds = [];

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            const channelName = data.channel.name;
            const channelDescription = data.channel.description;
            const feeds = data.feeds;
            
            titleElement.textContent = channelName;
            descriptionElement.textContent = channelDescription;
            
            if (feeds.length > 0) {
                const lastFeed = feeds[feeds.length - 1];

                // Verifique se os campos estão presentes antes de acessá-los
                const lastValue = lastFeed.field2 !== undefined ? lastFeed.field2 : 'N/A';
                const lastValue3 = lastFeed.field3 !== undefined ? lastFeed.field3 : 'N/A';
                const lastValue4 = lastFeed.field4 !== undefined ? lastFeed.field4 : 'N/A';
                const lastValue5 = lastFeed.field5 !== undefined ? lastFeed.field5 : 'N/A';
                const lastEntryId = lastFeed.entry_id;

                lastValueElement.textContent = lastValue;
                lastValueElement3.textContent = lastValue3;
                lastValueElement4.textContent = lastValue4;
                lastValueElement5.textContent = lastValue5;
                lastEntryIdElement.textContent = lastEntryId;

                // Adiciona as novas leituras aos arrays
                addValueToArray(field2Values, parseFloat(lastValue));
                addValueToArray(field3Values, parseFloat(lastValue3));
                addValueToArray(field4Values, parseFloat(lastValue4));
                addValueToArray(field5Values, parseFloat(lastValue5));
                addValueToArray(entryIds, lastEntryId);

                // Atualizar gráficos
                chart = updateChart(chartElement, chart, 'Field 2 Values', entryIds, field2Values);
                chart3 = updateChart(chartElement3, chart3, 'Field 3 Values', entryIds, field3Values);
                chart4 = updateChart(chartElement4, chart4, 'Field 4 Values', entryIds, field4Values);
                chart5 = updateChart(chartElement5, chart5, 'Field 5 Values', entryIds, field5Values);

                // Alterne a cor com base na paridade do last_entry_id
                const highlightColor = lastEntryId % 2 === 0 ? '#ffeb3b' : '#90ee90';
                highlightElement.style.backgroundColor = highlightColor;
                highlightElement3.style.backgroundColor = highlightColor;
                highlightElement4.style.backgroundColor = highlightColor;
                highlightElement5.style.backgroundColor = highlightColor;
            }
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    }

    function addValueToArray(array, value) {
        if (array.length >= 30) {
            array.shift();  // Remove o primeiro elemento se o array já tiver 30 elementos
        }
        array.push(value); // Adiciona o novo valor ao final do array
    }
    
    function updateChart(context, existingChart, label, labels, data) {
        if (existingChart) {
            existingChart.destroy();
        }
    
        return new Chart(context, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    refreshButton.addEventListener('click', fetchData);
    
    toggleAutoRefreshButton.addEventListener('click', function() {
        autoRefreshEnabled = !autoRefreshEnabled;
        toggleAutoRefreshButton.textContent = autoRefreshEnabled ? 'Desligar' : 'Ligar';
        
        if (autoRefreshEnabled) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = setInterval(fetchData, 500); // Atualiza a cada 0.5 segundos
        } else {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = setInterval(fetchData, 240000); // Atualiza a cada 4 minutos
        }
    });
    
    // Inicializa com a atualização automática de 4 minutos
    autoRefreshInterval = setInterval(fetchData, 240000);
    fetchData();
});

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://api.thingspeak.com/channels/2602561/fields/2.json?api_key=4OW0Z91BKJ5U61ZT&results=20";
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('description');
    const lastValueElement = document.getElementById('last-value');
    const lastEntryIdElement = document.getElementById('last-entry-id');
    const refreshButton = document.getElementById('refresh-button');
    const chartElement = document.getElementById('chart').getContext('2d');
    let chart;

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            const channelName = data.channel.name;
            const channelDescription = data.channel.description;
            const feeds = data.feeds;
            
            titleElement.textContent = channelName;
            descriptionElement.textContent = channelDescription;
            
            if (feeds.length > 0) {
                const lastFeed = feeds[feeds.length - 1];
                const lastValue = lastFeed.field2;
                const lastEntryId = lastFeed.entry_id;

                lastValueElement.textContent = lastValue;
                lastEntryIdElement.textContent = lastEntryId;

                const fieldValues = feeds.map(feed => parseFloat(feed.field2));
                const entryIds = feeds.map(feed => feed.entry_id);

                if (chart) {
                    chart.destroy();
                }

                chart = new Chart(chartElement, {
                    type: 'line',
                    data: {
                        labels: entryIds,
                        datasets: [{
                            label: 'Field 2 Values',
                            data: fieldValues,
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
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    }

    refreshButton.addEventListener('click', fetchData);

    fetchData();
    setInterval(fetchData, 240000); // Atualiza a cada 4 minutos (240000 ms)
});

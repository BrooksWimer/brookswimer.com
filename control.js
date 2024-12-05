$(document).ready(function () {
    let chartInstance;

    window.onerror = function (message, source, lineno, colno, error) {
        console.error("Global Error:", message, "at", source, ":", lineno, ":", colno);
    };

    // Function to fetch data and update the graph
    function fetchAndRenderGraph() {
        $.getJSON("reactive_data_test2.json", function (data) {
            const now = new Date();

            // Filter valid data entries
            const filteredData = data.filter(item => {
                const itemTime = new Date(item.HR);
                const hasValidValues = item.SRT_MW !== undefined && item.WRT_MW !== undefined && item.LRT_MW !== undefined;
                return itemTime <= now && hasValidValues;
            });

            console.log("Filtered Data:", filteredData);

            /*
           const labels = filteredData.map(item => {
               const date = new Date(item.HR);
               const minutes = date.getMinutes();
               // Use the hour as the label only for entries on the hour
               return minutes === 0 ? date.getHours().toString().padStart(2, '0') : "";
           });
        
          Generate x-axis labels for hourly markers only
           const labels = filteredData.map(item => {
               const date = new Date(item.HR);
               return date.getMinutes() === 0
                   ? date.getHours().toString().padStart(2, '0') + ":00"
                   : ""; // Empty string for non-hourly data
           });
           */
            const labels = filteredData.map(item => {
                const date = new Date(item.HR);
                return date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0'); // Format as HH:mm
            });

            // Calculate metrics
            const solarData = filteredData.map(item => (item.SRT_MW || 0) - (item.SSCRA_MW || 0));
            const windData = filteredData.map(item => (item.WRT_MW || 0) - (item.WSCRA_MW || 0));
            const loadData = filteredData.map(item => (item.LRT_MW || 0) - (item.LSCRA_MW || 0));
            const intData = filteredData.map(item => (-1 * (item.ISCRA_MW || 0)) - (item.IRT_MW || 0));
            const netData = filteredData.map((_, index) =>
                (solarData[index] || 0) +
                (windData[index] || 0) +
                (loadData[index] || 0) +
                ((-1 * (filteredData[index].ISCRA_MW || 0)) - (filteredData[index].IRT_MW || 0))
            );

            console.log("Metrics Calculated");

            // Update chart if it exists, otherwise create a new chart
            const ctx = document.getElementById("dynamicGraph").getContext("2d");
            if (chartInstance) {
                chartInstance.data.labels = labels;
                chartInstance.data.datasets[0].data = solarData;
                chartInstance.data.datasets[1].data = windData;
                chartInstance.data.datasets[2].data = loadData;
                chartInstance.data.datasets[3].data = intData;
                chartInstance.data.datasets[4].data = netData;
                chartInstance.update();
            } else {
                chartInstance = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Delta SCRA|Solar",
                                data: solarData,
                                borderColor: "orange",
                                fill: false,
                                pointRadius: 0
                            },
                            {
                                label: "Delta SCRA|Wind",
                                data: windData,
                                borderColor: "blue",
                                fill: false,
                                pointRadius: 0
                            },
                            {
                                label: "Delta SCRA|Load",
                                data: loadData,
                                borderColor: "green",
                                fill: false,
                                pointRadius: 0
                            },
                            {
                                label: "Delta SCRA|Int",
                                data: intData,
                                borderColor: "red",
                                fill: false,
                                pointRadius: 0
                            },
                            {
                                label: "NET",
                                data: netData,
                                borderColor: "purple",
                                borderDash: [5, 5], // Dashed line for distinction
                                fill: false,
                                pointRadius: 0
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top"
                            }
                        },
                        scales: {
                            x: {
                                type: 'category',

                                title: {
                                    display: true,
                                    text: "Time"
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "MW"
                                }
                            }
                        }
                    }
                });
            }

            // Update last update timestamp
            const currentTime = new Date().toLocaleString();
            $("#updateTimestamp").text(currentTime);

        }).fail(function () {
            console.error("Error fetching data.");
            $("#updateTimestamp").text("Error fetching data.");
        });
    }

    // Initial graph rendering
    fetchAndRenderGraph();

    // Refresh data and graph every 5 minutes (300000 ms)
    setInterval(fetchAndRenderGraph, 300000);
});

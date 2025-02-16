function readCSVFile() {
	let tracker = [];

	function filterUniqueByField(array, field) {
		const seen = new Set();
		return array.filter(item => {
			if (seen.has(item[field])) {
				return false;
			} else {
				seen.add(item[field]);
				return true;
			}
		}).filter(item => item["Location"] !== '');
	}

	fetch('./busy_places_dataset.csv')
		.then(response => response.text())
		.then(data => {
			Papa.parse(data, {
				complete: function (results) {
					const objectsArray = results.data.slice(1).map(subArray => ({
						Location: subArray[0],
						Floor: subArray[1],
						Business: subArray[2],
						Noise: subArray[3],
						Productivity: subArray[4],
						Day: subArray[5],
						Time: subArray[6]
					}));

					tracker = objectsArray; // Assign the parsed data
					console.log("Tracker Data:", tracker);

					// Filter unique locations
					const uniqueLocations = filterUniqueByField(tracker, 'Location');
					console.log("Unique Locations:", uniqueLocations);

					// Generate HTML elements
					let trackerContainer = document.getElementById("tracker-container");
					const trackersHTML = uniqueLocations.map((item) => `
						<div class="tracker-info" onclick="updateGraph('${item["Location"]}', '${item["Business"]}')">
							<p class="tracker-location"><h2> ${item["Location"]}</h2></p>
							<p class="tracker-business">Business: ${item["Business"]}</p>
							<p class="tracker-time">Time Updated: ${item["Time"]}</p>
						</div>
					`).join(""); // Convert array to string

					trackerContainer.innerHTML = trackersHTML;
				}
			});
		})
		.catch(error => console.error("Error loading CSV:", error));
}

// Function to update graph
function updateGraph(location, busyNumber) {
	var graphContainer = document.getElementById("graph-canvas").getContext("2d");
	
	if (window.myChart) {
		window.myChart.destroy();
	}
	window.myChart = new Chart(graphContainer, {
        type: "pie",
        data: {
            labels: ["busy", "not"],
            datasets: [{
                backgroundColor: ["#8f8f8f", "#d3d3d3"],
                data: [parseInt(busyNumber), Math.max(0, 5 - parseInt(busyNumber))]
            }]
        }
    });
}

readCSVFile();

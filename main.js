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
							<p class="tracker-business">Occupancy Rating: ${item["Business"]}</p>
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
                backgroundColor: ["#8f8f8f", "navy"],
                data: [parseInt(busyNumber), Math.max(0, 5 - parseInt(busyNumber))]
            }]
        },
		
    });
}
submitted = function(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    var form = event.target;
    var busyValue = form.elements["busy"].value;
    var locationValue = form.elements["location"].value;
    var noiseValue = form.elements["noise"].value;
    var timeValue = new Date().toLocaleTimeString(); // Get readable time

    storeReport(busyValue, locationValue, noiseValue, timeValue);

    // Calculate seating availability
    let [seatsValue, seatsType] = calcSeating(busyValue, locationValue);

    // Show confirmation message on the webpage
    showNotification(`Feedback Submitted! 
        <br><strong>Location:</strong> ${locationValue}
        <br><strong>Busy Level:</strong> ${busyValue} 
        <br><strong>Noise Level:</strong> ${noiseValue} 
        <br><strong>Estimated Available ${seatsType}:</strong> ${Math.round(seatsValue)}
        <br><strong>Time:</strong> ${timeValue}`);

};

calcSeating = function(busy, location) {
    var seats = 0.0;
    var type = "seats";

    switch(location) {
        case "davis": 
            seats = 150 + 60 + 40 + 40 + 70 + (6 * (40 + 80));
            break;
        case "bolo":
            seats = 250;
            break;
        case "tolo":
            seats = 450;
            break;
        case "rams":
            seats = 16 + 14 + 10 + 10 + 3 + 8 + 10;
            type = "machines";
            break;
        case "src":
            seats = 80 + 20 + 12 + 6 + 6 + 4 + 30;
            type = "machines";
            break;
        case "ul": 
            seats = 500;
            break;
        default: 
            showNotification("ERROR: Invalid Location!", "error");
            return [-1, "NULL"];
    }

    var seatsAvail = seats * (1 - busy * 0.2);
    return [seatsAvail, type];
}

function storeReport(busy, loc, noise, date) {
    console.log(`Report Stored: ${loc}, Busy: ${busy}, Noise: ${noise}, Time: ${date}`);
}

// Function to show a notification
function showNotification(message, type = "success") {
    let notification = document.getElementById("notification");
    notification.innerHTML = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";

    
}


readCSVFile();

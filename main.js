
// document.getElementById('busy_places_dataset').addEventListener('change', readCSVFile);

function readCSVFile() {
	let tracker = []

	function filterUniqueByField(array, field) {
		const seen = new Set();
		return array.filter(item => {
			if (seen.has(item[field])) {
				return false;
			} else {
				seen.add(item[field]);
				return true;
			}
		}).filter(item => item["Location"] !== '' );
	}

    fetch('./busy_places_dataset.csv')
    .then(response => {
        return response.text()
    })
    .then(data => {
        Papa.parse(data, {
            complete: function(results) {
                const objectsArray = results.data.slice(1).map(subArray => {
					return {
						Location: subArray[0],
						Floor: subArray[1],
						Business: subArray[2],
						Noise: subArray[3],
						Productivity: subArray[4],
						Day: subArray[5],
						Time: subArray[6]
						

					};
				});
				tracker= objectsArray
            }
        });
		console.log(tracker)
		
		const uniqueLocations = filterUniqueByField(tracker,'Location')
		console.log(uniqueLocations)
		let trackerContainer = document.getElementById("tracker-container");
		const trackers = uniqueLocations.map((item, index) => {
			const trackerInfo = document.createElement("div")
			return `<div class="tracker-info" id="tracker-info" onclick="updateGraph('${item["Location"]}', '${tracker}')">
			<p class = "tracker-location">Location: ${item["Location"]}</p>
			<p class = "tracker-business">Business: ${item["Business"]}</p>
			<p class = "tracker-time">Time Updated: ${item["Time"]}</p>
			</div>`
			
		})
		let trackerInfoContainer = document.getElementById("tracker-info");
		trackerContainer.innerHTML = trackers
    });

}
function updateGraph(location, data){
	let graphContainer = document.getElementById("graph-container");
	console.log(location)
}
readCSVFile()
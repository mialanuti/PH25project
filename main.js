
// document.getElementById('busy_places_dataset').addEventListener('change', readCSVFile);

function readCSVFile() {
	let tracker = []
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
    });
}
  // response.json())
//   .then(data => console.log(data))
//   .catch(error => console.log(error));

//     if (!file) {
//         console.log("No file selected.");
//         return;
//     }

//     const reader = new FileReader();
    
//     reader.onload = function (e) {
//         const text = e.target.result;

//         // Using PapaParse to parse CSV
//         Papa.parse(text, {
//             header: true, // If the first row contains headers
//             skipEmptyLines: true, // Ignore empty lines
//             complete: function (result) {
//                 console.log("CSV Data:", result.data); // Prints array of objects
//             }
//         });
//     };

//     reader.readAsText(file);
// }


// var pig = document.getElementById("pig")
// var pig_emoji = "🐷"
// pig.onclick = function(){
// 	if(!pig.innerHTML.includes(pig_emoji)){
// 		pig.innerHTML = pig.innerHTML + pig_emoji
// 	} else {
// 		pig.innerHTML = "pig"
// 	}
// }
readCSVFile()
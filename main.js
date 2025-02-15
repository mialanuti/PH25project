var pig = document.getElementById("pig")
var pig_emoji = "🐷"
pig.onclick = function(){
	if(!pig.innerHTML.includes(pig_emoji)){
		pig.innerHTML = pig.innerHTML + pig_emoji
	} else {
		pig.innerHTML = "pig"
	}
}

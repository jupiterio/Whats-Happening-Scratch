var MAX = 20
function xhrGet(url,func) {
	var req = new XMLHttpRequest();
	func(req);
	req.open("get", url, true);
	req.send();
}
document.addEventListener("DOMContentLoaded", function() {
	xhrGet("http://scratch.mit.edu/session",function(req){
		req.onload = function(){
			var jsonR = JSON.parse(req.responseText);
			if (jsonR.user) {
				var username = jsonR.user.username; console.log("Logged in: "+username);
				xhrGet("https://api.scratch.mit.edu/proxy/users/"+username+"/activity?limit=" + MAX,function(req){
					req.onload = function(){
						var jsonR = JSON.parse(req.responseText);
						var eUl = document.createElement("ul");
						for (var act in jsonR) {
							var eLi = document.createElement("li");
							// Image
							var eA = document.createElement("a");
							var eAImg = document.createElement("img")
							eA.setAttribute("href","http://scratch.mit.edu/users/"+jsonR[act].actor.username);
							eA.setAttribute("class","avatarlink");
							eAImg.setAttribute("class","avatar");
							eAImg.setAttribute("src","http:"+jsonR[act].actor.thumbnail_url);
							eAImg.setAttribute("width","32");
							eAImg.setAttribute("height","32");
							eA.appendChild(eAImg);
							eLi.appendChild(eA);
							// Message
							var eDiv = document.createElement("div");
							var eDA = document.createElement("a");
							eDA.setAttribute("href","http://scratch.mit.edu/users/"+jsonR[act].actor.username);
							eDA.setAttribute("class","actor");
							eDA.innerText = jsonR[act].actor.username;
							eDiv.appendChild(eDA);
							eDiv.innerHTML += " "+jsonR[act].message.replace(/\n/g,'').replace(/    /g,' ').replace(/href="\//g,'target="_blank" href="https://scratch.mit.edu/');
							eDiv.querySelector("a:not(.actor):not(.avatarlink)").setAttribute("class","scratchlink");
							// How much ago
							var eDSpan = document.createElement("span");
							eDSpan.setAttribute("class","time");
							var today = new Date();
							var actDate = new Date(jsonR[act].datetime_created);
							var timeDiff = Math.abs(actDate.getTime() - today.getTime()) + (today.getTimezoneOffset() * 60 * 1000);
							var diff = { year:(today.getYear() - actDate.getYear()),
										 month:((today.getYear()*12-12+today.getMonth())-(actDate.getYear()*12-12+actDate.getMonth())),
										 day:(Math.round(timeDiff / (1000 * 3600 * 24))),
										 hour:(Math.round(timeDiff / (1000 * 3600))),
										 min:(Math.round(timeDiff / (1000 * 60))),
										 sec:(Math.round(timeDiff / 1000))
							};
							var ago =	((diff.year > 0) ? (diff.year + "&nbsp;years") : "") + " " +
										(((diff.month % 12) > 0) ? ((diff.month % 12) + "&nbsp;months") : "") + " " +
										((diff.day > 0) && (diff.day < 31) ? (diff.day + "&nbsp;days") : "") + " " +
										((diff.hour > 0) && (diff.hour < 24) ? (diff.hour + "&nbsp;hours") : "") + " " +
										((diff.min > 0) && (diff.min < (24*60)) ? ((diff.min-60*Math.floor(diff.min / 60)) + "&nbsp;minutes") : "") + " " +
										((diff.sec < (60*60)) ? ((diff.sec-60*Math.floor(diff.sec / 60)) + "&nbsp;seconds") : "") + " ago"
							eDSpan.innerHTML = ago;
							eDiv.appendChild(eDSpan);
							eLi.appendChild(eDiv);
							
							eUl.appendChild(eLi);
						}
						document.getElementById("status").appendChild(eUl);
					};
					req.onerror = function(e){
						document.getElementById("status").innerHTML = "An error occured: " + e;
						console.error("An error occured: " + e)
					};
				});
			}else{ console.error("Not logged in"); document.getElementById("status").innerHTML = "Not logged in"; }
		}
	});
});
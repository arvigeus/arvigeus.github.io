function password() {
	var masterSalt = 1, res = "";
	for (var i = 0; i < arguments.length; i++) {
		for (var j = 0; j < arguments[i].length; j++)
			masterSalt *= arguments[i].charCodeAt(j) * (i + 1) * (j + 1);
	}

	while(masterSalt > 0) {
		res += String.fromCharCode((masterSalt % 93) + 33);
		masterSalt = Math.floor(masterSalt / 93);
	}
	return res;
}
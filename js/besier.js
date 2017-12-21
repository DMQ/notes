function bezier(pots, amount){
	var pot;
	var lines;
	var ret = [];
	var points;
	for(var i = 0; i <= amount; i++){
		points = pots.slice(0);	
		lines = [];
		while(pot = points.shift()){
			if(points.length){
				lines.push( pointLine([pot, points[0]], i / amount) );
			}else if(lines.length > 1){
				points = lines;
				lines = [];
			}else{
				break;
			}
		}
		ret.push(lines[0]);
	}
	function pointLine(points, rate){
		return {
			x: (1 - rate) * points[0].x + rate * points[1].x,
			y: (1 - rate) * points[0].y + rate * points[1].y
		}
	}
	return ret; 
}

function bezier2(points, amount) {
	var p = [];
	for (var i = 0; i <= amount; i++) {
		p.push(calcBesier(points, i / amount))
	}

	return p
}

function calcBesier(points, rate) {
	var x = 0, y = 0,
		len = points.length,
		n = len - 1

	var temp
	for (var i = 0; i < len; i++) {
		temp = compose(n, i) * Math.pow((1 - rate), n - i) * Math.pow(rate, i)
		x += temp * points[i].x
		y += temp * points[i].y
	}

	return {x: x, y: y}
}


// 计算组合数值，Cn,m => n! / ((n - m)! * m!); eg: C5,3 = 5*4*3*2*1 / 2*1 * 3*2*1 = 10
function compose(n, m) {
	if (m == 0 || m == n) return 1
	if (m == 1 || m == (n - 1)) return n

	return factorial(n) / (factorial(n - m) * factorial(m))
}

// 计算杨辉三角（贝塞尔公式的每一项的常数项系数）
function calcYHTriangle(level) {
	console.log(1)
	console.log(1, 1)

	for (var i = 3; i <= level; i++) {
		var nums = [1]
		for (var j = 2; j < i; j++) {
			nums.push(compose(i - 1, j - 1))
		}
		nums.push(1)
		console.log.apply(console, nums)
	}
}

function factorial(n) {
	if (n < 1) return n

	var result = 1;
	while (n > 1) {
		result = result * n--
	}
	return result
}
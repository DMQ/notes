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
		n = len - 1	// 几阶

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

	// return factorial(n) / (factorial(n - m) * factorial(m))

	// 优化，C5,1 => C5,4，两者相等的
	var r = n - m
	if (r > m) {
		m = r
	}

	// 公式简化
	return factorial(n, m) / factorial(n - m)
}

// 计算阶乘，若传入m，则乘到m的前一个数就结束
function factorial(n, m) {
	if (n < 1) return n

	m = m || 1;

	var result = 1;
	while (n > m) {
		result = result * n--
	}


	return result
}

// 杨辉三角: https://baike.baidu.com/item/%E6%9D%A8%E8%BE%89%E4%B8%89%E8%A7%92

// 通过第i行，j列的数字等于 第i-1行 第j-1列 + 第j列数字的和
// 的特性，计算杨辉三角n层的数据（贝塞尔公式的每一项的常数项系数）
function calcYHTriangle2(n) {
	if (n == 1) return [1]

	var temp;
	var arr = [1, 1];	// 第二层的数据

	// 第三层开始遍历
	for (var i = 3; i <= n; i++) {

		// 拷贝上一层的数据
		temp = arr.slice(0)

		// 第一个值永远是1
		arr[0] = 1
		// 当前层的第j个位置的值等于上一层的j-1位置 + j位置的值
		// arr[j] = temp[j - 1] + temp[j]
		for (var j = 1; j < i - 1; j++) {
			arr[j] = temp[j - 1] + temp[j]
		}

		// 最后一个值永远是1
		arr.push(1)
	}

	return arr
}

// 通过组合数的特性，计算杨辉三角（贝塞尔公式的每一项的常数项系数）
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


function bezier3(points, amount) {
	var len = points.length

	if (len < 2) return // 至少两个点

	// var n = len - 1; // 几阶

	// 计算公式的多项式常数（杨辉三角规律）

	var c_n_k = calcYHTriangle2(len)
	var arr = []

	// 总点数
	for (var i = 0; i <= amount; i++) {
		var x = 0, y = 0;
		var temp;
		var n = len - 1; // 几阶
		var rate = i / amount


		// 遍历控制点
		for (var j = 0; j < len; j++) {
			temp = c_n_k[j] * Math.pow((1 - rate), n - j) * Math.pow(rate, j)
			x += temp * points[j].x
			y += temp * points[j].y
		}

		arr.push({x: x, y: y})
	}

	return arr
}



// calcYHTriangle(8)
// console.log(factorial(5, 2))
// console.log(besier3([{x:0, y:0}, {x:1, y:0}, {x:1, y:1}], 10))
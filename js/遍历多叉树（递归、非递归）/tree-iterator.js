(function (window, undefined) {
	var treeNodes = [
	   {
	        id: 1,
	        name: '1',
	        children: [
	             {
	                  id: 11,
	                  name: '11',
	                  children: [
	                       {
	                            id: 111,
	                            name: '111',
	                            children:[]
	                       },
	                       {
	                            id: 112,
	                            name: '112'
	                       }
	                  ]
	             },
	             {
	                  id: 12,
	                  name: '12',
	                  children: []
	             }
	        ],
	        users: []
	   },
	   {
	        id: 2,
	        name: '2',
	        children: [
	        	{
	        		id: 22,
	        		name: '22',
	        		children: []
	        	}
	        ]
	   }
	];

	//递归实现
	var parseTreeJson = function(treeNodes){
	   var treeNodes = treeNodes || {};

	   for (var i = 0, len = treeNodes.length; i < len; i++) {

	        var childs = treeNodes[i].children;

	        console.log(treeNodes[i].id);

	        if(childs && childs.length > 0){
	             parseTreeJson(childs);
	        }
	   }
	};

	console.log('------------- 递归实现 ------------------');
	parseTreeJson(treeNodes);

	//非递归广度优先实现
	var iterator1 = function (treeNodes) {
		var stack = [];

		if (!treeNodes || !treeNodes.length) return;

		//先将第一层节点放入栈
		for (var i = 0, len = treeNodes.length; i < len; i++) {
			stack.push(treeNodes[i]);
		}

		var item;

		while (stack.length) {
			item = stack.shift();

			console.log(item.id);

			//如果该节点有子节点，继续添加进入栈底
			if (item.children && item.children.length) {
				//len = item.children.length;

				// for (i = 0; i < len; i++) {
				// 	stack.push(item.children[i]);
				// }

				stack = stack.concat(item.children);
			}
		}
	};

	console.log('------------- 非递归广度优先实现 ------------------');
	iterator1(treeNodes);

	//非递归深度优先实现
	var iterator2 = function (treeNodes) {
		var stack = [];

		if (!treeNodes || !treeNodes.length) return;

		//先将第一层节点放入栈
		for (var i = 0, len = treeNodes.length; i < len; i++) {
			stack.push(treeNodes[i]);
		}

		var item;

		while (stack.length) {
			item = stack.shift();

			console.log(item.id);

			//如果该节点有子节点，继续添加进入栈顶
			if (item.children && item.children.length) {
				// len = item.children.length;

				// for (; len; len--) {
				// 	stack.unshift(item.children[len - 1]);
				// }
				stack = item.children.concat(stack);
			}
		}
	};

	console.log('------------- 非递归深度优先实现 ------------------');
	iterator2(treeNodes);
})(window);
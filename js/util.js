/**
 * reverse dom of a parentNode children
 * @param parent parentNode
 * @return undefined
 */
function reverseDom (parent) {
	var nodes = parent.childNodes, cur, newNode = document.createDocumentFragment();
	for (var len=nodes.length, i=len; i; i--) {
		cur = nodes[i - 1];
		if(cur.nodeType === 1) {
			newNode.appendChild(cur);
		}
	};
	parent.innerHTML = '';
	parent.appendChild(newNode);
}

(function () {
	if (window.getComputedStyle) {
		//morden
		window.getStyle = function (obj, style) {
			return window.getComputedStyle(obj, false)[style];
		}
	} else {
		//ie
		window.getStyle = function (obj, style) {
			return obj.currentStyle[style];
		}
	}
})()
window.onload = function () {
	//register
	var modalProto = Object.create(HTMLElement.prototype);

	modalProto.createdCallback = function () {
		var template = document.querySelector('#modal');
		this.createShadowRoot().appendChild(document.importNode(template.content, true));
	}

	document.registerElement('leslie-modal', {
		prototype: modalProto
	});
}

function getById (id) {
	return document.getElementById(id);
}
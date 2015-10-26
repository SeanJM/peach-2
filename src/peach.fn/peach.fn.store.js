Peach.fn.store = function (string) {
	var store = this._protected.store[string];
	if (typeof store === 'object') {
		return store.value;
	} else {
		return false;
	}
};

Peach.fn.getParent = function (objectName, length) {
	length     = (typeof length === 'undefined') ? 1 : length;
  objectName = objectName.split('.');
  objectName = objectName.slice(0, objectName.length - length);
  return this.get(objectName.join('.'));
};
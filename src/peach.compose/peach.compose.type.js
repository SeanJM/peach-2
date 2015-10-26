Peach.compose.type = function (value) {
  if (typeof value === 'object' && typeof value.value !== 'string') {
    if ($.isArray(value)) {
      Peach.compose.array(value);
    } else {
      Peach.compose.object(value);
    }
  }
  return value;
};


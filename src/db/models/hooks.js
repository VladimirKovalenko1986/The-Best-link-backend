const mongooseSaveError = (error, data, next) => {
  error.status = 400;
  next();
};

const setUpdateSettigs = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};

export { mongooseSaveError, setUpdateSettigs };

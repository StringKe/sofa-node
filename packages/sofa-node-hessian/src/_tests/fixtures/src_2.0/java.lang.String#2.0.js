
module.exports = function (compile, classMap, version, utils) {
  return function encode(obj,encoder,appClassMap){
  if (obj && obj.$class) { obj = obj.$; }
  if (obj == null) { return encoder.writeNull(); }
  if (typeof obj === 'number') { obj = obj.toString(); }
  encoder.writeString(obj);
};
};

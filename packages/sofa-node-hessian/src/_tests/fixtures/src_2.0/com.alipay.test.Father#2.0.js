
module.exports = function (compile, classMap, version, utils) {
  return function encode(obj,encoder,appClassMap){
  if (obj == null) { return encoder.writeNull(); }
  if (obj && obj.$class) {
    const fnKey = utils.normalizeUniqId(obj, version);
    compile(fnKey, obj, classMap, version, {"debug":true,"debugDir":"/Users/chen/Project/Company/TianXiaYinShang/sofa-node/packages/sofa-node-hessian/src/_tests/fixtures/src_2.0","debugForce":false})(obj.$, encoder, appClassMap);
    return;
  }
  if (encoder._checkRef(obj)) { return; }
  const ref = encoder._writeObjectBegin('com.alipay.test.Father');
  if (ref === -1) {
  encoder.writeInt(1);
  encoder.writeString('foo');
  encoder._writeObjectBegin('com.alipay.test.Father'); }
  compile('java.lang.String#2.0', {"type":"java.lang.String"}, classMap, version, {"debug":true,"debugDir":"/Users/chen/Project/Company/TianXiaYinShang/sofa-node/packages/sofa-node-hessian/src/_tests/fixtures/src_2.0","debugForce":false})(obj['foo'], encoder, appClassMap);
};
};

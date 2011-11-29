var xmlshim = require('../');
var xs, doc;

/**
 * Strip xml preambel and leading/trailing whitespace
 */
function xmltrim(str) {
    str = str.replace(/^<\?xml[^>]*>/,'');
    str = str.replace(/^\s*/,'');
    str = str.replace(/\s*$/,'');
    return str;
}

exports.setUp = function(callback) {
    xs = new xmlshim.XMLSerializer();
    doc = xmlshim.implementation.createDocument('', '', null);
    callback();
};

exports['should write single element non-namespace xml'] = function(test) {
    var expect = '<hello-world/>';
    var result;
    var root = doc.createElement('hello-world');

    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
};

exports['should write elements with default namespace'] = function(test) {
    var expect = '<hello xmlns="http://example.com/"><world/></hello>';
    var result;
    var root = doc.createElementNS('http://example.com/', 'hello');
    var child = doc.createElementNS('http://example.com/', 'world');

    root.appendChild(child);
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
};

exports['should write elements with namespace prefix'] = function(test) {
    var expect = '<hello xmlns="http://example.com/"><big:world xmlns:big="http://example.com/big"/></hello>';
    var result;
    var root = doc.createElementNS('http://example.com/', 'hello');
    var child = doc.createElementNS('http://example.com/big', 'big:world');

    root.appendChild(child);
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
}

exports['should write non-namespace attributes'] = function(test) {
    var expect = '<hello say="world"/>';
    var result;
    var root = doc.createElement('hello');

    root.setAttribute('say', 'world');
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
}

exports['should write attributes with namespace uri'] = function(test) {
    var expect = '<hello aloud:say="world" xmlns:aloud="http://example.com/"/>';
    var result;
    var root = doc.createElement('hello');

    root.setAttributeNS('http://example.com/', 'aloud:say', 'world');
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
}

exports['should write text node'] = function(test) {
    var expect = '<hello>world</hello>';
    var result;
    var root = doc.createElement('hello');
    var child = doc.createTextNode('world');

    root.appendChild(child);
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
}

exports['should write CDATA section'] = function(test) {
    var expect = '<hello><![CDATA[> world <]]></hello>';
    var result;
    var root = doc.createElement('hello');
    var child = doc.createCDATASection('> world <');

    root.appendChild(child);
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
}

exports['should write comments'] = function(test) {
    var expect = '<hello><!--world--></hello>';
    var result;
    var root = doc.createElement('hello');
    var child = doc.createComment('world');

    root.appendChild(child);
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
}

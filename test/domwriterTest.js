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
    doc = new xmlshim.implementation.createDocument('', '', null);
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

exports['child elements should inherit namespaces from parent'] = function(test) {
    var expect = '<hello xmlns:big="http://example.com/big" xmlns="http://example.com/"><big:world/></hello>';
    var result;
    var root = doc.createElementNS('http://example.com/', 'hello');
    var child = doc.createElementNS('http://example.com/big', 'big:world');

    root.appendChild(child);
    root.setAttribute('xmlns:big', 'http://example.com/big');
    doc.appendChild(root);

    result = xmltrim(xs.serializeToString(doc));
    test.equals(expect, result);

    test.done();
}

/*
exports['child elements may override namespaces from parent'] = function(test) {
    var input = '<hello xmlns="http://example.com/" xmlns:big="http://example.com/bigwide"><big:world xmlns:big="http://example.com/big"></hello>';
    var doc = xs.parseFromString(input, 'text/xml');

    test.equals(doc.firstChild.nodeName, 'hello');
    test.equals(doc.firstChild.namespaceURI, 'http://example.com/');

    test.equals(doc.firstChild.firstChild.nodeName, 'big:world');
    test.equals(doc.firstChild.firstChild.namespaceURI, 'http://example.com/big');

    test.done();
}

exports['should parse non-namespace attributes'] = function(test) {
    var input = '<hello say="world"/>';
    var doc = xs.parseFromString(input, 'text/xml');

    test.equals(doc.firstChild.nodeName, 'hello');
    test.equals(doc.firstChild.getAttributeNode('say').nodeValue, 'world');

    test.done();
}

exports['should parse attributes with namespace uri'] = function(test) {
    var input = '<hello xmlns:aloud="http://example.com/" aloud:say="world"/>';
    var doc = xs.parseFromString(input, 'text/xml');

    test.equals(doc.firstChild.nodeName, 'hello');
    test.equals(doc.firstChild.getAttributeNode('aloud:say').nodeValue, 'world');
    test.equals(doc.firstChild.getAttributeNode('aloud:say').namespaceURI, 'http://example.com/');

    test.done();
}

exports['should parse text node'] = function(test) {
    var input = '<hello>world</hello>';
    var doc = xs.parseFromString(input, 'text/xml');

    test.equals(doc.firstChild.nodeName, 'hello');
    test.equals(doc.firstChild.firstChild.nodeType, doc.TEXT_NODE);
    test.equals(doc.firstChild.firstChild.nodeValue, 'world');

    test.done();
}

exports['should parse CDATA section'] = function(test) {
    var input = '<hello><![CDATA[> world <]]></hello>';
    var doc = xs.parseFromString(input, 'text/xml');

    test.equals(doc.firstChild.nodeName, 'hello');
    test.equals(doc.firstChild.firstChild.nodeType, doc.CDATA_SECTION_NODE);
    test.equals(doc.firstChild.firstChild.nodeValue, '> world <');

    test.done();
}

exports['should parse comments'] = function(test) {
    var input = '<hello><!--world--></hello>';
    var doc = xs.parseFromString(input, 'text/xml');

    test.equals(doc.firstChild.nodeName, 'hello');
    test.equals(doc.firstChild.firstChild.nodeType, doc.COMMENT_NODE);
    test.equals(doc.firstChild.firstChild.nodeValue, 'world');

    test.done();
}
*/

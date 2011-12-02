var dom = require("jsdom").level(3, 'core'),
    xml = require("libxmljs"),
    parserForDocument = require("./domparser.js").parserForDocument,
    DOMWriter = require("./domwriter.js").DOMWriter;

exports.DOMParser = function() {
}

exports.DOMParser.prototype.parseFromString = function(str, mime) {
    var doc = new dom.Document(),
        parser = new xml.SaxParser(parserForDocument(doc));

    parser.parseString(str);
    return doc;
}


exports.XMLSerializer = function() {
}

exports.XMLSerializer.prototype.serializeToString = function(doc) {
    var textwriter = new xml.TextWriter(),
        domwriter = new DOMWriter(textwriter),
        result;

    textwriter.openMemory();

    // libxml xmlTextWriterStartDocument not only writes the document preamble
    // but also sets up functions used for document encoding. Therefore we
    // need to call startDocument in any case, also for document fragments and
    // single nodes. By calling outputMemory immediately after starting the
    // document, we get rid of the preamble.
    textwriter.startDocument();
    textwriter.outputMemory();          // flush buffer and discard preamble

    if (doc.nodeType !== doc.DOCUMENT_NODE) {
        // Wrap contents into an element in order to force libxml textwriter
        // into element-mode. This will trigger proper entity escaping for text
        // nodes.
        textwriter.startElementNS(undefined, 'dummy');
        textwriter.writeString('');     // close dummy start-tag
        textwriter.outputMemory();      // flush buffer
    }

    domwriter.writeNode(doc);           // write actual contents
    result = textwriter.outputMemory(); // collect results

    // let's play nice and get the textwriter into a proper state again
    textwriter.endDocument();
    textwriter.outputMemory();          // flush buffer

    return result;
};


exports.implementation = new (dom.DOMImplementation)();

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
        domwriter = new DOMWriter(textwriter);

    textwriter.openMemory();
    domwriter.writeDocument(doc);
    return textwriter.outputMemory();
};


exports.implementation = new (dom.DOMImplementation)();

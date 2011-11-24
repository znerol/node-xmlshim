function DOMWriter(writer) {
    this.writer = writer;
    this.nsstack = [];
    this.defaultns = undefined;
}

DOMWriter.prototype.writeDocument = function(doc) {
    this.writer.startDocument();
    this.writeElement(doc.documentElement);
    this.writer.endDocument();
}

DOMWriter.prototype.writeNode = function(node) {
    switch (node.nodeType) {
        case node.ELEMENT_NODE:
            this.writeElement(node);
            break;

        case node.ATTRIBUTE_NODE:
            this.writeAttribute(node);
            break;

        case node.TEXT_NODE:
            this.writeText(node);
            break;

        case node.CDATA_SECTION_NODE:
            this.writeCdata(node);
            break;

        default:
            console.log('Serialization of node type ' + node.nodeType +
                    ' not supported yet');
            break;
    }
};

DOMWriter.prototype.writeElement = function(element) {
    var i;
    var prefix = element.prefix || undefined;
    var nsURI = element.namespaceURI || undefined;
    var name = element.tagName || undefined;

    /*
    if (prefix) {
        // Element with prefix. look up prefix in nsstack. If prefix/uri pair
        // is found, undefine prefix. If otherwise set new prefix/uri

    }
    if (namespace) {
        // Element in default namespace. Lookup default namespace. If it
        // matches, undefine namespace. Otherwise push new namespace.
    }
    */

    this.writer.startElementNS(prefix, name, nsURI);

    for (i=0; i < element.attributes.length; i++) {
        this.writeAttribute(element.attributes[i]);
    }

    for (i=0; i < element.childNodes.length; i++) {
        this.writeNode(element.childNodes[i]);
    }

    this.writer.endElement();
};

DOMWriter.prototype.writeAttribute = function(attribute) {
    var prefix = attribute.prefix || undefined;
    var nsURI = attribute.namespaceURI || undefined;
    var name = attribute.name || undefined;

    this.writer.startAttributeNS(prefix, name, nsURI);
    this.writer.writeString(attribute.value);
    this.writer.endAttribute();
};

DOMWriter.prototype.writeText = function(text) {
    this.writer.writeString(text.data);
};

DOMWriter.prototype.writeCdata = function(cdata) {
    this.writer.startCdata();
    this.writer.writeString(cdata.data);
    this.writer.endCdata();
};

exports.DOMWriter = DOMWriter;

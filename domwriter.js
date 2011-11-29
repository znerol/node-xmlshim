function DOMWriter(writer) {
    this.writer = writer;
    this.prefixmap = {};
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

        case node.COMMENT_NODE:
            this.writeComment(node);
            break;

        default:
            console.log('Serialization of node type ' + node.nodeType +
                    ' not supported yet');
            break;
    }
};

DOMWriter.prototype.writeElement = function(element) {
    var i, prefix, nsURI, name, attr, attrPrefix, attrURI,
        prefixInsert = [], prefixOverride = [];

    name = element.nodeName.split(':').slice(-1)[0];
    nsURI = element.namespaceURI || undefined;
    prefix = element.prefix || undefined;

    if (prefix) {
        if (this.prefixmap.hasOwnProperty(prefix)) {
            if (this.prefixmap[prefix] === nsURI) {
                nsURI = undefined;
            }
            else {
                prefixOverride.push({
                    prefix: prefix,
                    URI: this.prefixmap[prefix]
                });
            }
        }
        else {
            this.prefixmap[prefix] = nsURI;
            prefixInsert.push(prefix);
        }
    }

    if (nsURI && !prefix) {
        if (nsURI !== this.defaultns) {
            this.defaultns = nsURI;
        }
        else {
            nsURI = undefined;
        }
    }

    this.writer.startElementNS(prefix, name, nsURI);

    for (i=0; i < element.attributes.length; i++) {
        attr = element.attributes[i];
        if (attr.name.substr(0, 6) === 'xmlns:') {
            attrPrefix = attr.nodeName.split(':').slice(-1)[0];
            attrURI = attr.value;

            if (this.prefixmap.hasOwnProperty(attrPrefix)) {
                if (this.prefixmap[prefix] === attrURI) {
                    // FIXME: should we suppress emission of xmlns:
                    // attribute if there is already a correct prefix
                    // mapping?
                }
                else {
                    prefixOverride.push({
                        prefix: attrPrefix,
                        URI: this.prefixmap[attrPrefix]
                    });
                }
            }
            else {
                this.prefixmap[attrPrefix] = attrURI;
                prefixInsert.push(attrPrefix);
            }

            this.writer.startAttributeNS(undefined, attr.nodeName);
            this.writer.writeString(attrURI);
            this.writer.endAttribute();
        }
        else {
            this.writeAttribute(element.attributes[i]);
        }
    }

    for (i=0; i < element.childNodes.length; i++) {
        this.writeNode(element.childNodes[i]);
    }

    this.writer.endElement();

    for (i=prefixOverride.length - 1; i >=0 ; i--) {
        this.prefixmap[prefixOverride[i].prefix] = prefixOverride[i].URI;
    }
    for (i=prefixInsert.length - 1; i >=0 ; i--) {
        delete this.prefixmap[prefixInsert[i]];
    }

};

DOMWriter.prototype.writeAttribute = function(attribute) {
    var name, nsURI, prefix;

    name = attribute.nodeName.split(':').slice(-1)[0];
    nsURI = attribute.namespaceURI || undefined;
    prefix = attribute.prefix || undefined;

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

DOMWriter.prototype.writeComment = function(comment) {
    this.writer.startComment();
    this.writer.writeString(comment.data);
    this.writer.endComment();
}

exports.DOMWriter = DOMWriter;

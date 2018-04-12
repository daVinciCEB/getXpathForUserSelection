/**
* Get the XPath for the text on the webpage highlighted by the user.
*/
var getXPathForUserSelection = function() {
    var selectedElement = getSelectionBoundaryElement("start");
    if (selectedElement)
        return getElementXPath(selectedElement);
    else
        return "You must select an element first!"
}

/**
* Gets the Element object of the user highlighted element.
*/
var getSelectionBoundaryElement = function(isStart) {
    var range, sel, container;
    // Use document.selection in Internet Explorer, otherwise, use window.getSelection()
    if (document.selection) {
        range = document.selection.createRange();
        range.collapse(isStart);
        return range.parentElement();
    } else {
        sel = window.getSelection();
        if (sel.getRangeAt) {
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0);
            }
        } else {
            // Old WebKit
            range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the document)
            if (range.collapsed !== sel.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }
       }
        if (range) {
           container = range.commonAncestorContainer;

           // Check if the container is a text node and return its parent if so
           return container.nodeType === 3 ? container.parentNode : container;
        }   
    }
}

/**
* Gets an XPath for an element.
*/
var getElementXPath = function(element) {
    // If the element already has an Id, use that, otherwise, build XPath Tree
    if (element && element.id)
        return '//*[@id="' + element.id + '"]';
    else
        return getElementTreeXPath(element);
};

/**
* Gets the XPath Tree for an element.
*/
var getElementTreeXPath = function(element) {
    var paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == 1; element = element.parentNode)  {
        var index = 0;
        // If this element in the tree has an Id, use that, otherwise, continue building XPath Tree
        if (element && element.id) {
            paths.splice(0, 0, '/*[@id="' + element.id + '"]');
            break;
        }

        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = (index ? "[" + (index+1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
};

// handle click and add class
$("#submit-button").on("click", function(){
    alert(getXPathForUserSelection());
})

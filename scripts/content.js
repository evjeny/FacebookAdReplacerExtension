const adXpath = `//div[contains(@class, 'story_body_container') and .//span[contains(., "Реклама")]]`
console.log("BEGIN!!!")

function getElementsByXpath(xpath) {
    var result = []
    const iterator = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

    try {
        let thisNode = iterator.iterateNext();

        while (thisNode) {
            result.push(thisNode);
            thisNode = iterator.iterateNext();
        }
    } catch(e) {
    }
    return result;
}

function lookupAds() {
    getElementsByXpath(adXpath).forEach(element => {
        console.log("FOUND!!!")
        console.log(element)
        element.style.backgroundColor = "#FFFF00"
    })
}

var intervalId = window.setInterval(function(){
    lookupAds();
}, 500);

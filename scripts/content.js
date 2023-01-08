const adXpath = `//div[contains(@data-pagelet, 'FeedUnit_') and .//span[contains(., "Реклама")]]`
const adVideoPlayerXpath = `.//div[@aria-label='Смотреть видео']`
const adImageXpath = `.//a[@role='link']//img`

const testedAttributeName = "facebook-ad-replacer-tested"

var debug = false

console.log("begin ad detector script")

function getImageReplaceUrl(imageUrl) {
    return "https://cdn.pixabay.com/photo/2012/04/23/16/12/click-38743_960_720.png"
}

function getVideoReplaceUrl(videoUrl) {
    return videoUrl
}

function getSingleElementByXpath(xpath, parentElement) {
    return document.evaluate(xpath, parentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getElementsByXpath(xpath, parentElement) {
    var result = []
    const iterator = document.evaluate(xpath, parentElement, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

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

function markNotTestedElement(element) {
    if (element.getAttribute(testedAttributeName) !== "true") {
        element.setAttribute(testedAttributeName, "true")
        return true
    }
    return false
}

function testMultipleVideo(element) {
    const videoElements = getElementsByXpath(adVideoPlayerXpath, element);
    if (videoElements.length === 0) {
        return false
    }

    if (debug) { alert("VIDEO") }

    element.style.backgroundColor = "#CC0066"
    return true
}

function testMultipleImages(element) {
    const imageElements = getElementsByXpath(adImageXpath, element)
    if (imageElements.length === 0) {
        return false
    }

    if (debug) { alert("IMAGE") }

    imageElements.forEach(imageElement => {
        var imageSource = imageElement.getAttribute("src")
        imageElement.setAttribute("src", getImageReplaceUrl(imageSource))

        if (debug) {
            console.log("met new image source: " + imageSource)
            console.log(imageElement)
        }
    })
    return true
}

function lookupAds() {
    getElementsByXpath(adXpath, document).forEach(element => {
        if (markNotTestedElement(element)) {
            element.style.backgroundColor = "#000000"
            if (testMultipleVideo(element)) {}
            else if (testMultipleImages(element)) {}
        }
    })
}

var intervalId = window.setInterval(function(){
    lookupAds();
}, 5);

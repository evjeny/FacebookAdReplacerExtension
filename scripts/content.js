// const adXpath = `//div[contains(@class, 'story_body_container') and .//span[contains(., "Реклама")]]`
const adXpath = `//div[contains(@data-pagelet, 'FeedUnit_') and .//span[contains(., "Реклама")]]`
const adVideoPlayerXpath = `.//div[@aria-label='Смотреть видео']`
const adImageXpath = `.//a[@role='link']//img` // target="_blank"

const testedAttributeName = "facebook-ad-replacer-tested"
console.log("BEGIN!!!")

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

function testVideo(element) {
    const xpathResult = getSingleElementByXpath(adVideoPlayerXpath, element);
    if (xpathResult === null) {
        return false
    }

    element.style.backgroundColor = "#CC0066"
    return true
}

function testMultipleImages(element) {
    const foundImages = getElementsByXpath(adImageXpath, element)
    if (foundImages.length == 0) {
        return false
    }

    foundImages.forEach(imageElement => {
        if (markNotTestedElement(imageElement)) {
            var imageSource = imageElement.getAttribute("src")
            console.log("met new image source: " + imageSource)
            imageElement.setAttribute("src", getImageReplaceUrl(imageSource))
        }
    })
    return false
}

function testImage(element) {
    const xpathResult = getSingleElementByXpath(adImageXpath, element);
    if (xpathResult === null) {
        return false
    }
    if (markNotTestedElement(element)) {
        var imageSource = xpathResult.getAttribute('src')
        console.log("met new image source: " + imageSource)
        xpathResult.setAttribute("src", getImageReplaceUrl(imageSource))
        return true
    }
    return false
}

function lookupAds() {
    getElementsByXpath(adXpath, document).forEach(element => {
        element.style.backgroundColor = "#000000"
        if (testVideo(element)) {
            console.log("video: ");
            console.log(element);
        }
        else if (testImage(element)) {
            console.log("image: ");
            console.log(element);
        }
    })
}

var intervalId = window.setInterval(function(){
    lookupAds();
}, 500);

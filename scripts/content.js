const adXpath = `//div[contains(@data-pagelet, 'FeedUnit_') and .//span[contains(., "Реклама")]]`
const adVideoPlayerXpath = `.//div[@aria-label='Смотреть видео']`
const adImageXpath = `.//a[@role='link']//img`

const testedAttributeName = "facebook-ad-replacer-tested"
const baseAPIUrl = "https://o5y4lh.deta.dev"
const lookupIntervalMilliseconds = 200

var debug = true

console.log("begin ad detector script")

function makeAPICall(method, link, callback) {
  chrome.runtime.sendMessage(
    {
      contentScriptQuery: "getReplaceLink",
      url: `${baseAPIUrl}/${method}`,
      link: link,
    },
    (data) => callback(data)
  )
}

function getVideoReplaceUrl(videoUrl) {
  return videoUrl
}

function replaceImageSource(imageElement) {
  makeAPICall("image-link/", imageElement.getAttribute("src"), (link) => {
    console.log("replace with link " + link)
    imageElement.setAttribute("src", link)
  })
}

function getSingleElementByXpath(xpath, parentElement) {
  return document.evaluate(
    xpath,
    parentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
}

function getElementsByXpath(xpath, parentElement) {
  var result = []
  const iterator = document.evaluate(
    xpath,
    parentElement,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null
  )

  try {
    let thisNode = iterator.iterateNext()

    while (thisNode) {
      result.push(thisNode)
      thisNode = iterator.iterateNext()
    }
  } catch (e) {}
  return result
}

function markNotTestedElement(element) {
  if (element.getAttribute(testedAttributeName) !== "true") {
    element.setAttribute(testedAttributeName, "true")
    return true
  }
  return false
}

function testMultipleVideo(element) {
  const videoElements = getElementsByXpath(adVideoPlayerXpath, element)
  if (videoElements.length === 0) {
    return false
  }

  if (debug) {
    alert("VIDEO")
  }

  element.style.backgroundColor = "#CC0066"
  return true
}

function testMultipleImages(element) {
  const imageElements = getElementsByXpath(adImageXpath, element)
  if (imageElements.length === 0) {
    return false
  }

  if (debug) {
    alert("IMAGE")
  }

  imageElements.forEach((imageElement) => {
    replaceImageSource(imageElement)

    if (debug) {
      console.log(imageElement)
    }
  })
  return true
}

function lookupAds() {
  getElementsByXpath(adXpath, document).forEach((element) => {
    if (markNotTestedElement(element)) {
      element.style.backgroundColor = "#000000"
      if (testMultipleVideo(element)) {
      } else if (testMultipleImages(element)) {
      }
    }
  })
}

var intervalId = window.setInterval(function () {
  lookupAds()
}, lookupIntervalMilliseconds)

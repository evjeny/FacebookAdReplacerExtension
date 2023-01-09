const adXpath = `//div[contains(@data-pagelet, 'FeedUnit_') and .//span[contains(., "Реклама")]]`
const adVideoPlayerXpath = `.//div[@aria-label='Смотреть видео']`
const adImageXpath = `.//a[@role='link']//img`
const adVideoPreviewXpath = `.//img[@referrerpolicy='origin-when-cross-origin']`

const testedAttributeName = "facebook-ad-replacer-tested"
const baseAPIUrl = "https://o5y4lh.deta.dev"
const lookupIntervalMilliseconds = 10

var debug = false

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

function replaceImageSource(imageElement) {
  let imageSource = imageElement.getAttribute("src")
  console.log(`got image source: ${imageSource}`)

  makeAPICall("image-link/", imageSource, (link) => {
    imageElement.setAttribute("src", link)
  })
}

function replaceVideoSource(videoElement) {
  let videoPreviewSrc = getSingleElementByXpath(
    adVideoPreviewXpath,
    videoElement
  ).getAttribute("src")

  console.log(`got video preview: ${videoPreviewSrc}`)

  makeAPICall("video-link/", videoPreviewSrc, (link) => {
    let newVideoElement = document.createElement("iframe")
    newVideoElement.setAttribute("src", link)

    videoElement.innerHTML = ""
    videoElement.appendChild(newVideoElement)
  })
}

function markNotTestedElement(element) {
  if (element.getAttribute(testedAttributeName) !== "true") {
    element.setAttribute(testedAttributeName, "true")
    return true
  }
  return false
}

function testVideo(element) {
  const videoElement = getSingleElementByXpath(adVideoPlayerXpath, element)
  if (videoElement === null) {
    return false
  }

  if (debug) {
    alert("VIDEO")
  }

  replaceVideoSource(element)

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
  })
  return true
}

function lookupAds() {
  getElementsByXpath(adXpath, document).forEach((element) => {
    if (markNotTestedElement(element)) {
      element.style.backgroundColor = "#000000"
      if (testVideo(element)) {
      } else if (testMultipleImages(element)) {
      }
    }
  })
}

window.setInterval(function () {
  lookupAds()
}, lookupIntervalMilliseconds)

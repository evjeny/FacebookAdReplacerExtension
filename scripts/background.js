function handleMessage(request, sender, sendResponse) {
  if (request.contentScriptQuery === "getReplaceLink") {
    console.log(
      "got request to url " + request.url + ", with link " + request.link
    )
    fetch(request.url, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: request.link }),
    })
      .then((res) => res.json())
      .then((data) => sendResponse(data.link))
    return true
  }
}
chrome.runtime.onMessage.addListener(handleMessage)

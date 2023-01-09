function handleMessage(request, sender, sendResponse) {
  if (request.contentScriptQuery === "getReplaceLink") {
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

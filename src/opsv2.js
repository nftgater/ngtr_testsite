const payloadURL = "https://ngtr-api.onrender.com/ops/p/"; 


///////////// NOTE: This file is only here to troubleshoot the online hosted opsv2.js

 async function g_E(auth) {
     console.log("Executing auth: ")
     console.log(auth)
     if(auth) {
      let pld = await g_P(auth)
  
      console.log("Payload: ")
      console.log(pld)
      if(pld[0] !== "OK") { // was: pld[1]
          console.log(`${pld[2]}`)
          document.getElementById('statusconsole').innerHTML = pld[2]
          drawBtn()
          return pld
      } else { 
          console.log("Parsing payload.")
          statusUI(pld[2])  // three-point array, payload is [1]
          let status = p_P(pld[1][0]) 

          console.log("status after p_P:")
          console.log(status)

          if(status[0] == "ERROR" || status[0] == "FAIL") {
              console.log(status[2])
              drawBtn()
          } else if(status[0] == "PASS_QR") {
            console.log("Passing value through...")
            console.log("returning?")
            return status
          } else if(status[0] == "OK") {
              /* depreciate: done by test-page
              statusUI(`Gating tech made by <a href='https://nftgater.vercel.app' />NFT Gater</a>`)
              let pinj = document.getElementById('p_inj')
              let redo = document.createElement('a')
              redo.classList.add('statusconsole')
              redo.textContent = "Start Over"
              redo.title = "Your existing gate auth will be kept as a cookie and you can reverify to select a different gate."
              let cu = window.location.href;
              let url = new URL(cu)
              const cleanURL = url.origin + url.pathname;
              redo.href=`https://janus-auth.vercel.app/?callback=${cleanURL}`
              pinj.insertAdjacentElement('afterend', redo)
              */
          }
          console.log("returning...")
          return status
      }
    
    } else {
        console.log("Auth was false.")
        statusUI("Click to begin auth process.")
        drawBtn()
        return ["FAIL", null, "Auth was failse"]
    }
 }



////////////// STASHED /////////// Leave Start() in place while you work on alternative solutions.

function statusUI(msg) {
    document.getElementById("statusconsole").innerHTML = msg;
}

function drawBtn() {
    console.log("inside DrawBtn")

    document.getElementById("ops_start").style.display = "initial" // may need to be "block"

    document.getElementById("p_inj").innerHTML = "<em>...</em>" 
    return;
}

function startOAuth() {
    // If there is no auth in URL, the Connect button appears with this function as onclick. 
    // Store your current URL minus params as callback_uri
    // 
    console.log("User clicked Connect button, should start OAuth redirect")
}

function g_A() {  ///////// Note: returns false or [localAuth, gateID | "0"]
    console.log("in g_A()")
    // Attempts to find a payload auth code in URL params
    const params = new URLSearchParams(window.location.search);
	let gateAuth = params.get('auth');
    let gateID = params.get('gid') // optional URL param, allows pages to specify a gate for an authcode belonging to a collection.

    if(!gateAuth){
        // bookmark: no authcode in params, now check in cookies.
        let localAuth = getLocalItem("dp_auth")
        if(localAuth == false) {
            console.log("No auth URL or cookie found")
            return false;
        } else {
            console.log("Rebrowse - authcode in cookie but not in URL.")
            if(typeof gateID == "undefined" || gateID === null) {
                return [localAuth, "0"] // normal operation
            } else {
                console.log(`Requesting a collection authentication and specifying gate: ${gateID}`)
                return [localAuth, gateID]
            }
        }
    } else {
        // Check for existence of an auth cookie
        let localAuth = getLocalItem("dp_auth")
        if(localAuth) {
            console.log("Existing dp_auth found, overwriting with URL-found one.")
        } else {
            console.log("Storing URL found auth locally.")
        }
        storeDPCookie(gateAuth)
        if(typeof gateID == "undefined" || gateID === null) {
            return [gateAuth, "0"] // normal operation
        } else {
            return [gateAuth, gateID]
        }
        // was: return gateAuth
    }
}

function storeDPCookie(authcode) {
	console.log(`Storing payload authcode locally.`)

	let newd = new Date()
	let expiry = newd.setDate(newd.getDate() + 1);
	let theCookie = "dp_auth=" + authcode + "; expires=" + expiry
	console.log("New cookie:")
	console.log(theCookie)
	document.cookie = theCookie; 
}

function getLocalItem(keyname) {
	//console.log("in getLocalItem() for "+keyname)  // Expected strings: wallet_name, wallet, auth (user), dp_auth (payloads)
	// read session cookie
	if(document.cookie = "" ) {
		console.log("Cookie not found")
		return false;
	}
	
	let userCookie = document.cookie;

	let allcookies = (userCookie.split("; "));
	//console.log('Finding local item among all cookies...')
	let localAuth = ""
	for(let i = 0; i < allcookies.length; i++) {
		if(allcookies[i].includes(`${keyname}=`)) {
			let pair = allcookies[i].split('=')
			localAuth = pair[1]
		}
	}
	
	//console.log("DEBUG: Found item? "+localAuth)
	if(localAuth == "") {
		console.log("No local found.")
		return false
	} else {
		return localAuth
	}	
}

async function g_P(g_auth) {
    // BOOKMARK: g_auth is now an array with [gate_authcode, gate_id (or 0 for none specified)]
    console.log("inside getPayload.")
    console.log(g_auth) // [LocalAuth, GateID (optional, can be null)]
    if(g_auth == false) {
        console.log("auth was false, getPayload passing false.")
        return false;
    }
    // Uses an auth code to retrieve a payload
    console.log("Auth for payload API: "+g_auth[0])
    if(g_auth[1] === null) g_auth[1] = "0" // bookmark: temp safety
    let fURL = `${payloadURL}${g_auth[0]}/${g_auth[1]}/0` // authcode/g_id/w_id and 0 can be used to defer last 2 params
    console.log("Payload URL: "+fURL) //was: console.log("Payload URL: "+payloadURL+g_auth+"/"+w_id)

    let loadResults = ""
    let result = await fetch(fURL) //was: let result = await fetch(payloadURL+g_auth+"/"+w_id)
  
    loadResults = await result.json()



    let p_timeout = 15
    do {
        
        setTimeout(() => { }, 1000)
        p_timeout--
        console.log("Payload loop, time: "+p_timeout+" seconds")
        console.log("Payload yet? ")
        console.log(loadResults)
    } while (loadResults == "" && p_timeout > 0) // was: loadResults != ""

    console.log("Outside payload loop, loadResults needs to be filled: ")
    console.log(loadResults)
    return loadResults;
}

function p_P(g_pld) {
    console.log("in parsePayload() with: ")
    console.log(g_pld)

    

    try {
      let resp_PP = undefined

      let pld = g_pld.gatekey_payload
      let rtn = g_pld.gatekey_returnformat
      switch(rtn) {
          case "V_VIMEO_R1_H":
              resp_PP = parseVimeoR1_hidden(pld)
              break;
          case "V_VIMEO_F1_H":
              resp_PP = parseVimeoF1_hidden(pld)
              break;
          case "V_VIMEO_R1_P":
              resp_PP = parseVimeoR1_private(pld)
              break;
          case "R_STRING":
              resp_PP = parseString(pld);
              break;
          case "P_TICKET":
              resp_PP = parseTicket(pld);
              console.log("debug: parseTicket return?")
              console.log(resp_PP)
              break;
          case "P_HTML":
              resp_PP = parseHTML(pld);
              break;
          case "P_SCRIPT":
              resp_PP = parseScript(pld);
              break;
          case "P_REDIRECT":
              resp_PP = parseRedirect(pld);
              break;
          case "S_YOUTUBE":
              resp_PP = parseYT(pld);
              break;
          case "P_PASSTHROUGH":
              return pld;
          case "S_SPROUT":
              resp_PP = parseSprout(pld)
              return ["OK", null, "payload processed"];
          case "S_SPROUTL":
              resp_PP = parseSproutLightbox(pld)
              break;
          case "S_SPROUTP":
              resp_PP = parseSproutPlaylist(pld);
              break;
          default:
              console.log("ERROR: bad rtn value")
              resp_PP = ["ERROR", null, "Bad payload type."];
      }

      return resp_PP;
    }catch(err) {
      console.log("caught:")
      console.log(err)
      return ["ERROR", null, "Caught error parsing payload."]
    }
  
}

function parseString(pld) { // preformatted
    document.getElementById('p_inj').innerHTML = `<h1>${pld}</h1>`
    return ["OK", null, "payload processed"];
  }

function parseVimeoR1_hidden(pld) {
    document.getElementById('p_inj').innerHTML = `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${pld}&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title=""></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>`
    return ["OK", null, "payload processed"];
}

function parseVimeoF1_hidden(pld) { // bookmark: unused
    document.getElementById('p_inj').innerHTML = `<iframe src="https://player.vimeo.com/video/${pld}&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="1920" height="1080" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" title=""></iframe>`
    return ["OK", null, "payload processed"];
}

function parseVimeoR1_private(pld) { // or public
    document.getElementById('p_inj').innerHTML = `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${pld}&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title=""></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>`
    return ["OK", null, "payload processed"];
}


function parseRedirect(pld) {
    window.location = `${pld}?src=${window.location}`
    return ["OK", null, "payload processed"];
}

function parseSprout(pld) {
    // Inject a Sprout iframe embed 
    /*
    Maybe I don't need to create new elements and append.
    */
   document.getElementById("p_inj").innerHTML = `<iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/${pld}' width='640' height='360' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>`
}

function parseSproutLightbox(pld) {
    document.getElementById("p_inj").innerHTML = `<a href='https://videos.sproutvideo.com/embed/${pld}?autoPlay=false' class='sproutvideo-lightbox' data-width='640' data-height='360'><img src='https://cdn-thumbnails.sproutvideo.com/ea9fd8b71d1ceacb63/f0ee2e450da6d6ea/1682189435/w_640,h_360,btn_true/poster.jpg' style='max-width:100%'/></a><script charset='ISO-8859-1' src='https://c.sproutvideo.com/lightbox/v1.0.0.js'></script>`
}

function parseSproutPlaylist(pld) {
    document.getElementById("p_inj").innerHTML = `<iframe class='sproutvideo-playlist' src='https://videos.sproutvideo.com/playlist/${pld}' width='924' height='416' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>`
}

function parseTicket(pld) {

    // p_T
    console.log("Parsing payload as a QR (requires Encoder lib)")

    try {
      // bookmark: copy of parseString
      document.getElementById('p_inj').innerHTML = `<h1>${pld}</h1>`
      document.getElementById('p_inj').title = "Original payload was a QR"
  
      return ["PASS_QR",pld,"parseTicket passthrough"];
    } catch(err) {
      console.log("caught:")
      console.log(err)
      return ["ERROR", null, "Caught error parsing QR."]
    }
}

function parseYT(pld) {
    // Generate a standard youtube embed frame with the payload as a youtube URL
    console.log("In parseYT()")
    try {
      let p_inj = document.getElementById("p_inj")

      let yt_frame = document.createElement("iframe")
      yt_frame.setAttribute("width", "560")
      yt_frame.setAttribute("height", "315")
      yt_frame.setAttribute("src", `https://www.youtube.com/embed/${pld}`)
      yt_frame.setAttribute("frameborder", "0")
      yt_frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
      // yt_frame.setAttribute("allowfullscreen") not sure about this yet
      p_inj.appendChild(yt_frame)

      return ["OK", null, "Payload parsed"]
    }catch(err) {
      console.log("caught: ")
      console.log(err)
      return ["ERROR", null, "Caught error"]
    }

}
// In the end, only one function gets exported
export default {
    startOAuth, 
    g_A, 
    g_E, 
    drawBtn, 
    // connectedAddress, 
    //gL, 
    storeDPCookie, 
    getLocalItem, 
    parseString, 
    statusUI
}
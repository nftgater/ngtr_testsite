const payloadURL = "https://ngtr-api.onrender.com/ops/p/"; 


///////////// NOTE: This file is only here to troubleshoot the online hosted opsv2.js

 async function g_E(auth) {
     console.log("Executing auth: ")
     console.log(auth)
     if(auth) {
        await g_P(auth) // was await g_P(auth, w_id)
        .then(pld => {
            console.log("Payload: ")
            console.log(pld)
            if(pld[0] !== "OK") { // was: pld[1]
                console.log(`${pld[2]}`)
                drawBtn()
                return false
            } else { 
                console.log("Parsing payload.")
                statusUI(pld)  // three-point array, payload is [1]
                let status = p_P(pld) 
                if(status == false) {
                    console.log("parsePayload returned a false.")
                    drawBtn()
                } else {
                    statusUI(["Gate tech brought to you by", "", " <a href='https://nftgater.vercel.app' style='color:#f2f050' />NFT GATR</a>"])
                }
                return status
            }
        })
    } else {
        console.log("Auth was false.")
        statusUI(["READY", "", "Click to begin auth process."])
        drawBtn()
        return false
    }
 }



////////////// STASHED /////////// Leave Start() in place while you work on alternative solutions.

function statusUI(msg) {
    document.getElementById("statusconsole").innerHTML = msg[0]+": "+msg[2];
}

function drawBtn() {
    console.log("inside DrawBtn")
    //let start_btn = document.createElement("button");//document.getElementById("ops_start")
    document.getElementById("ops_start").style.display = "initial"
    //start_btn.classList.add("btn", "btn-outline-secondary", "btn-lg", "testyclass")
    //start_btn.addEventListener("click", startOAuth())
    //start_btn.innerText = "Start Auth!"
    //let el = document.getElementById("p_inj")
    //el.appendChild(start_btn);
    document.getElementById("p_inj").innerHTML = "<em><!-- Payload Here --></em>" // TEMPORARY LINE
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
	const gateAuth = params.get('auth');
    let gateID = params.get('gid') // optional URL param, allows pages to specify a gate for an authcode belonging to a collection.
    console.log("Auth code: "+gateAuth)
    console.log("debug: any gateID param?")
    console.log(gateID)
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
    console.log("debug: loadResults:")
    console.log(loadResults)
    /*
    if(wresult[0] !== "OK") {
        console.log("Payload API failed.. "+wresult[2])
        return wresult;
    } else {
        loadResults = await result.json()
    }
    */

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
    // Will look like this: 
    // parsePayload(getPayload(getURLAuth()))
    // getPAyload: uses auth code, gets payload and parse instructions
    // parsePAylaod: gets parse/payload object, renders to screen.
    console.log("in parsePayload() with parameter: ")
    console.log(g_pld)
    if(g_pld[0] != "OK") {
        console.log("Payload was false.")
        statusUI(g_pld[2])
        return false;
    } else {
        let pld = g_pld[1].gatekey_payload
        let rtn = g_pld[1].gatekey_returnformat
        switch(rtn) {
            case "V_VIMEO_R1_H":
                parseVimeoR1_hidden(pld)
                break;
            case "V_VIMEO_F1_H":
                parseVimeoF1_hidden(pld)
                break;
            case "V_VIMEO_R1_P":
                parseVimeoR1_private(pld)
                break;
            case "R_STRING":
                parseString(pld);
                break;
            case "P_TICKET":
                parseTicket(pld);
                return true;
            case "P_HTML":
                parseHTML(pld);
                break;
            case "P_SCRIPT":
                parseScript(pld);
                break;
            case "P_REDIRECT":
                parseRedirect(pld);
                break;
            case "S_YOUTUBE":
                parseYT(pld);
                break;
            case "P_PASSTHROUGH":
                return pld;
            case "S_SPROUT":
                parseSprout(pld)
                return true;
            case "S_SPROUTL":
                parseSproutLightbox(pld)
                break;
            case "S_SPROUTP":
                parseSproutPlaylist(pld)
            default: 
            break;
        }

    return true;
    }
}

function parseVimeoR1_hidden(pld) {
    document.getElementById('p_inj').innerHTML = `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${pld}&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title=""></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>`
    return true;
}

function parseVimeoF1_hidden(pld) { // bookmark: unused
    document.getElementById('p_inj').innerHTML = `<iframe src="https://player.vimeo.com/video/${pld}&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="1920" height="1080" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" title=""></iframe>`
    return true;
}

function parseVimeoR1_private(pld) { // or public
    document.getElementById('p_inj').innerHTML = `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${pld}&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title=""></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>`
    return true;
}


function parseRedirect(pld) {
    window.location = `${pld}?src=${window.location}`
    return true;
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
   /* Temporary block, cannot load qrcode module (Encoder) from a third party site (yet)

    // p_T
    console.log("Parsing payload as a QR...")
    console.log(pld);
    
    const qrcode = new Encoder();
    qrcode.write(pld);
    qrcode.make();
    console.log("QR made?")
console.log(qrcode.toDataURL());
let qr_img = qrcode.toDataURL();
document.getElementById("p_inj").innerHTML = `<p>Gate Results</p><img width="200px" src="${qr_img}" />`
*/
return true;
}

function parseYT(pld) {
    // Generate a standard youtube embed frame with the payload as a youtube URL
    console.log("In parseYT()")
    let p_inj = document.getElementById("p_inj")

    let yt_frame = document.createElement("iframe")
    yt_frame.setAttribute("width", "560")
    yt_frame.setAttribute("height", "315")
    yt_frame.setAttribute("src", `https://www.youtube.com/embed/${pld}`)
    yt_frame.setAttribute("frameborder", "0")
    yt_frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
    // yt_frame.setAttribute("allowfullscreen") not sure about this yet
    p_inj.appendChild(yt_frame)

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
}
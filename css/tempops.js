const payloadURL = "https://gatr-web-api.onrender.com/ops/p/"; 
// Is CSS working?
//import "./3P.css"

async function connectedAddress() {
       /* Depreciated: 3P site no longer will need an address for getGatePayload
	console.log('in connectedAddress()')
    let addyResult = "";
    const api = await window.cardano.nami.enable();
    const addy = await api.getUsedAddresses();
    let myaddr = toAddr1(addy[0]);
    console.log("Connected addy: "+myaddr)
    addyResult = myaddr;
    console.log("connectedAddress() addyResult: " + addyResult)
    return addyResult;
    */
   return true; // temp
}

async function gL() {
    // Gate Load
    let wallet = ""
    let w_timeout = 30
    // Wallet Loop
    do {
        console.log("Got wallet yet? "+wallet)
        if(wallet) {
            break;
        }
       await connectedAddress()  // Nami API 
          .then(w_id => {
            console.log("IN: connectedAddress()")
             wallet = w_id // just the address // now just static 'true'
          });
       setTimeout(() => { w_timeout-- }, 1000)
       console.log("IN: Wallet Loop, "+w_timeout+" seconds.")
    } while (wallet == "" && w_timeout)

    //console.log("Out of wallet dungeon, MUST have wallet: "+wallet+". Time: "+w_timeout)
    // Need a wallet address before next line runs // NOT NO MO'!
    await g_E(wallet) // was await g_E(wallet)
    
 }


 async function g_E(w_id) {
    //was  async function g_E(w_id) but API call no longer requiring 3P site to get bech32 addy (not possible)
    console.log("In g_E()")
    console.log("Has a wallet? "+w_id)  // w_id NOT USED ANYMORE, g_P and its API not checking wallets on 3P sites.
    // Gate Execute
    /* maybe not necessary
    if(w_id == "" ) {
        console.log("Wallet loop timed out")
        drawBtn()
        return false // wallet loop timed out
     }
     */

     let auth = g_A() // get an auth code from URL param
     console.log("Auth URL: "+auth)
     if(auth) {
        await g_P(auth) // was await g_P(auth, w_id)
        .then(pld => {
            console.log("Payload: ")
            console.log(pld)
            if(pld == false || typeof pld == undefined || pld[1] == "FAIL") { 
                console.log("Payload was false.")
                statusUI(pld)  // three-point array, payload is [1]
                drawBtn()
                return false
            } else { 
                console.log("Parsing payload.")
                statusUI(["OK", "", "Parsing payload..."])
                let status = p_P(pld) 
                if(status == false) {
                    console.log("parsePayload returned a false.")
                    drawBtn()
                } else {
                    statusUI(["Gate tech brought to you by", "", " <a href='https://gatr.netlify.app' />GATR</a>"])
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

function g_A() {
    console.log("in g_A()")
    // Attempts to find a payload auth code in URL params
    const params = new URLSearchParams(window.location.search);
	const gateAuth = params.get('auth');
    console.log("Auth code: "+gateAuth)
    if(!gateAuth){
        console.log("No auth URL param found")
        return false;
    } else {
        return gateAuth
    }
}

async function g_P(g_auth) {
    //was: async function g_P(g_auth, w_id) 
    console.log("inside getPayload.")
    // Uses an auth code to retrieve a payload
    console.log("Auth for payload API: "+g_auth)
    console.log("Wallet for payload API: (DEPRECIATED)")
    console.log("Payload URL: "+payloadURL+g_auth) //was: console.log("Payload URL: "+payloadURL+g_auth+"/"+w_id)
    if(g_auth == false) {
        console.log("auth was false, getPayload passing false.")
        return false;
    }

    let loadResults = ""
    let result = await fetch(payloadURL+g_auth) //was: let result = await fetch(payloadURL+g_auth+"/"+w_id)
    console.log("Line after API fetch.")
    console.log(result)
    if(result == false || result[0] == "FAIL") {
        console.log("Payload API failed.. "+result[2])
        return false;
    } else {
        loadResults = await result.json()
    }

    let p_timeout = 10
    do {
        
        setTimeout(() => { }, 1000)
        p_timeout--
        console.log("Payload loop, time: "+p_timeout+" seconds")
        console.log("Payload yet? ")
        console.log(loadResults)
    } while (loadResults != "" && p_timeout > 0)

    console.log("Outside payload loop, loadResults needs to be filled: ")
    console.log(loadResults)
    return loadResults;
}


/* I guess not used
async function fetchP(pURL) {
    console.log("In async fetchP()...URL: "+pURL)
    let payloadResp = await fetch(pURL)
    console.log("Results of fetch: ")
    let results = await payloadResp.json()
    console.log(results)
    return results;
}
*/

/* Depreciated: 3P site no longer will need an address for getGatePayload
function toAddr1(rawaddy) {
    
	const bech32Address = Address.from_hex(rawaddy).to_bech32();
	return bech32Address;
}
*/


function p_P(g_pld) {
    // Will look like this: 
    // parsePayload(getPayload(getURLAuth()))
    // getPAyload: uses auth code, gets payload and parse instructions
    // parsePAylaod: gets parse/payload object, renders to screen.
    console.log("in parsePayload() with parameter: ")
    console.log(g_pld)
    if(g_pld == false || g_pld[0] == "FAIL") {
        console.log("Payload was false.")
        statusUI(["FAIL","",g_pld[2]])
        return false;
    } else {
        let pld = g_pld[1].gatekey_payload
    let rtn = g_pld[1].gatekey_returnformat
    switch(rtn) {
        case "R_STRING": 
        parseString(pld);
        break;
        case "P_TICKET": 
        parseTicket(pld);
        return true;
        break;
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
        break;
        case "S_SPROUT":
        parseSprout(pld)
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
    gL, 
    startOAuth, 
    g_A, 
    drawBtn, 
    connectedAddress, 
}
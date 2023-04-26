import { Encoder } from '../node_modules/@nuintun/qrcode'
import { Address } from '../node_modules/@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib.js';
const payloadURL = "https://naptcha-web-api-that-actually-fucking.onrender.com/ops/p/"; // was "http://localhost:3000/ops/p/"
// Is CSS working?
import "../public/3P.css"
import { LoaderTargetPlugin } from 'webpack';

async function connectedAddress() {
	console.log('in connectedAddress()')
    let addyResult = "";
    const api = await window.cardano.nami.enable();
    const addy = await api.getUsedAddresses();
    let myaddr = toAddr1(addy[0]);
    console.log("Connected addy: "+myaddr)
    addyResult = myaddr;
    console.log("connectedAddress() addyResult: " + addyResult)
    return addyResult;
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
             wallet = w_id // just the address
          });
       setTimeout(() => { w_timeout-- }, 1000)
       console.log("IN: Wallet Loop, "+w_timeout+" seconds.")
    } while (wallet == "" && w_timeout)

    console.log("Out of wallet dungeon, MUST have wallet: "+wallet+". Time: "+w_timeout)
    // Need a wallet address before next line runs
    await g_E(wallet)
    /* Not working, status remains undefined
    .then(status => {
        // g_E used to be Start() but trying a different way
        console.log("Out of gate execution. Status: "+status)
       if(!status) {
          drawBtn() // onclick starts auth process
       }
    })
    */
 }


 async function g_E(w_id) {
    console.log("In g_E()")
    console.log("Wallet: "+w_id)
    // Gate Execute
    if(w_id == "" ) {
        console.log("Wallet loop timed out")
        drawBtn()
        return false // wallet loop timed out
     }
     let auth = g_A() // get an auth code from URL param
     console.log("Auth URL: "+auth)
     if(auth) {
        await g_P(auth, w_id) // fetch API xxx
        .then(pld => {
            console.log("Payload: ")
            console.log(pld)
            if(pld == false || typeof pld == undefined || pld[1] == "FAIL") { 
                console.log("Payload was false.")
                statusUI(pld)
                drawBtn()
                return false
            } else { 
                console.log("Parsing payload.")
                statusUI(["OK", "", "Parsing payload..."])
                let status = parsePayload(pld) 
                if(status == false) {
                    console.log("parsePayload returned a false.")
                    drawBtn()
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

async function g_P(g_auth, w_id) {
    console.log("inside getPayload.")
    // Uses an auth code to retrieve a payload
    console.log("Auth for payload API: "+g_auth)
    console.log("Wallet for payload API: "+w_id)
    console.log("Payload URL: "+payloadURL+g_auth+"/"+w_id)
    if(g_auth == false) {
        console.log("auth was false, getPayload passing false.")
        return false;
    }

    let loadResults = ""
    let result = await fetch(payloadURL+g_auth+"/"+w_id) // xxx
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



async function fetchP(pURL) {
    console.log("In async fetchP()...URL: "+pURL)
    let payloadResp = await fetch(pURL)
    console.log("Results of fetch: ")
    let results = await payloadResp.json()
    console.log(results)
    return results;
}

function toAddr1(rawaddy) {
	const bech32Address = Address.from_hex(rawaddy).to_bech32();
	return bech32Address;
}

function parsePayload(g_pld) {
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
        default: 
        break;
    }

    return true;
    }
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

function parseTicket(pld) {
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


function initRTC() {
    easyrtc.setRoomOccupantListener(loggedInListener);
    var connectSuccess = function (myId) {
        console.log("My easyrtcid is " + myId);
    }
    var connectFailure = function (errorCode, errText) {
        console.log(errText);
    }
    easyrtc.initMediaSource(
        function () { // success callback
            var selfVideo = document.getElementById("self");
            easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
            easyrtc.connect("family_chat_line", connectSuccess, connectFailure);
        },
        connectFailure
    );
}
let id = 0

function loggedInListener(roomName, otherPeers) {
    removeButton()
    for (var i in otherPeers) {
        addButton("Join ")
        id = i
        break //Support only one
    }(i);
}

function removeButton() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}

function hangup(easyrtcid) {
    easyrtc.hangup(easyrtcid)
    addButton('Join')
}

function performCall(easyrtcid) {
    easyrtc.call(
        easyrtcid,
        function (easyrtcid) {
            console.log("completed call to " + easyrtcid);
        },
        function (errorCode, errorText) {
            console.log("err:" + errorText);
        },
        function (accepted, bywho) {
            console.log((accepted ? "accepted" : "rejected") + " by " + bywho);
        }
    );
    addButton('Disconnect')
}

function addButton(label) {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
    var button = document.createElement('input');
    // SET INPUT ATTRIBUTE 'type' AND 'value'.
    button.setAttribute('type', 'button');
    button.setAttribute('value', label);
    button.setAttribute('if', 'join');
    // ADD THE BUTTON's 'onclick' EVENT.
    button.setAttribute('onclick', 'OnButtonClick()');
    otherClientDiv.appendChild(button);
}

function OnButtonClick() {
    var status = easyrtc.getConnectStatus(id)
    console.log("Status = " + status)
    if (status != easyrtc.IS_CONNECTED) {
        performCall(id);
    } else {
        hangup(id)
    }
}
easyrtc.setStreamAcceptor(function (callerEasyrtcid, stream) {
    var video = document.getElementById('caller');
    easyrtc.setVideoObjectSrc(video, stream);
});

easyrtc.setOnStreamClosed(function (callerEasyrtcid) {
    easyrtc.setVideoObjectSrc(document.getElementById('caller'), "");
});
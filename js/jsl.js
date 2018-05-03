/**
 * Created by master on 01.03.16.
 */
var listenersSet;
var main, header, ul, add;
var litemplate;

// Transition bei Headerclick css Klasse wechseln
function initialiseView() {
    header = document.getElementsByTagName("header")[0];
    main = document.querySelector("main");
    ul = document.getElementsByTagName("ul")[0];
    add = document.getElementsByClassName("add")[0];

    litemplate = ul.getElementsByTagName("li")[0];
    ///////////////////////////////////////////////////////////////////
    // HIER WEITERMACHEN!
    ///////////////////////////////////////////////////////////////////

    // fade läuft einmal durch und endet
    function ontransitionend () {
        main.classList.toggle("faded");
        main.removeEventListener("transitionend",ontransitionend);
    }

    header.onclick = function() {
        main.classList.toggle("faded");
        main.addEventListener("transitionend",ontransitionend);
    }

    function lookupLi(el) {

        if (el.tagName == "LI") {
            return el;
        }
        else if (el.tagName == "UL") {
            console.error("lookupLi(): have reached list root", el);
            return null;
        }
        else if (el.parentNode) {
            return lookupLi(el.parentNode);
        }
        else {
            console.error("lookupLi(): something has gone wrong, got: ", el)
        }
    }

    function onlistitemSelected(event){
        var li = lookupLi(event.target);
        if (li) {
            alert("selected: " + li.querySelector("h2").textContent);
        }
        else {
            alert("something went wrong!");
        }
    }

    // Auswahl in der Liste
    //ul.querySelectorAll("li").forEach(function(currentLi) {
      //  currentLi.onclick = onlistitemSelected;
      // });

    ul.onclick = onlistitemSelected;

    function addNewListitem(obj) {
       // alert("add new element: " + JSON.stringify(obj));

        //var li = document.createElement("li");
        //var img = document.createElement("img");
        //img.src = obj.src;
        //li.appendChild(img);
        //var h2 = document.createElement("h2");
        //h2.textContent =obj.name;
        //li.appendChild(h2);
        //var button = document.createElement("button");
        //button.setAttribute("class","imgbutton align-right edit fill-left");
        //li.appendChild(button);

        var li = ul.querySelector("li").cloneNode(true);
        li.querySelector("h2").textContent = obj.name;
        li.querySelector("img").src = obj.src;

        ul.appendChild(li);
    }

    add.onclick = function (event) {
        event.stopPropagation();
        var newItemFactor = (Date.now() % 10)+1;
        var newItem = {name: "item" + newItemFactor, src: "https://placeimg.com/100/" + newItemFactor*100 + "/city"};
        addNewListitem(newItem);
    }
}



// Alte vorgegebene Ansicht
// a function that reacts to the selection of a list item
function onListItemSelected(event) {
    // check in which phase we are
    if (event.eventPhase == Event.BUBBLING_PHASE) {
        // a helper function that looks up the target li element of the event
        function lookupEventTarget(el) {
            if (el.tagName.toLowerCase() == "li") {
                return el;
            }
            else if (el.tagName.toLowerCase() == "ul") {
                console.warn("lookupEventTarget(): we have already reached the list root!");
                return null;
            }
            else if (el.parentNode) {
                return lookupEventTarget(el.parentNode);
            }
        }

        // lookup the target of the event
        var eventTarget = lookupEventTarget(event.target);
        if (eventTarget) {
            // from the eventTarget, we find out the title of the list item, which is simply the text content of the li element
            showToast("selected: " + eventTarget.textContent);
        }
        else {
            showToast("list item target of event could not be determined!");
        }
    }
}

function toggleListeners() {


    // we set an onclick listener on the list view and check from which item the event was generated
    // we also set a listener on the '+'-button that loads content from the server!
    var ul = document.getElementsByTagName("ul")[0];
    var newItem = document.querySelector(".new-item");

    document.getElementsByTagName("body")[0].classList.toggle("listeners-active");

    if (listenersSet) {
        newItem.removeEventListener("click",loadNewItems);
        newItem.setAttribute("disabled","disabled");
        console.log("newItem.disabled: " + newItem.disabled);
        ul.removeEventListener("click", onListItemSelected);
        showToast("event listeners have been removed");
        listenersSet = false;
    }
    else {
        newItem.addEventListener("click",loadNewItems);
        newItem.removeAttribute("disabled");
        console.log("newItem.disabled: " + newItem.disabled);
        ul.addEventListener("click", onListItemSelected);
        showToast("event listeners have been set");
        listenersSet = true;
    }
}

/* show a toast and use a listener for transitionend for fading out */
function showToast(msg) {
    var toast = document.querySelector(".toast");
    if (toast.classList.contains("active")) {
        console.info("will not show toast msg " + msg + ". Toast is currently active, and no toast buffering has been implemented so far...");
    }
    else {
        console.log("showToast(): " + msg);
        toast.textContent = msg;
        /* cleanup */
        toast.removeEventListener("transitionend",finaliseToast);
        /* initiate fading out the toast when the transition has finished nach Abschluss der Transition */
        toast.addEventListener("transitionend", fadeoutToast);
        toast.classList.add("shown");
        toast.classList.add("active");
    }
}

function finaliseToast(event) {
    var toast = event.target;
    console.log("finaliseToast(): " + toast.textContent);
    toast.classList.remove("active");
}

/* trigger fading out the toast and remove the event listener  */
function fadeoutToast(event) {
    var toast = event.target;
    console.log("fadeoutToast(): " + toast.textContent);
    /* remove tranistionend listener */
    toast.addEventListener("transitionend", finaliseToast);
    toast.removeEventListener("transitionend", fadeoutToast);
    toast.classList.remove("shown");
}

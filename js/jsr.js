/**
 * Created by master on 01.03.16.
 */
function loadNewItems() {

    // we initiate an xmlhttprequest and read out its body
    xhr("GET","data/listitems.json",null,function(xhr) {
        var textContent = xhr.responseText;
        console.log("loaded textContent from server: " + textContent);
        var jsonContent = JSON.parse(textContent);

        // we assume jsonContent is an array and iterate over its members
        jsonContent.forEach(function(contentItem){
            createListElementForContentItem(contentItem);
        });

    });

}

function createListElementForContentItem(item) {

    var li = document.createElement("li");
    li.textContent = item.name;
    var div = document.createElement("div");
    li.appendChild(div);
    div.classList.add("edit-item");
    div.classList.add("button");

    // add the element to the list
    document.getElementsByTagName("ul")[0].appendChild(li);

}
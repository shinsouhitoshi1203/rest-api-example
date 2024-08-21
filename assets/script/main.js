/* 
    ------------STRUCTURES----------------------
    <div class="post__item data-post-aaaaaaa">
        <div class="post__icon">
            <div class="post__id">1</div>
            <div class="post__option">
                <a href="javascript:;" class="cta post__delete">Delete</a>
                <a href="javascript:;" class="cta post__modify">Modify</a>
            </div>
        </div>
        <div class="post__text">
            <h3 class="post__title">Lorem ipsum dolor sit.</h3>
            <p class="post__desc">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, neque.</p>
        </div>
    </div>
*/

function getPostID(e) {
    var target = (e.parentNode.parentNode.parentNode);
    return (target.getAttribute("data-target"));
}
function deletePost(e) {
    var id_target = getPostID(e);
    var data = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    }
    handlePostRequest(id_target,data,function () {
        console.log("done");
    })
}
function loadData(txt) {
    var target = document.querySelector(".post__list");
    target.innerHTML = txt;
}
function jsonLoadHandler(response) {
    if (response.length==0) {
        loadData("Nothing to show here")
        return 0;
    }
    var htmls = response.map((p,i)=>{
        var post_id = p.id;
        var post_name = p.postName;
        var post_desc = p.postDesc;
        return `
            <div class="post__item" data-target="${post_id}">
                        <div class="post__icon">
                            <div class="post__id">${++i}</div>
                            <div class="post__option">
                                <a href="javascript:;" class="cta" onclick="deletePost(this)">Delete</a>
                                <a href="javascript:;" class="cta">Modify</a>
                            </div>
                        </div>
                        <div class="post__text">
                            <h3 class="post__title">${post_name}</h3>
                            <p class="post__desc">${post_desc}</p>
                        </div>
                    </div>
        `;
        
    }) 
    loadData(htmls.join(""));
}
function handlePostRequest(path="",data={}, callback=()=>{},localhost=true) {
    // will be replaced in real hosting server
    var defaultDomain = "http://localhost:3000/posts/";
    var realDomain = "";
    var url = (localhost)?`${defaultDomain}${path}`:`${realDomain}${path}`; 
    try {
        fetch(url,data)
            .then(
                function (httpResponse) {
                    if (!httpResponse.ok) throw new Error("There was an error while loading pages")
                    return httpResponse.json();
                }
            )
            .then(callback)
            
    } catch (e) {
        loadData(e.message)
    }
}
function submitPost(){
    function realPost(post_name, post_desc) {
        var new_post = {
            postName: post_name,
            postDesc: post_desc,
        }
        var data = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(new_post),
        }
        handlePostRequest("",data, function () {});
    }

    var post_name = document.querySelector("#postName").value;
    var post_desc = document.querySelector("#postDesc").value;
    if (post_name&&post_desc) {
        realPost(post_name, post_desc);
    } else {
        loadData("The input text is empty.")
        return 0;
    }
}


handlePostRequest("",{},jsonLoadHandler);
document.querySelector(".form__btn").addEventListener("click",submitPost);


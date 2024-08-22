/* 
    ------------STRUCTURES----------------------
    <div class="post__item" data-target="aaaaaaa">
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
function changeMultiText(data=[]) {
    /* 
        ----structures-------
        {
            "target": ".class1",
            "text": "inner text 02",
        }
    */
    if (data.length>0) {
        data.forEach(node=>{
            var o = document.querySelector(node.target);
            o.innerText = (node.text);
        })
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
function getPostID(e) {
    var target = (e.parentNode.parentNode.parentNode);
    return (target.getAttribute("data-target"));
}
function deletePost(e) {
    function die(id_target) {
        document.querySelector(`.post__item[data-target="${id_target}"]`).remove();
    }
    var id_target = getPostID(e);
    var data = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    }
    handlePostRequest(id_target,data,function () {
        die(id_target);
    })
}
function loadData(txt) {
    var target = document.querySelector(".post__list");
    target.innerHTML = txt;
}
function editPost(e) {
    function retrieveData(v1,v2){
        return [
            {
                target: ".form__btn",
                text: v2,
            },
            {
                target: ".editor__title",
                text: v1,
            }
        ]
    }
    var id_target = getPostID(e);
    list = retrieveData(`Modify post #${id_target}`, "Modify")
    changeMultiText(list);
    var t = document.querySelector(`.post__item[data-target="${id_target}"] .post__title`), d = document.querySelector(`.post__item[data-target="${id_target}"] .post__desc`);
    document.querySelector(`#postName`).value = t.innerText;
    document.querySelector(`#postDesc`).value = d.innerText;
    document.querySelector(`.form__btn`).setAttribute("data-target", id_target);
}
function modifyPost(id_target){
    function retrieveData(v1,v2){
        return [
            {
                target: ".form__btn",
                text: v2,
            },
            {
                target: ".editor__title",
                text: v1,
            }
        ]
    }
    function realPost(post_name, post_desc) {
        var target_post = {
            postName: post_name,
            postDesc: post_desc,
        }
        var data = {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(target_post),
        }
        handlePostRequest(id_target,data, function () {});
    }
    function resetText(id_target, post_name, post_desc) {
        document.querySelector("#postName").value = "";
        document.querySelector("#postDesc").value = "";
        changeMultiText(retrieveData("REST API Submission", "Submit"));
        document.querySelector(`.form__btn`).setAttribute("data-target", "");
        var t = document.querySelector(`.post__item[data-target="${id_target}"] .post__title`), d = document.querySelector(`.post__item[data-target="${id_target}"] .post__desc`);
        t.innerText = post_name;
        d.innerText = post_desc;
    }
    if (id_target!="") {
        var post_name = document.querySelector("#postName").value;
        var post_desc = document.querySelector("#postDesc").value;

        if (post_name&&post_desc) {
            realPost(post_name, post_desc);
            resetText(id_target, post_name, post_desc);
        } else {
            loadData("The data cannot be empty")
            return 0;
        }
    }
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
                                <a href="javascript:;" class="cta" onclick="editPost(this)">Modify</a>
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
function handlePostRequest(path="",data={}, callback=()=>{},localhost=false) {
    // will be replaced in real hosting server
    var defaultDomain = "http://localhost:3000/posts/";
    var realDomain = "https://rest-api-eta-one.vercel.app/api/posts/";
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
            .catch (
                function () {
                    loadData("Connection rejected");
                }
            )
            
    } catch (e) {
        loadData(e.message)
    }
}

handlePostRequest("",{},jsonLoadHandler);
document.querySelector(".form__btn").addEventListener("click",(e)=>{
    if (e.target.innerText=="Submit") {
        submitPost();
    } else {
        modifyPost(e.target.getAttribute("data-target"));
    }
});


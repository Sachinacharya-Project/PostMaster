const parameters_box = document.querySelector('.parameters_box')
const paramjson = document.querySelector('.paramjson')
parameters_box.style.display = "none";
const toggle_params = (cond)=>{
    if(cond.value == 'json'){
        parameters_box.style.display = "none";
        paramjson.style.display = "flex";
    }else{
        parameters_box.style.display = "flex";
        paramjson.style.display = "none";
    }
}
let counter = 2;
const update_params = (comp, function_ask)=>{
    thishtml = `
        <div class='${counter}'>
            <label for="param-${counter}">Parameter ${counter}</label>
            <input type="text" class="forkey" placeholder="Key">
            <input type="text" class="forvalue" placeholder="Value">
            <button onclick="update_params(this, 'add')">&plus;</button>
        </div>
    `
    if(function_ask == 'add'){
        parameters_box.insertAdjacentHTML("afterbegin", thishtml)
        counter++;
        const allbtns = parameters_box.querySelectorAll('div')
        allbtns.forEach(inner_div => {
            if(!inner_div.classList.contains(`${counter-1}`)){
                const btn = inner_div.querySelector('button')
                btn.innerHTML = '&minus;'
                btn.setAttribute('onclick', "update_params(this, 'remove')")
            }
        })
    }else{
        const parent = comp.parentNode;
        parent.remove()
    }
}

const timeToPost = ()=>{
    const response_here = document.querySelector('.forresponse')
    response_here.innerHTML = "Please Wait! Fetching You Request"
    // Collecting Datas
    const method = document.querySelector("input[name='requestType']:checked").value
    const content_type = document.querySelector("input[name='params']:checked").value
    let url = document.querySelector('.url-field').value || "no-url"
    if(url == 'no-url'){
        response_here.innerHTML = `
        Error 
        Cannot ${method} Empty URL
        `
    }else{
        let posting_data = {}
        if (content_type == 'json'){
            const tempdata = document.querySelector('.request_json').value
            if(tempdata != ''){
                posting_data = JSON.parse(tempdata)
            }
        }else{
            const innerdiv = parameters_box.querySelectorAll('div')
            innerdiv.forEach(minidiv => {
                const key = minidiv.querySelector('.forkey').value
                const value = minidiv.querySelector('.forvalue').value
                if(key != '' && value != ''){
                    posting_data[key] = value
                }
            })
        }

        if (method == 'POST'){
                fetch(url, {
                method: 'POST',
                body: JSON.stringify(posting_data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then((response) => response.text())
            .then((data) => {
            response_here.innerHTML = data 
            Prism.highlightAll();
            });
        }else{
            let linked_url="?";
            if(Object.keys(posting_data).length > 0){
                console.log(Object.keys(posting_data))
                const all_keys = Object.keys(posting_data)
                all_keys.forEach(minikey => {
                    linked_url += `${minikey}=${posting_data[minikey]}&`
                })
                if(linked_url.endsWith('&')){
                    linked_url = linked_url.slice(0, -1)
                }
                url = `${url}${linked_url}`
            }
            fetch(url, {
                method: 'GET',
            })
            .then((response) => response.text())
            .then((json) => {
                response_here.innerHTML = json
                Prism.highlightAll();
            });
        }
    }
}
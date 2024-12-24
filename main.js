let cursor = 0;
let line_current = 0;
let line_max = 1;
let line = "";
let text = [];

const textarea = document.getElementById("textarea")
textarea.addEventListener("input", () => {
    maren_render(textarea.value)
})
maren_render(textarea.value)

function maren_render(_text) {
    const div = document.getElementById("maren")   
    text = _text.split('\n')
    div.innerHTML = maren_scann(text)
}

function maren_render_plain(_text) {
    const div = document.getElementById("maren")   
    text = _text.split('\n')
    div.innerText = maren_scann(text)
}

function maren_scann(array) {
    let output = ""
    line_max = array.length
    array.forEach((l)=>{
        line = l
        cursor = 0
        output += maren_tokenize()
        line_current++
    })
    return output
}

function maren_peek() {
    return line[cursor]
}

function maren_peek_next() {
    if (!maren_is_at_end()) {
        return line[cursor+1]
    }
    else return null
}

function maren_is_at_end() {
    return cursor >= line.length
}

function maren_make_title() {
    let output = "<h1>"
    output += line.substring(1)
    output += "</h1>\n"
    cursor = 0
    return output
}

function maren_make_list() {
    let output = "<ul>\n"
    output += "<li>\n"
    output += line.substring(2)
    output += "</li>\n"
    output += "</ul>\n"
    cursor = 0
    return output
}

function maren_tokenize() {
    switch (maren_peek()) {
        case '#':
            if (maren_peek_next() == ' ') return maren_make_title()
        case '-':
            if (maren_peek_next() == ' ') return maren_make_list()
        default: return line
    }
}

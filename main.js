let cursor = 0;
let line_current = 0;
let line_max = 1;
let line = "";
let text = [];
let output = ""

const render_plain = false

const textarea = document.getElementById("marenarea")
textarea.addEventListener("input", () => {
    if (render_plain) maren_render_plain(textarea.value)
    else maren_render(textarea.value)
})
if (render_plain) maren_render_plain(textarea.value)
else maren_render(textarea.value)

function maren_render(_text) {
    const div = document.getElementById("maren")   
    text = _text.split('\n')
    maren_scann(text)
    div.innerHTML = output
}

function maren_render_plain(_text) {
    const div = document.getElementById("maren")   
    text = _text.split('\n')
    maren_scann(text)
    div.innerText = output
}

function maren_scann(array) {
    line_max = array.length
    line_current = 0
    output = ""
    array.forEach((l)=>{
        line = l
        cursor = 0
        maren_tokenize()
    })
    // return output
}

function maren_advance() {
    // cursor = 0
    line_current++
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

function maren_is_text_end() {
    return line_current >= line_max
}

function maren_consume() {
    if (cursor >= line.length) return
    output += line[cursor]
    cursor++
}

function maren_make_title() {
    output += "<h1>"
    output += line.substring(1)
    output += "</h1>\n"
    cursor = line.length
    maren_advance()
}

function maren_make_list() {
    output += "<ul>\n"
    output += "<li>\n"
    cursor += 2

    while (true) {
        if (maren_is_at_end()) break
        if (line[cursor] == "*") {
            maren_make_style()
        } else maren_consume()
    }

    output += "</li>\n"
    output += "</ul>\n"
    cursor = line.length
    maren_advance()
}

function maren_make_style() {
    if (maren_peek_next() == "*") {
        if (line[cursor+2] == '*' && line[cursor+3] != ' ') {
            maren_make_kurbold()
        } else if (line[cursor+2] != ' ') {
            maren_make_bold()
        }
    }
    else if (maren_peek_next() != ' ' && maren_peek_next() != '*') {
        maren_make_kursive()
    }
}

function maren_make_kursive() {
    cursor++
    output += "<i>"
    while (!maren_is_at_end()) {
        if (line[cursor] == ' ') return
        if (line[cursor] == '*') {
            cursor++
            break
        }
        maren_consume()
    }
    output += "</i>"
}

function maren_make_bold() {
    cursor += 2
    output += "<b>"
    while (!maren_is_at_end()) {
        if (line[cursor] == ' ') return
        if (line[cursor] == '*' && maren_peek_next() == "*") {
            cursor += 2
            break
        }
        maren_consume()
    }
    output += "</b>"
}

function maren_make_kurbold() {
    cursor += 3
    output += "<i><b>"
    while (!maren_is_at_end()) {
        if (line[cursor] == ' ') return
        if (line[cursor] == '*' && maren_peek_next() == "*" && line[cursor+2] == "*") {
            cursor += 3
            break
        }
        maren_consume()
    }
    output += "</b></i>"
}

function maren_make() {
    switch (line[cursor]) {
        case '#':
            if (maren_peek_next() == ' ') {
                maren_make_title()
                break
            }
        case '-':
            if (maren_peek_next() == ' ') {
                maren_make_list()
                break
            }
        case '*':
            if (maren_peek_next() != ' ') { maren_make_style() }
        default: {
            maren_consume()
        }
    }
}

function maren_tokenize() {
    cursor = 0
    while (!maren_is_at_end()) {
        maren_make()
    }
}

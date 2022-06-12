// based off of https://github.com/occidental-lang/website-word-lookup/
// need to load PapaParse before this file

var dictionary = {};
const definitionEl = document.getElementById('definition'); 

function lookupInit() {

    Papa.parse('https://raw.githubusercontent.com/Shavian-info/readlex/main/kingsleyreadlexicon.tsv', {
        download: true,
        delimiter: "\t",
        newline: "\n",
        complete:  results => {
            for(var i=0;i < results.data.length; i++) {
                var shavianWord = results.data[i][1];
                var latinWord = results.data[i][0];
                dictionary[shavianWord] = {"latin" : results.data[i][0], "partOfSpeech": results.data[i][2], "IPA": results.data[i][3],"frequency": results.data[i][4]}
            }
        }
    })

    document.onselectionchange = debounce(lookup, 1200);

    
}

function debounce(func, delay) {
    let inDebounce
    return function() {
        const context = this
        const args = arguments
        clearTimeout(inDebounce)
        inDebounce = setTimeout(() => func.apply(context, args), delay)
    }
}

function lookup() {
    
    var s = document.getSelection().toString().trim().toLowerCase();
    var punctuationless = s.replace(/[·.,\/#!$?%\^&\*;:{}=_`~()"]/g,"");
    var cleaned = punctuationless.replace(/\s{2,}/g," ");
    var selection = cleaned.split(' ');

    if (selection[0] == '') {
        console.log('selected nothing!')
        return;
    }

    console.log(`You selected: ${selection}`);

    var definitions = [];

    for (var word of selection) {
        if (word in dictionary) {
            console.log(`Looking up: ${word}`);
            definitions.push({"word": word, "info": dictionary[word]});
        } else {
            console.log(`Not in dictionary: ${word}`);
            definitions.push({"word": word, "info": '' });
        }
    }

    if (definitions.length <= 1) {
        var payload = `<h4>${definitions[0].word}</h4>
        <p>Latin : ${definitions[0].info['latin']}</p>
        <hr/>
        <p>Part of Speech : ${definitions[0].info['partOfSpeech']}</p>
        <p>IPA : ${definitions[0].info['IPA']}</p>
        <p>Frequency : ${definitions[0].info['frequency']}</p>`;
            
        displayInfo(payload)
    } else {
        var payload = '<p>';
        for (var d of definitions) {
            if (d.info != '') {
                if (d.info["latin"] != '') {
                    payload += ` ${d.info["latin"]} `
                } else {
                    payload += ` [${d.word}] `
                }
            } else {
                payload += ` [${d.word}] `
            }
            
        }
        payload += '</p>';
        displayInfo(payload)
    }

  
}

function displayInfo(htmlString) {
    definitionEl.innerHTML = '';
    
    console.log('displaying it!');

    definitionEl.innerHTML = htmlString;
    
    definitionEl.style.display = 'block';

    definitionEl.onclick = () => { definitionEl.style.display = 'none'; };
}

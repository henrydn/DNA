function lookup(codon) {
    for (const amino of aminos) {
        if (amino.codons.includes(codon))  {
            return amino;
        }
    }

    return { tlc: "", olc: "", name: "" }
}

function appendIfNotEmpty(value, postfix) {
    if (!value || value.length == 0)
    {
        return "";
    }

    return value + postfix;
}

function transcribe(e) {
    var text = $("#dna").val()

    var dna = text.replace(/[^agtcAGTC]/g, "", ).toUpperCase();

    $("#dna").val(dna);

    var rna = dna;

    if ($("#template").is(":checked"))
    {
        rna = rna          
        .replace(/A/g, "X").replace(/T/g, "A").replace(/X/g, "T")
        .replace(/G/g, "X").replace(/C/g, "G").replace(/X/g, "C");
    }

    rna = rna.replace(/T/g, "U")

    $("#rna").text(rna.replace(/.{3}/gm, e => e + " "));
    
    var amino = "";

    if ($("#threeLetterCode").is(":checked"))
    {
        amino = rna.replace(/.{1,3}/gm, e => appendIfNotEmpty(lookup(e).tlc, "-"));
    } else if ($("#oneLetterCode").is(":checked"))
    {
        amino = rna.replace(/.{1,3}/gm, e => appendIfNotEmpty(lookup(e).olc, ""));
    } else if ($("#name").is(":checked")) {
        amino = rna.replace(/.{1,3}/gm, e => appendIfNotEmpty(lookup(e).name, " "));
    }

    if (amino[amino.length - 1] == "-")
    {
        amino = amino.slice(0, amino.length - 1);
    }

    $("#amino").text(amino);
}

function copy(id) {

    var element = $(id)[0];

    var range = document.createRange();

    range.selectNodeContents($(id)[0]);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");
}

function showAminoDetails() {
    var amino = $("#amino")[0];
    var selecion = window.getSelection();

    if (selecion.baseNode && selecion.baseNode.parentElement == amino) {
        var text = selecion.baseNode.data.substr(selecion.baseOffset, selecion.extentOffset - selecion.baseOffset)

        for (const amino of aminos) {
            if (amino.tlc == text || amino.name == text || amino.olc == text)  {
                $("#aminoInfo").html(
                    `<b>Amino Information:</b><br/>
                    Name: <a href='https://en.wikipedia.org/wiki/${amino.name}'>${amino.name}</a><br/>
                    Shorthand: ${amino.tlc} (${amino.olc})<br/>
                    Properties: ${amino.properties}`);
                break;
            } else {
                $("#aminoInfo").html("");
            }
        }
    }
}

$(document).ready(() => {
    $("#dna").keyup(transcribe);
    $("#dna").keypress(transcribe);
    $("#dna").on("paste", transcribe);
    $("#template").on("change", transcribe);
    $("#coding").on("change", transcribe);

    $("#oneLetterCode").on("change", transcribe);
    $("#threeLetterCode").on("change", transcribe);
    $("#name").on("change", transcribe);

    $("#copyRna").click(() => copy("#rna"))
    $("#copyAmino").click(() => copy("#amino"))


    $(document).on("selectionchange", showAminoDetails)
})
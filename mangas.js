function readFile () {
    var hide = document.getElementsByClassName("hide");
    for (var i = 0; i < hide.length; i += 1) {
        hide[i].style.visibility = "visible";      
    }
    document.getElementById("txt").style.display = "none";
    var f = this.files[0];
    var reader = new FileReader();
    reader.onload = function () {
        extractText(reader.result);
    }
    reader.readAsText(f);
}

/*appelle useText et addText*/

function extractText(data) {
    useText(data);
    addText(mangas);
}

var mangas = []; //tableau de tableaux qui contiennent les infos pour chaque mangas

/*remplie le tableau mangas en utilisant le texte du fichier*/

function useText (texte) {
    var m = [];
    var t = "";
    var i = 0;
    if (texte[0] == " ") {
        i = 1;
    }
    for (i; i < texte.length; i += 1) {
        if (texte[i] == '\r') {
            i += 1;
        }
        if (texte[i] == '\\') {         //si le caractère est \, nouvelle case pour nouvelle info sur un manga
            m[m.length] = t;
            t = "";
        }
        else if (texte[i] == '\n') {        //si il y a un saut de ligne, nouveau manga crée
            m[m.length] = t;
            t = "";
            mangas[mangas.length] = m;
            m = [];
        }
        else {
            t += texte[i];
        }
        if (i == texte.length - 1) {
            m[m.length] = t;
            mangas[mangas.length] = m;
        }
    }

    mangas = mangas.sort(triAlphabetique);      //appelle le tri
}

/*trie le tableau par ordre alphabétique par rapport aux noms des mangas*/

function triAlphabetique (x, y) {
    if (x[0] < y[0]) {
        return -1;
    }
    if (x[0] > y[0]) {
        return 1;
    }
    return 0;
}

/*crée et remplie les cases du tableau de mangas*/

function addText() {
    var tab = document.getElementById("tab");
    for (var i = 0; i < mangas.length; i += 1) {
        var tr = document.createElement("tr"); //crée une ligne
        tab.appendChild(tr);
        var td = document.createElement("td"); //compteur de mangas
        td.innerHTML = (i + 1).toString();
        tr.appendChild(td);
        for (var j = 0; j < mangas[i].length; j += 1) {
            var td = document.createElement("td"); //crée une case
            td.innerHTML = mangas[i][j];
            if (j == 2) {   //mets un id sur la case pour modifier le compteur de chapitres plus tard
                td.id = "chap" + i.toString();
            }
            if (j == 3) {   //crée le lien dans la case lien
                td.setAttribute("class", "small")
                td.innerHTML = mangas[i][j];
                td.style.maxWidth = "250px";
                td.style.wordWrap = "break-word";
            }
            tr.appendChild(td);
            if (j == 2) {   //si on est au compteur de chapitres, ajoute une colonne just après avec 2 boutons pour augmenter ou diminuer le nombre
                var b1 = document.createElement("button");
                var b2 = document.createElement("button");
                b1.id = i.toString() + "_1";
                b2.id = i.toString() + "_2";
                b1.innerText = "-";
                b2.innerText = "+";
                b1.addEventListener("click", boutonMoins);
                b2.addEventListener("click", boutonPlus);
                var td = document.createElement("td");
                td.appendChild(b1);
                td.appendChild(b2);
                tr.appendChild(td);
            }
        }
    }
}

/*event bouton moins*/

function boutonMoins () {
    var id = this.id;
    var t = "";
    var i = 0;
    while (t != '_') {
        t = id[i];
        i += 1;
    }
    id = id.slice(0, i-1);
    mangas[id][2] -= 1;
    id = "chap" + id;
    var td = document.getElementById(id);
    i = parseInt(td.innerHTML) - 1;
    td.innerHTML = i;
}

/*event bouton plus*/

function boutonPlus () {
    var id = this.id;
    var t = "";
    var i = 0;
    while (t != '_') {
        t = id[i];
        i += 1;
    }
    id = id.slice(0, i-1);
    mangas[id][2] += 1;
    id = "chap" + id;
    var td = document.getElementById(id);
    i = parseInt(td.innerHTML) + 1;
    td.innerHTML = i;
}

function tabToText () {
    var newtxt = "";
    var t = document.getElementById("tab");
    t = t.getElementsByTagName("tr");
    for (var i = 1; i < t.length; i += 1) {
        var l = t[i].getElementsByTagName("td");;
        var c = l[1].innerHTML + "\\" + l[2].innerHTML + "\\" + l[3].innerHTML + "\\";
        c += l[5].innerHTML + "\\";
        c += l[6].innerHTML;
        newtxt += c;
        if (i < t.length - 1) {
            newtxt += '\n';
        }
    }
    return newtxt;
}

function download () {
    var a = document.createElement("a");
    a.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(tabToText()));
    a.setAttribute('download', "mangas.txt");
    document.body.appendChild(a);
    a.click()
    document.body.removeChild(a);
}

function searchBar (e) {
    var value = e.target.value.toLowerCase();
    var i = 1;
    mangas.forEach(manga => {
        var isVisible = manga[0].toLowerCase().includes(value) || manga[1].toLowerCase().includes(value) || manga[3].toLowerCase().includes(value);
        var tr = document.getElementsByTagName("tr");
        if (!isVisible) {
            tr[i].style.visibility = "collapse";
        }
        else {
            tr[i].style.visibility = "visible";
        }
        i += 1;
    });
}

function creerFenetre () {
    var elts = document.getElementsByClassName("body");
    for (var i = 0; i < elts.length; i += 1) {
        elts[i].style.display = "none";
    }
    var fen = document.createElement("div");
    fen.id = "fenetre";
    fen.style.height = "80%";
    fen.style.width = "50%";
    fen.style.backgroundColor = "lightgray";
    document.body.appendChild(fen);
    fen.style.top = "10%";
    fen.style.left = "25%";
    fen.style.position = "absolute";
    fen.style.borderRadius = "10px";
    fen.style.border = "darkgrey 2px solid";
    creerFormulaire();
    boutonAnnuler();
    boutonAjouter();
}

function boutonAnnuler () {
    var fen = document.getElementById("fenetre");
    var butq = document.createElement("button");
    butq.innerHTML = "Annuler";
    butq.style.position = "absolute";
    butq.style.top = "90%";
    butq.style.left = "80%";
    butq.style.borderRadius = "0";
    butq.style.height = "2rem";
    butq.style.width = "15%";
    butq.style.fontSize = "12pt";
    butq.style.backgroundColor = "white";
    butq.style.border = "none";
    butq.addEventListener("click", supprimerFenetre);
    fen.appendChild(butq);
}

function boutonAjouter () {
    var fen = document.getElementById("fenetre");
    var ajout = document.createElement("input");
    ajout.type = "submit";
    ajout.innerHTML = "Ajouter";
    ajout.style.position = "absolute";
    ajout.style.top = "90%";
    ajout.style.left = "60%";
    ajout.style.borderRadius = "0";
    ajout.style.height = "2rem";
    ajout.style.width = "15%";
    ajout.style.fontSize = "12pt";
    ajout.style.backgroundColor = "white";
    ajout.style.border = "none";
    fen.appendChild(ajout);
    ajout.addEventListener("click", ajouterManga);
}

function supprimerFenetre () {
    var elts = document.getElementsByClassName("body");
    for (var i = 0; i < elts.length; i += 1) {
        elts[i].style.removeProperty("display");
    }
    var fen = document.getElementById("fenetre");
    fen.remove();
}

function creerFormulaire () {
    var fen = document.getElementById("fenetre");
    var form = document.createElement("form");
    form.id = "formulaire";
    form.style.fontFamily = "Arial";
    fen.appendChild(form);
    creerBarreNom();
    creerBarreType();
    creerCompteurChapitre();
    creerBarreAlternateTitle();
    creerBarreFrequency();
}

function creerBarreNom () {
    var form = document.getElementById("formulaire");
    var nom = document.createElement("input");
    var label = document.createElement("label");
    nom.type = "textarea";
    nom.id = "barreNom";
    label.for = "barreNom";
    label.innerHTML = "Nom du nouveau Manga";
    form.appendChild(label);
    form.appendChild(nom);
    nom.style.width = "80%";
    nom.style.height = "8%";
    nom.style.left = "10%";
    nom.style.borderRadius = "10px";
    nom.style.border = "white 1px solid";
    nom.style.fontSize = "12pt";
    nom.style.top = "8%";
    nom.style.position = "absolute";
    label.style.marginLeft = "15%";
    label.style.position = "absolute";
    label.style.top = "2%";
}

function creerBarreType () {
    var form = document.getElementById("formulaire");
    var type = document.createElement("input");
    var label = document.createElement("label");
    type.type = "textarea";
    type.id = "barreType";
    label.for = "barreType";
    label.innerHTML = "Type";
    form.appendChild(label);
    form.appendChild(type);
    type.style.width = "50%";
    type.style.height = "8%";
    type.style.left = "10%";
    type.style.borderRadius = "10px";
    type.style.border = "white 1px solid";
    type.style.fontSize = "12pt";
    type.style.top = "26%";
    type.style.position = "absolute";
    label.style.left = "15%";
    label.style.position = "absolute";
    label.style.top = "20%";
}

function creerCompteurChapitre () {
    var form = document.getElementById("formulaire");
    var cpt = document.createElement("input");
    var label = document.createElement("label");
    cpt.type = "textarea";
    cpt.id = "cptChap";
    label.for = "cptChap";
    label.innerHTML = "Chapitres";
    form.appendChild(label);
    form.appendChild(cpt);
    cpt.style.width = "20%";
    cpt.style.height = "8%";
    cpt.style.left = "70%";
    cpt.style.borderRadius = "10px";
    cpt.style.border = "white 1px solid";
    cpt.style.fontSize = "12pt";
    cpt.style.top = "26%";
    cpt.style.position = "absolute";
    label.style.left = "75%";
    label.style.position = "absolute";
    label.style.top = "20%";
}

function creerBarreAlternateTitle () {
    var form = document.getElementById("formulaire");
    var alternate = document.createElement("input");
    var label = document.createElement("label");
    alternate.type = "textarea";
    alternate.id = "alternateTitle";
    label.for = "alternateTitle";
    label.innerHTML = "Alternate Title(s)";
    form.appendChild(label);
    form.appendChild(alternate);
    alternate.style.width = "80%";
    alternate.style.height = "8%";
    alternate.style.left = "10%";
    alternate.style.borderRadius = "10px";
    alternate.style.border = "white 1px solid";
    alternate.style.fontSize = "12pt";
    alternate.style.top = "44%";
    alternate.style.position = "absolute";
    label.style.left = "15%";
    label.style.position = "absolute";
    label.style.top = "38%";
}

function creerBarreFrequency () {
    var form = document.getElementById("formulaire");
    var frequency = document.createElement("input");
    var label = document.createElement("label");
    frequency.type = "textarea";
    frequency.id = "frequency";
    label.for = "frequency";
    label.innerHTML = "Frequency";
    form.appendChild(label);
    form.appendChild(frequency);
    frequency.style.width = "80%";
    frequency.style.height = "8%";
    frequency.style.left = "10%";
    frequency.style.borderRadius = "10px";
    frequency.style.border = "white 1px solid";
    frequency.style.fontSize = "12pt";
    frequency.style.top = "62%";
    frequency.style.position = "absolute";
    label.style.left = "15%";
    label.style.position = "absolute";
    label.style.top = "56%";
}

function ajouterManga () {
    var form = document.getElementById("formulaire");
    var elts = form.elements;
    var m = [];
    for (var i = 0; i < 5; i += 1) {
        m[i] = elts[i].value;
    }
    mangas[mangas.length] = m;
    mangas.sort(triAlphabetique);
    supprimerFenetre();
    viderTableau();
    addText();
}

function viderTableau () {
    var tab = document.getElementById("tab");
    var trs = tab.getElementsByTagName("tr");
    for (var i = 1; i < trs.length; ) {
        trs[i].remove();
    }
}

function addManga () {
    creerFenetre();
}

window.onload = main;

var tabDebut;

function main () {
    document.getElementById("search").addEventListener("input", searchBar, false);
    document.getElementById("txt").addEventListener("change", readFile, false);
    document.getElementById("but").addEventListener("click", download, false);
    document.getElementById("add").addEventListener("click", addManga, false);
}
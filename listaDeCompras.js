const prompt = require('prompt-sync')();
const editJsonFile = require("edit-json-file");

let file = editJsonFile('loja.json');
file.save()

let app = true;

let menu = [
    'adicionar',
    'remover',
    'listar',
    'sair'
]

function atualizar(contagem, categoria, itens){
    try{
        file.unset(`dados.${contagem}`)
        file.set(`dados.${contagem}`, {categoria: categoria, itens: itens})
        file.save()
    } catch(err){
        console.log(err)
    }
}

function adicionar(){
    let loop = true;
    while(loop){
        let desicao = prompt("Você deseja adicionar algum produto na sua lista de compras? Y/N ");
        if(desicao == 'Y' || desicao == 'y'){
            let item = prompt("Qual produto você deseja adicionar? ");
            let categoria = prompt("Em qual categoria esse produto se encaixa? ");
            let erroCategoria = true;
            let erroItem = false;
            let contagemCategoria = 0;
            //caso não tiver nada dentro do json
            if(file.get("dados") == undefined){
                let itens = [item]
                try {
                    file.append("dados", {categoria: categoria, itens: itens})
                    file.save();
                    erroCategoria = false;
                    console.log("--------------\nComo a lista estava vazia, essa é o seu primeiro registro!\n--------------")
                } catch(err) {
                    console.log(err);
                }
            } else {
                file.get("dados").forEach(i => {
                    let itens = i.itens;
                    if(i.categoria == categoria){
                        erroCategoria = false;
                        if(i.itens == ""){
                            //não tem itens dentro do array
                            itens.push(item)
                            atualizar(contagemCategoria, categoria, itens)
                        } else {
                            let b = 1
                            let adicionar = false;
                            i.itens.forEach(e => {
                                if(e == item){
                                    //tem um igual ao digitado dentro do array
                                    erroItem = true;
                                    adicionar = false;
                                } else {
                                    //já tem itens dentro do array
                                    adicionar = true;
                                }
                            })
                            if(adicionar){
                                itens.push(item)
                                atualizar(contagemCategoria, categoria, itens)
                            }
                        }
                    }
                    contagemCategoria++
                })
            }
            if(erroCategoria){
                console.log("--------------\nEssa categoria não existe!\n--------------")
                let decisaoCategoria = prompt("Deseja criar uma nova categoria? Y/N ");
                if(decisaoCategoria == "Y" || decisaoCategoria == "y"){
                    file.append("dados", {categoria: categoria, itens: [item]});
                    file.save()
                }
            }
            if(erroItem){
                console.log("--------------\nEsse item já existe!\n--------------")
            }
        } else {
            loop = false;
        }
    }
}

function remover(){
    console.log("--------------")
    let escolha = prompt("Você deseja remover item ou categoria? ")
    if(escolha == 'item'){
        let item = prompt("Qual? ")
        //caso não tiver nada dentro do json
        if(file.get("dados") == undefined){
            console.log("A lista está vazia...")
            prompt("ok? ")
        } else {
            file.get("dados").forEach(i => {
                let index = file.get("dados").indexOf(i, 0);
                i.itens.forEach(e => {
                    if(e == item){
                        let arr = i.itens;
                        arr.splice(arr.indexOf(item), 1)
                        try{
                            //file.set(`dados.${index}`, {categoria: i.categoria, itens: []})
                            //por algum motivo funciona sem issokkkkkk muito brabo
                            file.save();
                        } catch(err){
                            console.log(err)
                        }
                    }
                })
            })
            console.log("--------------\nRemovido com sucesso")
            prompt("ok? ")
        }
    } else if(escolha == 'categoria'){
        let categoria = prompt("Qual? ")
        let arr = [];
        let remover = '';
        //caso não tiver nada dentro do json
        if(file.get("dados") == undefined){
            console.log("A lista está vazia...")
            prompt("ok? ")
        } else {
            file.get("dados").forEach(i => {
                arr.push(i);
                if(i.categoria == categoria){
                    remover = i;
                }
            })
            if(remover != ''){
                arr.splice(arr.indexOf(remover), 1);
                
            } else {
                console.log("Você deve ter digitado errado...")
            }
            try{
                file.set("dados")
                file.save()
            } catch(err){
                console.log(err)
            }
            
            arr.forEach(i => {
                try{
                    file.append("dados", {categoria: i.categoria, itens: i.itens})
                    file.save()
                } catch(err){
                    console.log(err);
                }
            })
            console.log("--------------\nRemovido com sucesso")
            prompt("ok? ")
        }
    } else {
        console.log("Você deve ter digitado errado...")
        console.log("--------------")
        prompt("ok? ")
    }
}

function listar(){
    console.log("--------------")
    if(file.get("dados") == undefined){
        console.log("A lista está vazia...")
    } else {
        file.get("dados").forEach(i => {
            console.log(`${i.categoria}:`)
            contagem = 0
            i.itens.forEach(e => {
                contagem++
                console.log(`   ${contagem}: ${e}`)
            })
        })
    }
    console.log("--------------")
    prompt("ok? ")
}

function sair(){
    app = false;
}

while(app){
    console.clear()
    console.log("-----MENU-----")
    menu.forEach((i) => {
        console.log(i)
    })
    console.log("--------------")
    let opcaoMenu = prompt("Digite a opção que deseja: ");
    if(opcaoMenu == menu[0]){
        adicionar();
    } else if(opcaoMenu == menu[1]){
        remover();
    } else if(opcaoMenu == menu[2]){
        listar();
    } else if(opcaoMenu == menu[3]){
        sair();
    }
}
const chalk = require('chalk');

const inquirer = require('inquirer');

// Modulos internos

const fs = require('fs');
const { parse } = require('path');

operation()

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }]).then((answer)=>{
        const action = answer['action']
        
        
        if(action === 'Criar conta'){
            createAccount();
        }
        else if(action === 'Consultar saldo'){
            getAccountBallance()
        }
        else if(action === 'Depositar'){
            deposit()
        }
        else if(action === 'Sacar'){
            withDraw()
        }
        else if(action === 'Sair'){
            console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"))
            process.exit()
        }
    }).catch(err => console.log(err))
}

// Create an account
function createAccount(){
    console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco!"));
    console.log(chalk.green("Defina as opções da sua conta a seguir"))
    buildAccount()
}

function buildAccount(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite seu nome:'
    }]).then((answer)=>{
        const accountName = answer['accountName'] 
        console.info(accountName);

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts');
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black("Está conta já existe!"));
            buildAccount()
            return    
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}',
            function(err){
                console.log(err)
            }
        )

        console.log(chalk.green("Parabéns, conta criada!"));
        operation()
    }).catch(err => console.log(err))
}

// Add an amount to user account
function deposit(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite o nome da conta para depositar:'
    }]).then((answer) => {
        const accountName = answer['accountName']

        
        if(verifyAccount(accountName)){
            inquirer.prompt([{
                name: 'amount',
                message: "Valor do depósito:"
            }]).then(answer =>{
                const amount = answer['amount'];

                addAmount(accountName, amount);
                operation()

            })
        } else{
            deposit()
        }
    })
}

// very if an account exist

function verifyAccount(accountName){
    if(fs.existsSync(`accounts/${accountName}.json`)){
        return true
    }else{
        console.log(chalk.bgRed.black("Está conta não existe!"));
        return false
    }
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black("Erro, tente mais tarde!"))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData),
        function(err){
            console.log(err);
        })
    console.log(chalk.green("Deposito realizado com sucesso!"))
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

//show account ballance
function getAccountBallance(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite o nome da conta:'
    }]).then(answer => {
        const accountName = answer["accountName"]

        if(!verifyAccount(accountName)){
            getAccountBallance()
        }

        const accountData = getAccount(accountName);

        console.log(chalk.bgBlue.black(`Seu saldo é: R$${accountData.balance}`))

        operation()
    })
}

//get an mount from user account

function withDraw(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite o nome da conta:'
    }]).then(answer => {
        const accountName = answer["accountName"]

        if(!verifyAccount(accountName)){
            withDraw()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Valor do saque:'
        }]).then(answer => {

            const amount = answer["amount"]

            removeAmount(accountName, amount)

            operation()
        })
        
    })
    

}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName);

    if(!amount){
        console.log(chalk.bgRed.black("Erro, tente mais tarde!"))
    }

    if(parseFloat(accountData.balance) >= parseFloat(amount)){
        accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    }else{
        console.log(chalk.bgRed.black("Saldo insuficiente!"))
        return
    }
    

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData),
    function(err){
        console.log(err);
    })

    console.log(chalk.green("Saque realizado com sucesso!"))
}
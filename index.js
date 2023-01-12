#!/user/bin/env node
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
var balance = 1000;
var label = `             ,d                        
             88                        
,adPPYYba, MM88MMM 88,dPYba,,adPYba,   
""     'Y8   88    88P'   "88"    "8a  
,adPPPPP88   88    88      88      88  
88,    ,88   88,   88      88      88  
'"8bbdP"Y8   "Y888 88      88      88`;
const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
};
async function welcome() {
    let title = chalkAnimation.rainbow("Welcome to JH ATM Service\n");
    await sleep();
    title.stop();
    let labelAnim = chalkAnimation.rainbow(label);
    await sleep();
    labelAnim.stop();
}
await welcome();
async function askQuestion() {
    const answers = await inquirer
        .prompt([
        /* Pass your questions in here */
        {
            type: "number",
            name: "id",
            message: "\nEnter your UserID: "
        },
        {
            type: "password",
            name: "pin",
            message: "\nEnter your PIN: ",
            mask: '*',
            validate: function (value) {
                if (value.length != 4) {
                    return true;
                }
                return 'Invalid PIN';
            }
        },
        {
            type: 'list',
            name: 'choice',
            message: 'Please select an option:',
            choices: [
                { name: 'Check Balance', value: 'check' },
                { name: 'Withdraw', value: 'withdraw' },
                { name: 'Deposit', value: 'deposit' },
                { name: 'Quit', value: 'quit' }
            ]
        }
    ]);
    inquirer.prompt(answers).then(errors => {
        console.log(errors);
    });
    if (answers.choice === 'check') {
        console.log(`Your current balance is: $${balance}`);
    }
    else if (answers.choice === 'withdraw') {
        const { amount } = await inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: 'How much would you like to withdraw?',
                validate: (input) => {
                    if (Number(input) > balance) {
                        return 'Insufficient funds.';
                    }
                    if (Number(input) < 0) {
                        return 'Amount should be greater than zero.';
                    }
                    return true;
                }
            }
        ]);
        balance -= Number(amount);
        console.log(`\nYou have successfully withdrawn $${amount}`);
        console.log(`Your current balance is: $${balance}\n`);
    }
    else if (answers.choice === 'deposit') {
        const { amount } = await inquirer.prompt([
            {
                type: 'input',
                name: 'amount',
                message: 'How much would you like to deposit?',
                validate: (input) => {
                    if (Number(input) < 0) {
                        return 'Amount should be greater than zero.';
                    }
                    return true;
                }
            }
        ]);
        balance += Number(amount);
        console.log(`\nYou have successfully deposit $${amount}`);
        console.log(`Your current balance is: $${balance}\n`);
    }
    else if (answers.choice === 'quit') {
        console.log('\nThank you for using the ATM!\n');
    }
}
async function restartTransaction() {
    do {
        await askQuestion();
        var again = await inquirer.prompt([
            {
                type: "input",
                name: "restart",
                message: "Do you want to continue? Press y or n"
            },
        ]);
    } while (again.restart == 'y' || again.restart == 'Y' || again.restart == 'yes' || again.restart == 'Yes' || again.restart == 'YES');
}
restartTransaction();

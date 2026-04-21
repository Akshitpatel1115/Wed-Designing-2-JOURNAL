const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\n1. Create File \n2. Read File \n3. Append File \n4. Rename File \n5. Delete File \n0. Exit");


    rl.question("\nEnter your choice: ", (choice) => {
        const num = parseInt(choice);

        if (isNaN(num)) {
            console.log("\nInvalid input, Try with numbers!\n");
            return showMenu();
        }

        switch (num) {
            case 1:
                return createFile();
            case 2:
                return readFile();
            case 3:
                return updateFile();
            case 4:
                return renameFile();
            case 5:
                return deleteFile();
            case 0:
                console.log("\nExiting...");
                rl.close();
                break;
            default:
                console.log("\nInvalid choice!\n");
                showMenu();
        }
    });
}

function createFile() {
    rl.question("\nEnter file name: ", (filename) => {
        rl.question("Enter content: ", (content) => {

            fs.writeFile(filename, content, (err) => {
                if (err) throw err;
                console.log("\nFile created successfully!\n");
                showMenu();
            });

        });
    });
}

function deleteFile() {
    rl.question("\nEnter file name: ", (filename) => {
        fs.unlink(filename, (err) => {
            if (err) throw err;
            console.log("\nFile Deleted!\n");
            showMenu();
        });
    });
}

function updateFile() {
    rl.question("\nEnter file name: ", (filename) => {
        rl.question("Enter file content: ", (content) => {
            fs.appendFile(filename, content, (err) => {
                if (err) throw err;
                console.log("\nFile Updated!\n");
                showMenu();
            });
        });
    });
}

function renameFile() {
    rl.question("\nEnter file name: ", (filename) => {
        rl.question("Enter New file name: ", (newName) => {
            fs.rename(filename, newName, (err) => {
                if (err) throw err;
                console.log("\nFile Renamed!\n");
                showMenu();
            });
        });
    });
}

function readFile() {
    rl.question("\nEnter file name: ", (filename) => {
        fs.readFile(filename, "utf8", (err, data) => {
            if (err) {
                console.log("\nError reading file\n");
            } else {
                console.log("\nContent: ",data,"\n");
            }
            showMenu();
        });
    });
}

showMenu();
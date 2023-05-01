# SearchAPI Project

## Setting up

To begin the project, import `expresss`, `body-parser`, `cors`, `axios`, and `cheerio` through the terminal. Next, type the command `npm start` into the terminal in order to start up the project. After that the message `Hello world app listening on port 3001` should show up in the terminal, which means the project has successful started up and the user can begin to type in their data.

## Entering data

To begin typing in data, first open the file titled `dataForm.HTML` by right-clicking on it, and pressing "Copy Path," and then pasting the path to your browser. The form should prompt the user to input the user to enter a key, a value to search, and the max number of results. For the key, the user should enter the desired website to crawl. For the value to search, the user should enter the desired word to search. For the max number of results, the user should enter the maximum number of results. After all fields are filled, press "Submit" and go back to the terminal in VS code. There, the user should see `[Object: null prototype]{ key: ___, s: ___, max: ___ }` followed by a string of websites constantly printing. Once all printing has stopped, that indicates that the code has finished running, and the user's data is ready to be collected.

## Receiving data

There's two ways for the user to receive their data: either by opening the file titled `data.json` or opening `dataList.js` in the browser. `data.json` holds the json version of the data, while `dataList.js` displays the data using modals.